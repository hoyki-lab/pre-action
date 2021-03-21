import {isAbsolute, resolve} from 'path';
import {SourceFactory} from './source';
import {has as ObjectHas, get as ObjectGet} from 'dot-prop';

export abstract class Analyzer{

    static process(
        root : RootDefinition | RootDefinition[],
        cwd : string
    ){
        const rootAnalyzer = new RootAnalyzer(
            root,
            cwd
        );
        rootAnalyzer.analyze();
    }

}

class RootAnalyzer{

    constructor(
        private _root : RootDefinition | RootDefinition[],
        private _cwd : string,
    ){}

    analyze(){
        const root = this._root instanceof Array ? this._root : [this._root];
        root.forEach((element) => {
            const filePath = isAbsolute(element.file) 
                ? element.file 
                : resolve(this._cwd, element.file);
            const dataSource = SourceFactory.read(
                filePath,
                element?.format ?? 'json'
            );
            this.search(
                element.content,
                dataSource,
                filePath,
                ''
            );
        });
    }

    private search(
        contentRoot: any,
        contentSource : any,
        file : string,
        location : string
    ){
        if(!contentRoot) return;
        const keys = Object.keys(contentRoot);
        keys.forEach((element) => {
            const ref = contentRoot[element];
            let actualLocation = location + 
                                (!(location === '') ? '.' : '') +
                                element;
            if(ref.required === true){
                if(!ObjectHas(contentSource, actualLocation)){
                    console.error(`In file: ${file} -> '${actualLocation}' pattern dont exists`);
                    process.exit(1);
                }
            }
            if(ref.warning === true){
                if(!ObjectHas(contentSource, actualLocation)){
                    // TODO
                }
            }
            if(ObjectHas(ref, 'content')){
                this.search(
                    ref.content,
                    contentSource,
                    file,
                    actualLocation
                );
            }
        });
    }

}

export type RootDefinition = {
    file : string,
    format: 'json' | 'json5' | 'yaml' | 'toml' | 'elcd',
    content : any
}