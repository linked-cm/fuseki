/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    resources: 'usable',
  },
  // No tests live in this repo yet. When tests are added under e.g. src/__tests__
  // or tests/, set rootDir + setupFiles back to point at them.
  testMatch: [],
  testTimeout: 20_000,
};
