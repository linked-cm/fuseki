/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    resources: 'usable',
  },
  rootDir: '.',
  testMatch: ['<rootDir>/src/tests/**/*.test.{ts,tsx,js,jsx}'],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  testTimeout: 20_000,
};
