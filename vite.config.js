import path, {
    resolve
} from 'path'
import {
    defineConfig
} from 'vite'
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    resolve: {
        alias: {
            // "@textures": path.resolve(__dirname, 'src/assets/textures')
        }
    },
    build: {
        rollupOptions: {
            input: {
                hello: resolve(__dirname,'src/01_shader_hello'),
                var: resolve(__dirname,'src/02_shader_var'),
                func: resolve(__dirname,'src/03_shader_func')









            }
        }
    },
    plugins: [glsl({
        include: [                   // Glob pattern, or array of glob patterns to import
        '**/*.glsl', '**/*.wgsl',
        '**/*.vert', '**/*.frag',
        '**/*.vs', '**/*.fs'
      ],
      exclude: undefined,          // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: 'glsl',    // Shader suffix when no extension is specified
      compress: false,             // Compress output shader code
      watch: true,                 // Recompile shader on change
      root: '/src/assets'                    // Directory for root imports
    })]
})