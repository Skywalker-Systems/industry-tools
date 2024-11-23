import { readFile } from "fs/promises";
import path from 'path';

export const fetchSpec = async (toolName: string) => {
    // Get the path to the industry-tools package root
    const packagePath = require.resolve('industry-tools/package.json');
    const packageRoot = path.dirname(packagePath);

    const specPath = path.join(packageRoot, 'dist', 'tools', toolName, 'spec.json');
    const spec = await readFile(specPath, "utf8");
    return JSON.parse(spec);
};