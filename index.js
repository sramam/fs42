#!/usr/bin/env node

import { Command } from "commander";
import { mergeFiles } from "./merge.js";
import { splitFiles } from "./split.js";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

async function main() {
  const packageJsonPath = path.resolve("./package.json");
  const packageJsonData = JSON.parse(
    await fs.readFile(packageJsonPath, "utf-8")
  );
  const { name, version, description } = packageJsonData;

  const program = new Command();

  program.name(name);
  program.description(description);
  program.version(version);

  program
    .command("merge")
    .description("Merge multiple files into a single file with markers")
    .argument("<paths>", "Comma-separated list of files/directories to merge")
    .option("-i, --ignore <patterns>", "Comma-separated patterns to ignore", "")
    .option("-o, --output <file_path>", "Path to output file")
    .option(
      "-r, --root-dir <dir>",
      "Root directory for relative paths",
      process.cwd()
    )
    .action(async (paths, options) => {
      try {
        const pathList = paths.split(",").map((p) => p.trim());
        const ignorePatterns = options.ignore
          ? options.ignore.split(",").map((p) => p.trim())
          : [];
        const rootDir = path.resolve(options.rootDir);

        const result = await mergeFiles(pathList, {
          ignorePatterns,
          rootDir,
        });

        if (options.output) {
          const outPath = path.resolve(rootDir, options.output);
          await fs.mkdir(path.dirname(output), { recursive: true });
          await fs.writeFile(output, result);
          console.log(chalk.green(`Merged file written to ${options.output}`));
        } else {
          process.stdout.write(result);
        }
      } catch (error) {
        console.error(chalk.red("Error:"), error.message);
        process.exit(1);
      }
    });

  program
    .command("split")
    .description("Split a merged file back into individual files")
    .argument("<outputDir>", "Directory to output split files")
    .argument("<mergeFile>", "File containing merged content")
    .action(async (outputDir, mergeFile) => {
      try {
        await splitFiles(outputDir, mergeFile);
      } catch (error) {
        console.error(chalk.red("Error:"), error.message);
        process.exit(1);
      }
    });

  program.parse();
}

main();
