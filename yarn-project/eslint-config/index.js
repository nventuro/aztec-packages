const contexts = [
  'PropertyDefinition',
  'TSPropertySignature',
  'TSInterfaceDeclaration',
  'InterfaceDeclaration',
  'InterfaceExpression',
  'TSTypeAliasDeclaration',
  'TypeAliasDeclaration',
  'TSTypeDeclaration',
  'TypeDeclaration',
  'TSEnumDeclaration',
  'EnumDeclaration',
  'TSClassDeclaration',
  'ClassDeclaration',
  'TSConstructor',
  'Constructor',
  'TSClassExpression',
  'ClassExpression',
  'TSFunctionExpression',
  'FunctionExpression',
  'TSMethodDefinition',
  'MethodDefinition',
  'EnumExpression',
];

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'jsdoc'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-floating-promises': 2,
    'require-await': 2,
    'no-constant-condition': 'off',
    camelcase: 2,
    'no-restricted-imports': [
      'warn',
      {
        patterns: [
          {
            group: ['client-dest'],
            message: "Fix this absolute garbage import. It's your duty to solve it before it spreads.",
          },
          {
            group: ['dest'],
            message: 'You should not be importing from a build directory. Did you accidentally do a relative import?',
          },
        ],
      },
    ],
    'tsdoc/syntax': 'warn',
    'jsdoc/require-jsdoc': [
      'warn',
      {
        contexts,
        checkGetters: true,
        checkSetters: true,
      },
    ],
    'jsdoc/require-description': ['warn', { contexts }],
    'jsdoc/require-description-complete-sentence': ['warn'],
    'jsdoc/require-hyphen-before-param-description': ['warn'],
    'jsdoc/require-param': ['warn', { contexts }],
    'jsdoc/require-param-description': ['warn', { contexts }],
    'jsdoc/require-param-name': ['warn', { contexts }],
    'jsdoc/require-property': ['warn', { contexts }],
    'jsdoc/require-property-description': ['warn', { contexts }],
    'jsdoc/require-property-name': ['warn', { contexts }],
    'jsdoc/require-returns': ['warn', { contexts }],
    'jsdoc/require-returns-description': ['warn', { contexts }],
  },
  ignorePatterns: ['node_modules', 'dest*', 'dist', '*.js', '.eslintrc.cjs'],
};
