# fs42

fs42 is a simple tool to help merge/split files for LLM consumption.

Currently (~Dec 2024) LLMs don't always handle large complex tasks well.
They work best when given focussed features to implement. Working in a large
codebase, this means collecting a bunch of files from different locations
and marging them for LLM context. Importantly, on the return path, it
also means splitting similar output into individual files.

This module helps with doing this in both directions.

## Install

```
pnpm add https://github.com/sramam/fs42
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
