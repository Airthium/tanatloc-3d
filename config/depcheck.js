import { basename } from 'path'
import depcheck from 'depcheck'
import { exit } from 'process'

const customTypescript = async (fileName, deps) => {
  const newDeps = []

  try {
    if (basename(fileName) === 'package.json') {
      const packageJson = (await import(fileName, { assert: { type: 'json' } }))
        .default

      if (deps.includes('typescript')) {
        newDeps.push('typescript')
        Object.keys(packageJson.devDependencies).forEach((dep) => {
          if (dep.includes('@types')) newDeps.push(dep)
        })
      }
    }
  } catch (err) {
    console.error(err)
  }

  return newDeps
}
/**
 * Custom jest.config.js parser
 * @returns Deps array
 */
const customJest = async (fileName, deps) => {
  const newDeps = []

  try {
    if (basename(fileName) === 'jest.config.js') {
      if (deps.includes('typescript')) newDeps.push('@types/jest')

      const config = (await import(fileName)).default

      // Setup files
      config.setupFiles &&
        newDeps.push(
          ...config.setupFiles.filter((file) => file.charAt(0) !== '.')
        )
      // Environment
      config.testEnvironment && newDeps.push(config.testEnvironment)
      // Transform
      Object.values(config.transform ?? {}).forEach((value) => {
        if (!value.includes('<rootDir>')) newDeps.push(value[0])
        const presets = value[1]?.presets ?? []
        presets.forEach((preset) => {
          if (typeof preset === 'string') newDeps.push(preset)
          else newDeps.push(preset[0])
        })
      })
    }
  } catch (err) {
    console.error(err)
  }

  return newDeps
}

const options = {
  ignoreMatches: [
    'depcheck', // used here
    '@babel/plugin-syntax-import-assertions', // eslint custom
    '@babel/plugin-syntax-jsx', // eslint custom
    '@header/*',
    '@helpers/*',
    '@loader/*',
    '@store/*',
    '@style/*',
    '@tools/*'
  ],
  specials: [
    depcheck.special.bin,
    depcheck.special.eslint,
    customTypescript,
    customJest
  ]
}

depcheck(process.cwd(), options, (unused) => {
  let error = 0

  if (unused.dependencies.length) {
    console.error('Unused dependencies:')
    console.error(unused.dependencies)
    console.error()
    error++
  }

  if (unused.devDependencies.length) {
    console.error('Unused dev dependencies:')
    console.error(unused.devDependencies)
    console.error()
    error++
  }

  if (Object.keys(unused.missing).length) {
    console.warn('Missing dependencies:')
    console.warn(unused.missing)
    console.warn()
  }

  if (error) exit(1)
})
