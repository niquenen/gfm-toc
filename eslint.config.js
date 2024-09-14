/**
 * @author Cédric Hennequin
 * @company H2V Solutions
 * @created_at 2024-09-13 10:00:38
 * @updated_by Cédric Hennequin
 * @updated_at 2024-09-13 10:14:25
 */

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
);
