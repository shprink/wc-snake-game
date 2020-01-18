module.exports = {
  mode: "production",
  entry: ["./engine.worker.ts"],
  output: {
    filename: "engine.worker.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
};
