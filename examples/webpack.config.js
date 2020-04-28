const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const getLogger = require('webpack-log');
const logger = getLogger('reveal-examples');

const revealSource = 'node_modules/@cognite/reveal';

/*
 * Set args on the command line using
 *
 *    webpack --env.argname=value
 *
 */
function arg(env, name, defaultValue) {
  if (env === undefined) {
    return defaultValue;
  }
  if (env[name] === undefined) {
    return defaultValue;
  }
  if (env[name] === "true") {
    return true;
  }
  if (env[name] === "false") {
    return false;
  }
  return env[name];
}

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

const allExamples = [
  {
    name: "no-rendering",
    title: "Load model without rendering",
    entry: './src/no-rendering.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-simple",
    title: "Simple",
    entry: './src/simple.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-clipping",
    title: "Clipping planes",
    entry: './src/clipping.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-filtering",
    title: "Filtering",
    entry: './src/filtering.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-picking",
    title: "Picking",
    entry: './src/picking.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-ssao",
    title: "Screen space ambient occlusion shading",
    entry: './src/ssao.ts',
    template: 'template-example.ejs',
    type: 'threejs'
  },
  {
    name: "threejs-side-by-side",
    title: "Side-by-side debugger for sector models",
    entry: './src/side-by-side.ts',
    template: 'template-example-two-canvases.ejs'
  },
  {
    name: "threejs-simple-pointcloud",
    title: "Simple pointcloud",
    entry: './src/simple-pointcloud.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-post-processing-effects",
    title: "Post processing effects",
    entry: './src/post-processing-effects.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-with-pointcloud",
    title: "CAD model with point cloud",
    entry: './src/sector-with-pointcloud.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-two-models",
    title: "Two models",
    entry: './src/two-models.ts',
    template: './template-example.ejs'
  },
  {
    name: "threejs-custom-scene-elements",
    title: "Custom ThreeJS scene elements",
    entry: './src/custom-scene-elements.ts',
    template: './template-example.ejs'
  },
  {
    name: "threejs-migration",
    title: "Migration wrapper for applications using the old Reveal viewer",
    entry: './src/migration.ts',
    template: './template-single-canvas.ejs'
  },
  {
    name: "walkable-path",
    title: "Walkable Path",
    entry: './src/walkable-path.ts',
    template: 'template-example.ejs'
  },
  {
    name: "world-to-screen",
    title: "World To Screen",
    entry: './src/world-to-screen.ts',
    template: 'template-example.ejs'
  },
  {
    name: "threejs-gpu-based-sectorculler",
    title: "GPU based sector culler",
    entry: './src/gpu-sector-culler.ts',
    template: 'template-example.ejs'
  }
];

module.exports = env => {
  const development = arg(env, 'development', false);
  const filter = arg(env, 'filter', undefined);
  logger.info("Build config:");
  logger.info(`  - development: ${development}`);

  let examples = allExamples.map(example => {
    const {name, title, entry, template} = example;
    return {
      name,
      title,
      entry,
      template,
      script: `${name}.js`,
      page: `example-${name}.html`,
    };
  });
  if (filter) {
    examples = examples.filter(example => example.name.match(filter))
  }
  logger.info(`  - examples: ${examples.length}`);
  const exampleEntries = examples.reduce((entries, example) => {
    const { entry, name } = example;
    entries[name] = entry;
    return entries;
  }, {});
  const examplePlugins = examples.map(example => {
    const { page, script, title, template } = example;
    return new HtmlWebpackPlugin({
      templateParameters: {
        'title': title,
        'script': script
      },
      hash: true,
      inject: false,
      template: template,
      filename: page,
    });
  });



  return {
    mode: development ? "development" : "production",
    entry: exampleEntries,
    target: "web",
    module: {
      rules: [
        {
          test: /node_modules\/@cognite\/reveal\/.+\.(js|map)$/, // Consider adding ts
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: [
            /node_modules\/.*\/node_modules/,
          ],
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
              compilerOptions: !development ? {} : {
                noUnusedLocals: false,
                noUnusedParameters: false
              }
            },
          },
          exclude: [
            /node_modules/,
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          exclude: '/node_modules/',
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(glsl|vert|frag)$/,
          exclude: '/node_modules/',
          use: [
            'raw-loader',
            'glslify-loader'
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      sourceMapFilename: '[name].map',
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
      libraryTarget: 'umd',
    },
    devtool: development ? "inline-source-map" : "source-map",
    watchOptions: {
      aggregateTimeout: 1500,
      ignored: [/node_modules/]
    },
    devServer: {
      https: true,
      stats: 'minimal',
      contentBase: [
        resolve('public/'),
        resolve('dist/'),
      ],

      writeToDisk: true,
    },
    optimization: {
      usedExports: true,
    },
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    plugins: [
      new CopyWebpackPlugin([
        {from: path.join(revealSource, "**/*.wasm"), to: ".", flatten: true},
        {from: path.join(revealSource, "**/*.worker.js"), to: ".", flatten: true}
      ]),
      // Examples and index
      new HtmlWebpackPlugin({
        templateParameters: {
          'examples': examples,
        },
        hash: true,
        inject: false,
        template: 'template-index.ejs',
      }),
      ...examplePlugins
    ],
  };
};
