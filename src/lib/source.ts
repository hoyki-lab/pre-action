import {readFileSync} from 'fs';
import {parse as Json5Parse} from 'json5';
import {parse as YamlParse} from 'yaml';
import {parse as TomlParse} from 'toml';
import {fromString as EcldParse} from 'ecld';

export abstract class SourceFactory{

    static read(path : string, format : string){
        const source = readFileSync(path, {
            encoding: 'utf-8'
        });
        switch(format){
            case 'json':
                return JSON.parse(source);
            case 'json5':
                return Json5Parse(source);
            case 'yaml':
                return YamlParse(source);
            case 'toml':
                return {
                    ...TomlParse(source)
                };
            case 'ecld':
                return EcldParse(source);
        }
    }

}