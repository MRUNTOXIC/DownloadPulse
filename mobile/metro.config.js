const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// Restrict Metro file watching strictly to the mobile application directory
defaultConfig.watchFolders = [__dirname];

// Block Metro from crawling sibling project directories (desktop-agent, backend, .git)
defaultConfig.resolver.blockList = [
  new RegExp(path.resolve(__dirname, '../desktop-agent').replace(/\\/g, '/') + '/.*'),
  new RegExp(path.resolve(__dirname, '../backend').replace(/\\/g, '/') + '/.*'),
  /.*\.git\/.*/
];

module.exports = defaultConfig;
