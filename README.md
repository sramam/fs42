# fs42

When working with LLMs to write code, a common workflow is to concatenate a bunch
of files to provide the LLM context and then splitting it's output back into files.

fs42 is a simple tool to help merge/split files for LLM consumption.

## Install

```
pnpm add fs42
```

## Usage

```
Usage: fs42 [options] [command]

CLI tool for merging and splitting files for LLM consumption

Options:
  -V, --version                  output the version number
  -h, --help                     display help for command

Commands:
  merge [options] <paths>        Merge multiple files into a single file with markers
  split <outputDir> <mergeFile>  Split a merged file back into individual files
  help [command]                 display help for command
```

### merge

```
Usage: fs42 merge [options] <paths>

Merge multiple files into a single file with markers

Arguments:
  paths                    Comma-separated list of files/directories to merge

Options:
  -i, --ignore <patterns>  Comma-separated patterns to ignore (default: "")
  -r, --root-dir <dir>     Root directory for relative paths (default:
                           "/Users/shramam/dev/sramam/fs42")
  -h, --help               display help for command
```

### split

```
Usage: fs42 split [options] <outputDir> <mergeFile>

Split a merged file back into individual files

Arguments:
  outputDir   Directory to output split files
  mergeFile   File containing merged content

Options:
  -h, --help  display help for command
```
