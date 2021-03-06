import * as MockFs from 'mock-fs';
import {mockProcessExit} from 'jest-mock-process';
import * as Inquirer from 'inquirer';
const mockConsole = require("jest-mock-console");
import {Analyzer, RootAnalyzerUtil} from './analyzer';

jest.setTimeout(1000 * 10);

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
        jest.restoreAllMocks();
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
            {
                config: '/box',
                stop: true
            }
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "In file: /box/file.json -> 'key' pattern dont exists"
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
            {
                config: '/box',
                stop: true,
            }
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "In file: /box/file.json -> 'key2.key2_1.key_2_1_1' pattern dont exists"
            ]
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('Generate exit code "0" if required exists (sub levels)', () => {
        MockFs({
            '/box': {
                'file.json': `
                    {
                        "key2": {
                            "key2_1": {
                                "key_2_1_1": 1,
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
            {
                config: '/box',
                stop: false
            }
        );
        expect(mockExit).toBeCalledTimes(0);
    });

    test('Generate input interface for warning', async () => {
        MockFs({
            '/box': {
                'file.json': `
                    {
                        "key2": "value"
                    }
                `
            }
        });
        const inquirerMock = jest.spyOn(Inquirer, 'prompt').mockResolvedValue(
            {
                question: true
            }
        );
        await Analyzer.process(
            {
                file: "./file.json",
                format: "json",
                content: {
                    key: {
                        warning: true
                    },
                }
            },
            {
                config: '/box',
                stop: false
            }
        );
        expect(inquirerMock).toHaveBeenCalled();
    });

    test('Apply extends in "content" key', async () => {
        MockFs({
            '/box': {
                'file.json': `
                    {
                        "key2": "value"
                    }
                `
            }
        });
        jest.spyOn(RootAnalyzerUtil, 'getExtends').mockReturnValue({
            key2: {
                required: true
            }
        });
        await Analyzer.process(
            {
                file: "./file.json",
                format: "json",
                extends: "pre-action/template/npm-publish"
            },
            {
                config: '/box',
                stop: false
            }
        );
        expect(mockExit).toBeCalledTimes(0);
    });

    test('Generate exit code "1" if dont exists file', () => {
        MockFs({
            '/box': {
                'file2.json': `
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
                exists: true
            },
            {
                config: '/box',
                stop: true
            }
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "File or Directory: /box/file.json -> dont exists"
            ]
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('Generate exit code "1" if isNotEmpty is true and is not directory', () => {
        MockFs({
            '/box': {
                'file2': `
                    {
                        "key2": "value"
                    }
                `
            }
        });
        Analyzer.process(
            {
                file: "./file2",
                isNotEmpty: true
            },
            {
                config: '/box',
                stop: true
            }
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "/box/file2 -> is not a directory"
            ]
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('Generate exit code "1" if isNotEmpty is true and directory is empty', () => {
        MockFs({
            '/box': {
                'file2': {

                }
            }
        });
        Analyzer.process(
            {
                file: "./file2",
                isNotEmpty: true
            },
            {
                config: '/box',
                stop: true
            }
        );
        expect((console.error as any).mock.calls[0]).toEqual(
            [
                "/box/file2 -> is empty"
            ]
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

});