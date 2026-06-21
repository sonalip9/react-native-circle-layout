const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');
const pnpmTempPathPattern =
  /[/\\]node_modules[/\\](?:\.pnpm[/\\][^/\\]+[/\\]node_modules[/\\])?[^/\\]+_tmp_\d+_\d+(?:[/\\].*)?$/;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
  workspaces: ['.', 'example'],
});

config.resolver.blockList = [
  ...[config.resolver.blockList].flat().filter(Boolean),
  pnpmTempPathPattern,
];

// moti's core barrel does `export { AnimatePresence } from 'framer-motion'`.
// framer-motion@6's ESM entry does `import tslib from 'tslib'` and reads
// `tslib.default.__extends`; newer tslib exposes no default under Metro's
// interop -> "Cannot destructure property '__extends' of 'tslib.default'".
// Every moti entry point (including moti/interactions) transitively hits
// this barrel, so redirect framer-motion to its self-contained UMD bundle,
// which inlines the tslib helpers and never imports tslib.
// framer-motion is a transitive (pnpm) dep, so resolve it relative to moti
// rather than via require.resolve (which the package `exports` map blocks).
const motiDir = fs.realpathSync(path.join(__dirname, 'node_modules/moti'));
const framerMotionBundle = path.join(
  path.dirname(motiDir),
  'framer-motion/dist/framer-motion.js'
);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'framer-motion') {
    return context.resolveRequest(context, framerMotionBundle, platform);
  }
  return (originalResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
