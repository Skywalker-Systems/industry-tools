import { readFile } from "fs/promises";
import path from "path";

export const fetchSpec = async (toolName: string) => {
    const specPath = path.join(__dirname, "..", "tools", toolName, "spec.json");
    const spec = await readFile(specPath, "utf8");
    return JSON.parse(spec);
};
