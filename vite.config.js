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
                hello: resolve(__dirname, 'src/01_shader_hello'),
                var: resolve(__dirname, 'src/02_shader_var'),
                func: resolve(__dirname, 'src/03_shader_func'),
                flyLight: resolve(__dirname, "src/04_shader_flyLight"),
                wave: resolve(__dirname, "src/05_shader_wave"),
                pointer: resolve(__dirname, "src/06_shader_pointer"),
                fireworks: resolve(__dirname, "src/07_shader_fireworks"),
                machining: resolve(__dirname, "src/08_shader_machining"),
                machining2: resolve(__dirname, "src/09_shader_machining2")

            }
        }
    },
    plugins: [glsl({
        include: [ // Glob pattern, or array of glob patterns to import
            '**/*.glsl', '**/*.wgsl',
            '**/*.vert', '**/*.frag',
            '**/*.vs', '**/*.fs'
        ],
        exclude: undefined, // Glob pattern, or array of glob patterns to ignore
        warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
        defaultExtension: 'glsl', // Shader suffix when no extension is specified
        compress: false, // Compress output shader code
        watch: true, // Recompile shader on change
        root: '/src/assets' // Directory for root imports
    })]
})