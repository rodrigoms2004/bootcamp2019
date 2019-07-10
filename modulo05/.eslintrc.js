module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier,'
  ],
  rules: {
    'prettier/prettier': 'error',     // aponta como erro todas as regras que o prettier não conseguir encontrar
    'react/jsx-filename-extention': [ // permite escrever código jsx em arquivos js
      'warn',
      { extentions: ['.jsx', '.js' ] }  // emite um warning somente se as extensões não forem .jsx ou .js
    ],
    'import/prefer-default-export': 'off' // desativa a obrigação de usar export default quando há apenas um export no arquivo
  },
};
