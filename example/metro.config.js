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

module.exports = config;
