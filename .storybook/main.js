const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const custom = require('../webpack.config.js');

module.exports = {
  // "stories": [
  //   "../stories/**/*.stories.mdx",
  //   "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  // ],
  stories: ['../src/**/*.stories.@([tj]s|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    '@storybook/addon-controls',
    '@storybook/addon-storysource',
  ],
  webpackFinal: (config) => {
    config.module.rules.push({
      // 2a. Load `.stories.mdx` / `.story.mdx` files as CSF and generate
      //     the docs page from the markdown
      test: /\.(stories|story)\.mdx$/,
      use: [
        {
          loader: 'babel-loader',
          // may or may not need this line depending on your app's setup
          options: {
            plugins: ['@babel/plugin-transform-react-jsx'],
          },
        },
        {
          loader: '@mdx-js/loader',
          options: {
            compilers: [createCompiler({})],
          },
        },
      ],
    });
    // 2b. Run `source-loader` on story files to show their source code
    //     automatically in `DocsPage` or the `Source` doc block.
    config.module.rules.push({
      test: /\.(stories|story)\.[tj]sx?$/,
      loader: require.resolve('@storybook/source-loader'),
      exclude: [/node_modules/],
      enforce: 'pre',
    });

    return {
      ...config,
      resolve: {alias: {...config.resolve.alias, ...custom.resolve.alias}},
      module: {...config.module, rules: custom.module.rules},
    };
  },
};
