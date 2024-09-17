// jest.config.cjs
module.exports = {
  preset: 'ts-jest/presets/default-esm', // Usa el preset ESM
  testEnvironment: 'node',
  setupFilesAfterEnv: ["<rootDir>/testSetup.ts"],
  testMatch: ['**/tests/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  extensionsToTreatAsEsm: ['.ts'], // Trata los archivos .ts como ESM
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    '^(\\.{1,2}/.*)\\.js$': '$1', // Mapea imports .js a .ts
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true, // Usa ESM
        tsconfig: 'tsconfig.json',
      },
    ],
  },
};
