import { readFile } from "fs/promises";
import path from 'path';

export const fetchSpec = async (toolName: string) => {
    const basePath = process.env.LAMBDA_TASK_ROOT || process.cwd();
    const specPath = path.join(basePath, 'node_modules', 'industry-tools', 'dist', 'tools', toolName, 'spec.json');

    try {
        const spec = await readFile(specPath, "utf8");
        return JSON.parse(spec);
    } catch (error) {
        throw new Error(`Failed to load spec for tool ${toolName}: ${error}`);
    }
};