/** @type {import('typedoc').TypeDocOptions} */
const config = {
  tsconfig: '../tsconfig.json',
  entryPoints: ['../src'],
  entryPointStrategy: 'Expand'
}

module.exports = config
