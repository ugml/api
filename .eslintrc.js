module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    // 'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions:  {
  ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
  sourceType:  'module',  // Allows for the use of imports
  ecmaFeatures:  {
    // jsx:  true,  // Allows for the parsing of JSX
  },
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // "indent": ["error", 2], handled better by formatters
    "comma-dangle": ["error", "always-multiline"],
    "quotes": ["error", "double"],
    "eqeqeq": ["error", "always"],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "object-curly-spacing": ["error", "always"],
    //"arrow-parens": ["error", "always"], // prettier has a different opinion, maybe we really don't need these parens
    "max-len": ["warn", { "code": 120, "tabWidth": 2 }],

    "@typescript-eslint/interface-name-prefix": "always",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-namespace": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "on",
    "@typescript-eslint/no-explicit-any": "on",
    "@typescript-eslint/explicit-function-return-type": "off",
    "camelcase": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-var-requires": "on",
    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true,
        "FunctionExpression": true
      }
    }]
  },
  settings:  {
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
