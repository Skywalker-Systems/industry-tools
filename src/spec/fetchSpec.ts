import { readFile } from "fs/promises";

export const fetchSpec = async (toolName: string) => {
    // Find the package in node_modules
    const specPath = require.resolve(`industry-tools/dist/tools/${toolName}/spec.json`, {
        paths: [process.cwd()]
    });
    const spec = await readFile(specPath, "utf8");
    return JSON.parse(spec);
};