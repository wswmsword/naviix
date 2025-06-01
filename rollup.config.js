import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import fs from "node:fs/promises";
const p = JSON.parse(await fs.readFile("package.json"));

const commonPlugins = [
  resolve(),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled"
  })
];

const commonConfig = {
  input: "index.js",
};

const commonOutput = {
  preserveModules: false,
  sourcemap: true,
  banner: `/* 这是 ${p.version} 版本的 ${p.name}。 */`,
};

const cjs = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/navix.js",
      format: "cjs",
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/navix.min.js",
      format: "cjs",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const esm = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/navix.esm.js",
      format: "esm",
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/navix.esm.min.js",
      format: "esm",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const umd = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/navix.umd.js",
      format: "umd",
      noConflict: true,
      name: "scaleView",
      ...commonOutput,
      globals: {},
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/navix.umd.min.js",
      format: "umd",
      noConflict: true,
      name: "scaleView",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const configMap = new Map([
  ["cjs", cjs],
  ["esm", esm],
  ["umd", umd],
]);

const chosenConfig = configMap.get(process.env.BUILD_ENV);
if (chosenConfig == null) 
  throw Error("You must define process.env.BUILD_ENV before building with rollup. Check rollup.config.js for valid options.");

export default chosenConfig;