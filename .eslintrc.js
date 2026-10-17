module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['dist/*', 'node_modules/*', 'src/api/schema.d.ts'],
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3}){1,2}$/]',
        message: 'No raw hex colors in components — use semantic tokens.',
      },
    ],
  },
};
