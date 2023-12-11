/** @type {import('jest').Config} */
const config = {
  rootDir: '..',
  setupFiles: ['jest-canvas-mock', './config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/TODO/'
  ],
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
    '@index': ['<rootDir>/index.d.ts'],
    '@header': ['<rootDir>/src/header/index.tsx'],
    '^@helpers/(.*)$': ['<rootDir>/src/helpers/$1'],
    '@loader': ['<rootDir>/src/loader/index.tsx'],
    '^@tools/(.*)$': ['<rootDir>/src/tools/$1'],
    '^@store/(.*)$': ['<rootDir>/src/store/$1'],
    '@store': ['<rootDir>/src/store/index.ts'],
    '^@style/(.*)$': ['<rootDir>/src/style/$1']
  }
}

export default config
