import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://graphql.org/graphql/',
  documents: ['packages/client/src/**/*.vue'],
  generates: {
    'packages/client/src/api/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        enumsAsConst: true,
      },
    },
  },
  hooks: { afterOneFileWrite: ['prettier --write'] },
}
export default config
