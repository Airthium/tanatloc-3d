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
  },
  moduleNameMapper: {
    '^@index/(.*)$': ['<rootDir>/index.d.ts'],
    '^@tunnel/(.*)$': ['<rootDir>/src/$1'],
    '^@context/(.*)$': ['<rootDir>/src/context/$1'],
    '^@header/(.*)$': ['<rootDir>/src/header/$1'],
    '^@helpers/(.*)$': ['<rootDir>/src/helpers/$1'],
    '^@loader/(.*)$': ['<rootDir>/src/loader/$1'],
    '^@tools/(.*)$': ['<rootDir>/src/tools/$1'],
    '^@style/(.*)$': ['<rootDir>/src/style/$1']
  }
}

module.exports = config
