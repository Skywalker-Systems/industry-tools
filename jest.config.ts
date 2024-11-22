module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.m?js$': 'babel-jest', // Use Babel for JavaScript/ES module files
    },
    moduleNameMapper: {
        '^@storage/(.*)$': '<rootDir>/src/storage/$1',
        '^@tools/(.*)$': '<rootDir>/src/tools/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(chai)/)', // Transform `chai` and similar dependencies
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
