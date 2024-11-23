import { readFile } from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fetchSpec = async (toolName: string) => {
    try {
        // Resolve the path relative to the module's own directory
        const specPath = path.join(__dirname, 'tools', toolName, 'spec.json');
        const spec = await readFile(specPath, "utf8");
        return JSON.parse(spec);
    } catch (error) {
        throw new Error(`Failed to load spec for tool ${toolName} from path \nError: ${error}`);
    }
};
