import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default {
  entry: "./main.ts",
  target: "node", // Bundles code for Node.js environment.
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: "ts-loader", // Processes TypeScript files.
          options: {
            transpileOnly: true, // Speeds up compilation by skipping type checking.
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].cjs",
    path: path.resolve(__dirname, "dist"),
  },
};
