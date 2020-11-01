/**
 * Babel Configuration File
 * https://babeljs.io/docs/en/configuration
 */
module.exports = {
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 'current',
                        },
                    },
                ],
            ],
        },
    },
    plugins: ['@babel/plugin-proposal-optional-chaining'],
};
