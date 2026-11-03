module.exports = {
    rootDir: '../../../..',
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    testRegex: 'ps-adj.spec.ts$',
    moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
};
