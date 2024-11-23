export const fetchSpec = (toolName: string) => {
    try {
        const spec = require(`industry-tools/dist/tools/${toolName}/spec.json`);
        return spec;
    } catch (error) {
        throw new Error(`Failed to load spec for tool "${toolName}": ${error}`);
    }
};
