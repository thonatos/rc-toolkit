module.exports = {
  roots: [
    './test',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverage: false,
  /**
   * compile typescript to js before running jest
   */
  // testMatch: ['**/__tests__/**/*.[j]s', '**/?(*.)+(spec|test).[j]s'],
};
