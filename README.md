# Pre Action

The motivation for creating this module is to prevent any publication or any action that could harm a specific task, for example: the publication of a package to the npm registers with missing data, etc.

## Installation

Local

```bash
npm install --save-dev pre-action
```

Global

```bash
npm install -g pre-action
```

## Usage

```bash
pre-action [event]
```

Options

| Option      | Type | Description |
| ----------- | ----------- | ----------- |
| -f   | string  | Format of the file (json, json5, yaml, toml, ecld)       |
| -c   | string | Path of the file        |
| -n   | string | Name of the file        |
| -s   | boolean | Stop process if a required didn't found        |

##### Example

.preactionrc

```bash
{
    "publish": {
        "file": "./package.json",
        "format": "json",
        "content": {
            "repository": {
                "required": true
            }
        }
    }
}
```

we can called with this command

```bash
pre-action publish
```

and also we can combine this command with a flow

```bash
pre-action publish && npm publish
```

If you want to help this project, **go to the github repository of this project**
