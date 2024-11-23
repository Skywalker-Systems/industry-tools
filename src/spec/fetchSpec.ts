import { createRequire } from 'module';
import { pathToFileURL } from 'url';

export const fetchSpec = async (toolName: string) => {
    try {
        const require = createRequire(import.meta.url);

        const specPath = require.resolve(`industry-tools/dist/tools/${toolName}/spec.json`);

        const specUrl = pathToFileURL(specPath).href;

        const specModule = await import(specUrl);

        return specModule.default;
    } catch (error) {
        throw new Error(`Failed to load spec for tool "${toolName}": ${error}`);
    }
};
