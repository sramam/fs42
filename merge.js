import { readFile, stat } from 'fs/promises'
import { join, relative, resolve } from 'path'
import { glob } from 'glob'
import ignore from 'ignore'
import chalk from 'chalk'

/**
 * Merges multiple files into a single string with file markers
 */
export async function mergeFiles(paths, options) {
  const { ignorePatterns, rootDir } = options
  
  // Setup ignore patterns
  const ig = ignore().add(ignorePatterns)
  
  // Collect all file paths
  const allFiles = new Set()
  console.log(chalk.blue('Scanning files...'))
  
  for (const path of paths) {
    const fullPath = resolve(rootDir, path)
    const stats = await stat(fullPath)
    
    if (stats.isDirectory()) {
      const files = await glob('**/*', {
        cwd: fullPath,
        nodir: true,
        absolute: true
      })
      files.forEach(file => allFiles.add(file))
      console.log(chalk.gray(`Found ${files.length} files in ${path}`))
    } else {
      allFiles.add(fullPath)
    }
  }
  
  // Filter ignored files
  const filteredFiles = [...allFiles].filter(file => {
    const relativePath = relative(rootDir, file)
    return !ig.ignores(relativePath)
  }).sort()
  
  console.log(chalk.green(`Processing ${filteredFiles.length} files...`))
  
  // Build merged content
  let output = [
    `/**`,
    ` * Generated by fs42 on ${new Date().toISOString()}`,
    " * Notes:",
    " *  - File path marker: `// >>> <relative_path>`",
    " *  - Use the same marker format for output file paths and content",
    " *  - All paths are relative to module root",
    " */",
    "",
    "",
  ].join("\n")

  
  for (const file of filteredFiles) {
    const relativePath = relative(rootDir, file)
    const content = await readFile(file, 'utf-8')
    
    output += `// >>> ${relativePath} \n`
    output += content
    if (!content.endsWith('\n')) output += '\n'
    output += '\n'
    const contentSize = (new TextEncoder().encode(content)).length;
    const humanFriendlySize = (contentSize / 1024).toFixed(2) + ' KB';
    console.log(chalk.gray(`Processed: ${relativePath} (${humanFriendlySize})`))
  }
  
  return output
}