import * as MockFs from 'mock-fs';
import {mockProcessExit} from 'jest-mock-process';
const mockConsole = require("jest-mock-console");
import {Analyzer} from './analyzer';
describe('Analyzer', () => {

    let mockExit : ReturnType<typeof mockProcessExit>;
    let restoreConsole : () => void;

    beforeEach(() => {
        mockExit = mockProcessExit();
        restoreConsole = mockConsole();
    });

    afterEach(() => {
        MockFs.restore();
        restoreConsole();
    });

    test('Generate exit code "1" if required dont exists', () => {
        MockFs({
            '/box': {
                'file.json': `
                    {
                        "key2": "value"
                    }
                `
            }
        });
        Analyzer.process(
            {
                file: "./file.json",
                format: "json",
                content: {
                    key: {
                        required: true
                    }
                }
            },
            '/box'
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "'key' pattern dont exists"
            ]
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('Generate exit code "1" if required dont exists (sub levels)', () => {
        MockFs({
            '/box': {
                'file.json': `
                    {
                        "key2": {
                            "key2_1": {
                                "key_2_1_3": 1,
                                "key_2_1_2": 2
                            }
                        }
                    }
                `
            }
        });
        Analyzer.process(
            {
                file: "./file.json",
                format: "json",
                content: {
                    key2: {
                        required: true,
                        content: {
                            key2_1: {
                                required: true,
                                content: {
                                    key_2_1_1: {
                                        required: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/box'
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "'key2.key2_1.key_2_1_1' pattern dont exists"
            ]
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

});