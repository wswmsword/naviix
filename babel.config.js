
const config = {
  env: {
    es5: {
      presets: [
        [
          "@babel/preset-env",
          {
            loose: true,
          },
        ]
      ],
    },
    esm: {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            loose: true,
          },
        ]
      ],
    },
  },

}

export default config;