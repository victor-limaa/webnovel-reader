const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];
config.resolver.sourceExts = config.resolver.sourceExts.filter((extension) => extension !== 'wasm');
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  canvas: path.resolve(__dirname, 'shims/empty-canvas.js'),
};

module.exports = config;
