import nodent from 'rollup-plugin-nodent';

export default {
    entry: './web/src/index.js',
    output: {
        file: './bundle.js',
        format: 'iife',
        name: 'app'
    },
    plugins: [nodent({
        promises: true,
        noRuntime: true
    })],
    sourceMap: true
}