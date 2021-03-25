import {resolve} from 'path';
import {Command} from 'commander';
import { SourceFactory } from './source';
import { Analyzer } from './analyzer';


export function cli(){
    const program = new Command();
    program.version('1.0.0', '-v, --version', 'current version');
    program.arguments('[event]');
    program.option('-f, --format <format>', 'format of file', 'json');
    program.option('-c, --config <path>', 'path of file', process.cwd());
    program.option('-n, --name-file <name>', 'name file', '.preactionrc');
    program.option('-s, --stop', 'stop process when condition failed', true);
    program.action((event, options) => {
        const mainConfigRoot = SourceFactory.read(
            resolve(options.config, options.nameFile),
            options.format
        );
        Analyzer.process(
            mainConfigRoot[event],
            options
        );
    });
    program.parse(process.argv);
}