module.exports = {
  extends: [
    'standard',
    'standard-react',
    'prettier/react',
    'plugin:import/typescript',
  ],
  parser: 'babel-eslint',
  rules: {
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    'react/prop-types': 0,
    'object-curly-spacing': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-double'],
    'comma-dangle': ['error', 'ignore'],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'single', 'all', 'multiple'],
      },
    ],
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.8.6',
    },
  },
}
