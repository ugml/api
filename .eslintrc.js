const SEVERITY = {
  OFF: 0,
  WARNING: 1,
  ERROR: 2
};

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
    "comma-dangle": [SEVERITY.ERROR, "always-multiline"],
    "quotes": [SEVERITY.ERROR, "double"],
    "eqeqeq": [SEVERITY.ERROR, "always"],
    "arrow-parens": [SEVERITY.ERROR, "as-needed"],
    "space-before-function-paren": [SEVERITY.ERROR, {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "object-curly-spacing": [SEVERITY.ERROR, "always"],
    "max-len": [SEVERITY.WARNING, { "code": 120, "tabWidth": 2 }],
    "@typescript-eslint/no-use-before-define": SEVERITY.WARNING,
    "@typescript-eslint/no-namespace": SEVERITY.OFF,
    "@typescript-eslint/no-empty-interface": SEVERITY.OFF,
    "no-unused-vars": SEVERITY.ERROR,
    "@typescript-eslint/no-unused-vars": SEVERITY.ERROR,
    "@typescript-eslint/no-explicit-any": SEVERITY.ERROR,
    "@typescript-eslint/explicit-function-return-type": SEVERITY.OFF,
    "@typescript-eslint/no-var-requires": SEVERITY.ERROR,
    "require-jsdoc": SEVERITY.OFF,
    "unused-imports/no-unused-imports-ts": SEVERITY.ERROR,
    "unused-imports/no-unused-vars-ts": SEVERITY.WARNING,
    "@typescript-eslint/interface-name-prefix": SEVERITY.OFF,
    "@typescript-eslint/naming-convention": [
      SEVERITY.ERROR,
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
