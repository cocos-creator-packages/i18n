'use strict';
const Fs = require('fire-fs');
const Path = require('path');

module.exports = {
  load () {
    // execute when package loaded
    // let scriptPath = Path.join(Editor.projectPath, 'assets', 'package-scripts');
    // Fs.copy(Path.join(Editor.url('packages://i18n'), 'runtime-scripts'), scriptPath, {clobber: true},
    //   (err) => {
    //     if (err) {
    //       Editor.error(err);
    //       return;
    //     }
    //     Editor.log('Updated runtime scripts to ' + scriptPath);
    // });
    // ensure resources
    Fs.ensureDirSync(Path.join(Editor.projectPath, 'assets', 'resources', 'i18n'));
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('i18n');
    },
    'say-hello' () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('i18n', 'i18n:hello');
    },
    'clicked' () {
      Editor.log('Button clicked!');
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
    },
    'delete-asset' (event, path) {
    }
  },
};