module.exports = {
  extends: ['sanity/react', 'standard', 'standard-react'],
  parser: 'babel-eslint',
  rules: {
    'react/prop-types': 0,
    'object-curly-spacing': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-double'],
    'comma-dangle': ['error', 'ignore'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
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
