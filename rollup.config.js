import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import babel from '@rollup/plugin-babel'
import css from 'rollup-plugin-import-css'
import dts from 'rollup-plugin-dts'
import typescript from '@rollup/plugin-typescript'
import { glob } from 'glob'
import { fileURLToPath, URL } from 'url'
import { extname, relative } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default [
  {
    input: Object.fromEntries(
      glob
        .sync('lib/**/!(*.stories).{ts,tsx}')
        .map((file) => [
          relative('lib', file.slice(0, file.length - extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
    ),
    output: [
      {
        format: 'es',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
        dir: 'dist/es',
        // sourcemap: true,
      },
      {
        format: 'cjs',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
        dir: 'dist/cjs',
        // sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve({
        browser: true,
        // preferBuiltins: false,
      }),
      css(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
      typescript({ tsconfig: './tsconfig.json' }), // Make sure to point to your tsconfig file
      visualizer(),
    ],
    external: ['react', 'react-dom', 'reactflow'],
  },
  // Separate configuration for generating type definitions
  {
    input: 'lib/index.ts', // Point to your main TypeScript file
    output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
    plugins: [dts(), css()],
  },
]
