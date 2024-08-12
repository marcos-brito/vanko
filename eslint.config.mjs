import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        "rules": {
            "@typescript-eslint/array-type": [
                "error",
                {
                    "default": "generic"
                }
            ],
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/no-mixed-enums": "error",
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-unnecessary-template-expression": "error",
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error"
        }
    }
);
