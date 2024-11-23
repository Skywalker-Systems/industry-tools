import { readFile } from "fs/promises";
import path from 'path';

export const fetchSpec = async (toolName: string) => {
    // In Lambda, everything is in /var/task
    const basePath = process.env.LAMBDA_TASK_ROOT || process.cwd();

    try {
        const specPath = path.join(basePath, 'node_modules', 'industry-tools', 'dist', 'tools', toolName, 'spec.json');
        const spec = await readFile(specPath, "utf8");
        return JSON.parse(spec);
    } catch (error) {
        // If that fails, try local development path
        try {
            const devSpecPath = path.join(basePath, 'dist', 'tools', toolName, 'spec.json');
            const spec = await readFile(devSpecPath, "utf8");
            return JSON.parse(spec);
        } catch (devError) {
            throw new Error(`Failed to load spec for tool ${toolName}. Paths tried:\n` +
                `1. ${path.join(basePath, 'node_modules', 'industry-tools', 'dist', 'tools', toolName, 'spec.json')}\n` +
                `2. ${path.join(basePath, 'dist', 'tools', toolName, 'spec.json')}`);
        }
    }
};