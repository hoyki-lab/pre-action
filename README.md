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

###### One Level

.preactionrc

```json
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

###### Nested Validation

.preactionrc

```json
{
    "publish": {
        "file": "./package.json",
        "format": "json",
        "content": {
            "repository": {
                "required": true,
                "content": {
                    "required": true
                }
            }
        }
    }
}
```

###### Warning interface

.preactionrc

```json
{
    "publish": {
        "file": "./package.json",
        "format": "json",
        "content": {
            "repository": {
                "warning": true
            }
        }
    }
}
```

If you use the 'warning' option, the dynamic interface will be activated.

###### Extends

We can also inherit an already established structure

.preactionrc

```json
{
    "publish": {
        "file": "./package.json",
        "format": "json",
        "extends": "pre-action/template/npm-publish"
    }
}
```

List of available structures:

| name   | Description |
| ----------- | ---------- |
| pre-action/template/npm-publish   | Structure for publish packages |

###### Only check file

You have the option of validating only that a file exists

.preactionrc

```json
{
    "publish": {
        "file": "./package.json",
        "format": "json",
        "exists": true
    }
}
```

###### Only check directory

You have the option to validate if a directory is empty

.preactionrc

```json
{
    "publish": {
        "file": "./mydir",
        "isNotEmpty": true
    }
}
```

# Call

we can call with this command

```bash
pre-action publish
```

and also we can combine this command with a flow

```bash
pre-action publish && npm publish
```

# Create custom extends

Create a directory that has a file 'index.json' in the main root and establish the path of that folder or if it were the case the name of the module.

If you want to help this project, **go to the github repository of this project**
