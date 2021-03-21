import {resolve} from 'path';
import {Command} from 'commander';
import { SourceFactory } from './source';
import { Analyzer } from './analyzer';


export function cli(){
    const program = new Command();
    program.version('1.0.0', '-v, --version', 'current version');
    program.arguments('<event>')
    program.option('-f, --format', 'format of file', 'json');
    program.option('-c, --config', 'path of file', process.cwd());
    program.option('-n, --name-file', 'name file', '.preactionrc');
    program.parse(process.argv);
    program.action((event, options) => {
        const mainConfigRoot = SourceFactory.read(
            resolve(options.config, options.nameFile),
            options.format
        );
        Analyzer.process(
            mainConfigRoot[event],
            options.config
        );
    });
}