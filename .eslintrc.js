module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: true // 开启jsx模板支持
    }
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    //关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-inferrable-types': 0, // 关闭ts类型推断
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'no-eval': 2 //不允许使用eval
  }
}
