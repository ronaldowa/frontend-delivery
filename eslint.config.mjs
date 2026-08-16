// ESLint flat config using the official Next.js presets.

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextVitals, ...nextTypescript];

export default eslintConfig;
