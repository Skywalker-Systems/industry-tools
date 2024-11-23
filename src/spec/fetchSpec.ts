import { readFile } from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';

export const fetchSpec = async (toolName: string) => {
    const currentFilePath = fileURLToPath(import.meta.url);
    const packageRoot = path.resolve(path.dirname(currentFilePath), '..', '..');
    const specPath = path.join(packageRoot, 'dist', 'tools', toolName, 'spec.json');

    try {
        const spec = await readFile(specPath, "utf8");
        return JSON.parse(spec);
    } catch (error) {
        throw new Error(`Failed to load spec for tool ${toolName}: ${error}`);
    }
};