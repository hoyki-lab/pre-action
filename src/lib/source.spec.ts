import * as Mock from 'mock-fs';
import {SourceFactory} from './source';

describe('Source Test', () => {

    afterEach(() => {
        Mock.restore();
    });

    test('Parse json data from source', () => {
        Mock({
            '/box': {
                'file.json': `
                    {
                        "value": 100
                    }
                `
            }
        });
        const data = SourceFactory.read(
            '/box/file.json',
            'json'
        );
        expect(
            data
        ).toStrictEqual(
            {
                value: 100
            }
        );
    });

    test('Parse json5 data from source', () => {
        Mock({
            '/box': {
                'file.json': `
                    {
                        "value": +100
                    }
                `
            }
        });
        const data = SourceFactory.read(
            '/box/file.json',
            'json5'
        );
        expect(
            data
        ).toStrictEqual(
            {
                value: 100
            }
        );
    });

    test('Parse yaml data from source', () => {
        Mock({
            '/box': {
                'file.yml': `
                    value: 100
                `
            }
        });
        const data = SourceFactory.read(
            '/box/file.yml',
            'yaml'
        );
        expect(
            data
        ).toStrictEqual(
            {
                value: 100
            }
        );
    });

    test('Parse toml data from source', () => {
        Mock({
            '/box': {
                'file.toml': `
                    value = 100
                `
            }
        });
        const data = SourceFactory.read(
            '/box/file.toml',
            'toml'
        );
        expect(
            data
        ).toStrictEqual(
            {
                value: 100
            }
        );
    });

});