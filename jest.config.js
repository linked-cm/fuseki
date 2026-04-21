/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    resources: 'usable',
  },
  rootDir: 'lib/cjs/tests',
  setupFiles: ['<rootDir>/setup.jest.js'],
  setupFilesAfterEnv: ['<rootDir>/setupAfterEnv.jest.js'],
  testTimeout: 20_000,
};
