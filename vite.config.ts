import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MathWhiteboard",
      fileName: "math-whiteboard"
    },
    rollupOptions: {
      external: ["react", "react-dom", "fabric"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          fabric: "fabric"
        }
      }
    }
  }
});
