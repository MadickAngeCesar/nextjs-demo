module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  // Treat TypeScript files as ESM
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // Transform node_modules for ESM packages we depend on (e.g. @arcjet)
  transformIgnorePatterns: ['node_modules/(?!(?:@arcjet)/)'],
  // Map next/server to a local mock to avoid loading Next internals in Jest
  moduleNameMapper: {
    '^next/server(.js)?$': '<rootDir>/__mocks__/next-server.js',
  },
};
