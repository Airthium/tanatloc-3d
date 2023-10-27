/** @type {import('jest').Config} */
const config = {
  rootDir: '..',
  setupFiles: ['jest-canvas-mock', './config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          '@babel/preset-env',
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript'
        ]
      }
    ]
  }
}

module.exports = config
