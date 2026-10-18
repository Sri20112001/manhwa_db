module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['dist/*', 'node_modules/*', 'src/api/generated/*'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/generated/schema', '@/api/generated/schema'],
            message:
              'Import API types from "@/api/generated" (the facade) instead of the raw generated schema.',
          },
        ],
      },
    ],
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3}){1,2}$/]',
        message: 'No raw hex colors in components — use semantic tokens.',
      },
    ],
  },
  overrides: [
    {
      files: ['src/ui/theme/tokens.ts', 'src/ui/theme/vars.ts', 'app.config.ts'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
};
