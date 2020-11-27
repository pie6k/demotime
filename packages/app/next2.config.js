const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withTranspileModules = require('next-transpile-modules');

// const withConfigModifications = {
//   webpack: (config, options) => {
//     return config;
//   },
// };

// const withExperimental = {
//   webpack: (config, options) => {
//     if (!config.experimental) {
//       config.experimental = {};
//     }

//     config.experimental.reactMode = 'concurrent';

//     return config;
//   },
// };

const nextConfiguration = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

// const bundled3rdPartyPackages = ['mobek'];

const finalConfig = withPlugins(
  [
    // withTranspileModules([...bundled3rdPartyPackages]),
    // [
    //   optimizedImages,
    //   {
    //     /* config for next-optimized-images */
    //     responsive: {
    //       adapter: require('responsive-loader/sharp'),
    //     },
    //   },
    // ],
  ],
  {
    typescript: {
      ignoreBuildErrors: true,
    },
  },
);

module.exports = finalConfig;
