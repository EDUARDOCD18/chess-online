import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Ruta base para despliegue (útil para GitHub Pages o servidores estáticos)
  base: "./",

  build: {
    // Carpeta de salida de producción
    outDir: "dist",

    // Genera archivos con hashes para invalidación de caché (Cache Busting)
    assetsDir: "assets",

    // Tamaño límite para avisos de chunks grandes (en kB)
    chunkSizeWarningLimit: 500,

    // Minificación de código fuente JS y CSS
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.log en el entorno de producción
        drop_debbuger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        // Separación de chunks para mejor tiempo de carga inicial
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },

  server: {
    port: 5173,
    open: true,
    cors: true,
  },
});
