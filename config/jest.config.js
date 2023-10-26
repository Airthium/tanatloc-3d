/** @type {import('jest').Config} */
const config = {
  rootDir: '..',
  setupFiles: ['jest-canvas-mock', './config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true
}

module.exports = config
