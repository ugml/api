module.exports =  {
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    // 'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    project: './tsconfig.json'
  },
  rules:  {
    "comma-dangle": [2, "always-multiline"],
    "quotes": [2, "double"],
    "eqeqeq": [2, "always"],
    "arrow-parens": [2, "as-needed"],
    "space-before-function-paren": [2, {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "object-curly-spacing": [2, "always"],
    "max-len": ["warn", { "code": 120, "tabWidth": 2 }],
    "@typescript-eslint/no-use-before-define": 2,
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "no-unused-vars": 2,
    "@typescript-eslint/no-unused-vars": 2,
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-var-requires": 2,
    "unused-imports/no-unused-imports-ts": 2,
    "unused-imports/no-unused-vars-ts": 1,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/naming-convention": [
      2,
      {
        "selector": "default",
        "format": ["PascalCase", "UPPER_CASE"]
      },
      {
        "selector": "method",
        "format": ["camelCase"]
      },
      {
        "selector": "method",
        "format": ["PascalCase"],
        "prefix": ["is", "should", "has", "can", "did", "will"]
      },
      {
        "selector": "parameter",
        "format": ["camelCase"]
      },
      {
        "selector": "property",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      {
        "selector": "enumMember",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "typeParameter",
        "format": ["PascalCase"],
        "prefix": ["T"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]
      }
    ]
  },
  settings:  {
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  plugins: [
    "unused-imports",
    "@typescript-eslint"
  ]
};
