import { readFile } from "fs/promises";
import path from 'path';

export const fetchSpec = async (toolName: string) => {
    // Get the path to our package's root
    const packagePath = require.resolve('industry-tools/package.json');
    const packageRoot = path.dirname(packagePath);
    const specPath = path.join(packageRoot, 'src', 'dist', 'tools', toolName, 'spec.json');

    try {
        const spec = await readFile(specPath, "utf8");
        return JSON.parse(spec);
    } catch (error) {
        throw new Error(`Failed to load spec for tool ${toolName}: ${error}`);
    }
};