import bud from "postcss-bud"

export default {
  plugins: [
    bud({
      rootSelector: "#root",
      viewport: {
        width: 1280,
        height: 720,
      },
    }),
  ],
}