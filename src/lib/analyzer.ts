import {isAbsolute, resolve} from 'path';
import {SourceFactory} from './source';
import {has as ObjectHas} from 'dot-prop';

export abstract class Analyzer{

    static process(
        root : RootDefinition | RootDefinition[]
    ){
        const cwd = process.cwd();
        const rootAnalyzer = new RootAnalyzer(
            root,
            cwd
        );
    }

}

class RootAnalyzer{

    constructor(
        private _root : RootDefinition | RootDefinition[],
        private _cwd : string,
    ){}

    analyze(){
        const root = this._root instanceof Array ? this._root : [this._root];
        const warningOutput = [];
        root.forEach((element) => {
            const warning = [];
            const dataSource = SourceFactory.read(
                isAbsolute(element.file) 
                    ? element.file 
                    : resolve(this._cwd, element.file),
                element?.format ?? 'json'
            );
            this.search(
                element.content,
                dataSource,
                warning,
                ''
            );
            warningOutput.push(
                warning
            );
        });
    }

    private search(
        contentRoot: any,
        contentSource : any,
        warnings : any[],
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
                    console.error('');
                    process.exit(1);
                }
            }
            if(ref.warning === true){
                if(!ObjectHas(contentSource, actualLocation)){
                    console.error('');
                    process.exit(1);
                }
            }
            if(ObjectHas(contentRoot, 'content')){
                this.search(
                    contentRoot.content,
                    contentSource,
                    warnings,
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