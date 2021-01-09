module.exports = {
    preset: 'ts-jest',
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@controllers(.*)$': '<rootDir>/src/controllers$1',
        '^@db(.*)$': '<rootDir>/src/db$1',
        '^@middleware(.*)$': '<rootDir>/src/middleware$1',
        '^@router(.*)$': '<rootDir>/src/router$1',
        '^@services(.*)$': '<rootDir>/src/services$1',
        '^@test(.*)$': '<rootDir>/src/test$1',
        '^@utils(.*)$': '<rootDir>/src/utils$1',
        '^@server': '<rootDir>/src/server',
        '^@types': '<rootDir>/src/types',
    },
    verbose: true,
    setupFilesAfterEnv: ['./src/test/setup-env.ts'],
    collectCoverageFrom: ['./src/**/*.ts'],
    coveragePathIgnorePatterns: ['node_modules', '__tests__'],
};
