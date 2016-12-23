'use strict';
const Fs = require('fire-fs');
const Path = require('path');

module.exports = {
  load () {
    Fs.ensureDirSync(Path.join(Editor.projectPath, 'assets', 'resources', 'i18n'));
    Editor.Metrics.trackPackage('i18n', 'Load', null);
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('i18n');
      Editor.Metrics.trackPackage('i18n', 'Panel Open', null);
    },
    'import-asset' (event, path) {
      Editor.assetdb.refresh(path, (err, results) => {
        if (err) {
          Editor.assetdb.error('Failed to reimport asset %s, %s', path, err.stack);
          return;
        }
        Editor.assetdb._handleRefreshResults(results);

        let metaPath = path + '.meta';
        if (Fs.existsSync(Editor.url(metaPath))) {
          let meta = Fs.readJsonSync(Editor.url(metaPath));
          meta.isPlugin = true;
          Fs.outputJsonSync(Editor.url(metaPath), meta);
        } else {
          Editor.log('Failed to set language data file to plugin script');
          return;
        }
      });
    }
  },
};