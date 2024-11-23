import { readFile } from "fs/promises";
import path from 'path';

export const fetchSpec = async (toolName: string) => {
    try {
        const moduleDir = path.dirname(require.main?.filename || '');
        const specPath = path.join(moduleDir, 'node_modules', 'industry-tools', 'dist', 'tools', toolName, 'spec.json');

        const spec = await readFile(specPath, "utf8");
        return JSON.parse(spec);
    } catch (error) {
        // Fallback for local development
        try {
            const devSpecPath = path.join(process.cwd(), 'dist', 'tools', toolName, 'spec.json');
            const spec = await readFile(devSpecPath, "utf8");
            return JSON.parse(spec);
        } catch (devError) {
            throw new Error(`Failed to load spec for tool ${toolName}: ${error}`);
        }
    }
};