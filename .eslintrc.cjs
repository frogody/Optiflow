module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    'sort-imports': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true 
    }],
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'no-case-declarations': 'warn',
    'no-constant-condition': 'warn',
    'no-var': 'error',
    'react/no-unescaped-entities': ['error', {
      'forbid': [
        {
          'char': '>',
          'alternatives': ['&gt;']
        },
        {
          'char': '}',
          'alternatives': ['&#125;']
        }
        // Exclude apostrophe and double quotes from the forbidden list
        // {
        //   'char': '"',
        //   'alternatives': ['&quot;', '&ldquo;', '&#34;', '&rdquo;']
        // },
        // {
        //   'char': "'",
        //   'alternatives': ['&apos;', '&lsquo;', '&#39;', '&rsquo;']
        // }
      ]
    }]
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.js', '**/*.js'],
      env: {
        node: true
      }
    },
    {
      // Allow 'any' in API routes, services, types, middleware and utility files
      files: [
        'src/app/api/**/*.ts',
        'src/app/api/**/*.tsx',
        'src/services/**/*.ts',
        'src/types/**/*.ts',
        'src/types/**/*.d.ts',
        'src/lib/**/*.ts',
        'src/components/workflow/**/*.ts',
        'src/components/workflow/**/*.tsx',
        'src/hooks/**/*.ts',
        'src/stores/**/*.ts',
        'prisma/middleware/**/*.ts'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}