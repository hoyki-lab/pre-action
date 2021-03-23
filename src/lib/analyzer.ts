import {isAbsolute, resolve, normalize} from 'path';
import {existsSync} from 'fs';
import {SourceFactory} from './source';
import * as Inquirer from 'inquirer';
import {has as ObjectHas} from 'dot-prop';

export abstract class Analyzer{

    static async process(
        root : RootDefinition | RootDefinition[],
        options : OptionsAnalyzer
    ){
        const rootAnalyzer = new RootAnalyzer(
            root,
            options
        );
        await rootAnalyzer.analyze();
    }

}

class RootAnalyzer{

    constructor(
        private _root : RootDefinition | RootDefinition[],
        private _options : OptionsAnalyzer,
    ){}

    async analyze(){
        const root = this._root instanceof Array ? this._root : [this._root];
        const errors = [];
        for(const key in root){
            const element = root[key];
            const filePath = isAbsolute(element.file) 
                ? element.file 
                : resolve(this._options.config, element.file);
            // Analyze key 'exists' for file
            if(element.exists === true){
                this.existsFile(filePath);
                continue;
            }
            const dataSource = SourceFactory.read(
                filePath,
                element?.format ?? 'json'
            );
            if(typeof element.extends === 'string'){
                element.content = {
                    ...(RootAnalyzerUtil.getExtends(element.extends)),
                    ...element.content ?? {}
                }
            }
            await this.search(
                element.content,
                dataSource,
                filePath,
                errors,
                ''
            );
        }
        if(errors.length > 0){
            errors.forEach((element) => {
                console.error(element);
            });
            process.exit(1);
        }
    }

    private async search(
        contentRoot: any,
        contentSource : any,
        file : string,
        errors : string[],
        location : string
    ){
        if(!contentRoot) return;
        for(const element in contentRoot){
            const ref = contentRoot[element];
            let actualLocation = location + 
                                (!(location === '') ? '.' : '') +
                                element;
            if(ref.required === true){
                if(!ObjectHas(contentSource, actualLocation)){
                    const message = `In file: ${file} -> '${actualLocation}' pattern dont exists`;
                    if(this._options.stop){
                        console.error(message);
                        process.exit(1);
                    }else{
                        errors.push(message);
                    }
                }
            }
            if(ref.warning === true){
                if(!ObjectHas(contentSource, actualLocation)){
                    const answers = await Inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'question',
                                default: true,
                                message: `In file: ${file} -> '${actualLocation}' pattern dont exists, continue?`
                            },
                        ]);
                    if(!answers.question){
                        console.error(`In file: ${file} -> '${actualLocation}' pattern dont exists`);
                        process.exit(1);
                    }
                }
            }
            if(ObjectHas(ref, 'content')){
                await this.search(
                    ref.content,
                    contentSource,
                    file,
                    errors,
                    actualLocation
                );
            }
        }
    }

    private existsFile(
        file: string,
    ){
        if(!existsSync(file)){
            console.error(`File: ${file} -> dont exists`);
            process.exit(1);
        }
    }

}

export abstract class RootAnalyzerUtil{

    public static getExtends(extend : string){
        return require(normalize(extend + '/index.json'));
    }

}

export type RootDefinition = {
    file : string,
    format: 'json' | 'json5' | 'yaml' | 'toml' | 'elcd',
    exists?: boolean,
    extends?: string,
    content? : any
}

export type OptionsAnalyzer = {
    config? : string,
    format?: string,
    nameFile?: string,
    stop? : boolean
}