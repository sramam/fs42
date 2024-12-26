import path from "path";
import chalk from 'chalk';

class TreeNode {
    constructor(name) {
        this.name = name;
        this.children = new Map();
        this.isLast = false;
        this.annotation = null;
        this.displayLength = 0;  // Length including prefix and name
    }
}

class FileTree {
    constructor() {
        this.root = new TreeNode('');
        this.maxDisplayLength = 0;  // Track the longest display length
    }

    _calculateDisplayLength(prefix, name) {
        return prefix.length + name.length;
    }

    addPath(filePath, annotation = null) {
        const parts = filePath.split(path.sep);
        let current = this.root;
        let level = 0;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (!current.children.has(part)) {
                const newNode = new TreeNode(part);
                current.children.set(part, newNode);
            }
            current = current.children.get(part);
            
            // Calculate display length for this node
            const prefixLength = level * 4; // Each level adds 4 spaces
            const connectorLength = 4; // "└── " or "├── "
            current.displayLength = prefixLength + connectorLength + part.length;
            
            // Update max display length only for file nodes (leaf nodes)
            if (i === parts.length - 1 && annotation !== null) {
                current.annotation = annotation;
                this.maxDisplayLength = Math.max(this.maxDisplayLength, current.displayLength);
            }
            
            level++;
        }
    }

    _printNode(node, prefix = '', isLast = true) {
        if (node.name) {
            const connector = isLast ? '└── ' : '├── ';
            const fullPrefix = prefix + connector;
            const pathPart = fullPrefix + node.name;
            
            if (node.annotation) {
                // Calculate padding needed to align annotations
                // Add just 1 space after the longest filename
                const padding = ' '.repeat(this.maxDisplayLength - node.displayLength + 1);
                console.log(chalk.gray(`${pathPart}${padding}[${chalk.blue(node.annotation)}]`));
            } else {
                console.log(chalk.gray(pathPart));
            }
            
            prefix += isLast ? '    ' : '│   ';
        }

        const children = Array.from(node.children.values());
        children.forEach((child, index) => {
            this._printNode(child, prefix, index === children.length - 1);
        });
    }

    print() {
        this._printNode(this.root);
        // Print summary
        const stats = this._getStats(this.root);
        console.log(`\n${stats.directories} directories, ${stats.files} files`);
    }

    _getStats(node) {
        let stats = { directories: 0, files: 0 };
        
        node.children.forEach(child => {
            if (child.children.size === 0) {
                stats.files++;
            } else {
                stats.directories++;
                const childStats = this._getStats(child);
                stats.directories += childStats.directories;
                stats.files += childStats.files;
            }
        });

        return stats;
    }
}

export function printTree(pathsWithAnnotations) {
    const tree = new FileTree();
    for (const [filePath, annotation] of Object.entries(pathsWithAnnotations)) {
        tree.addPath(filePath, annotation);
    }
    tree.print();
}

// Example usage:
// const pathsWithAnnotations = {
//     'project/src/index.js': '2.5KB',
//     'project/src/utils/helper.js': '1.2KB',
//     'project/docs/readme.md': '500B',
//     'project/package.json': '1KB'
// };
// printTree(pathsWithAnnotations);

// Output:
// └── project
//     ├── docs
//     │   └── readme.md [500B]
//     ├── package.json [1KB]
//     └── src
//         ├── index.js [2.5KB]
//         └── utils
//             └── helper.js [1.2KB]
//
// 3 directories, 4 files