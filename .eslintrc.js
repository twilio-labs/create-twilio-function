module.exports = {
  'extends': 'standard',
  'plugins': ['jest'],
  'rules': {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
  },
  'env': {
    'jest/globals': true
  }
}