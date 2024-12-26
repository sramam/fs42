import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import chalk from 'chalk'

/**
 * Splits a merged file back into individual files
 */
export async function splitFiles(outputDir, mergeFile) {
  console.log(chalk.blue('Reading merged file...'))
  const content = await readFile(mergeFile, 'utf-8')
  const lines = content.split('\n')
  
  let currentFile = null
  let currentContent = []
  let filesCreated = 0
  
  console.log(chalk.blue('Processing files...'))
  
  for (const line of lines) {
    // Check for file marker (// >>> filepath)
    const match = line.match(/^\/\/\s*>>>\s*(.+)$/)
    
    if (match) {
      // Write previous file if exists
      if (currentFile) {
        const fullPath = join(outputDir, currentFile)
        await mkdir(dirname(fullPath), { recursive: true })
        await writeFile(fullPath, currentContent.join('\n'))
        const contentSize = (new TextEncoder().encode(currentContent.join('\n'))).length;
        const humanFriendlySize = (contentSize / 1024).toFixed(2) + ' KB';
        filesCreated++
        console.log(chalk.gray(`Extracted: ${currentFile} (${humanFriendlySize})`))
      }
      
      // Start new file
      currentFile = match[1].trim()
      currentContent = []
    } else if (currentFile) {
      // Add line to current file
      currentContent.push(line)
    }
  }
  
  // Write last file
  if (currentFile) {
    const fullPath = join(outputDir, currentFile)
    await mkdir(dirname(fullPath), { recursive: true })
    await writeFile(fullPath, currentContent.join('\n'))
    filesCreated++
    const contentSize = (new TextEncoder().encode(currentContent.join('\n'))).length;
    const humanFriendlySize = (contentSize / 1024).toFixed(2) + ' KB'; 
    console.log(chalk.gray(`Extracted: ${currentFile} (${humanFriendlySize})`))
  }
  
  console.log(chalk.green(`\nFile splitting completed successfully!`))
  console.log(chalk.green(`Total files created: ${filesCreated}`))
}