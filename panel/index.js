var Fs = require('fire-fs');
var Path = require('fire-path');
var lodash = require('lodash');
var projectPath = Editor.projectInfo.path;
var i18nPath = Path.join(projectPath, 'assets', 'resources', 'i18n');

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: Fs.readFileSync(Editor.url('packages://i18n/panel/index.css', 'utf8')),

  // html template for panel
  template: Fs.readFileSync(Editor.url('packages://i18n/panel/index.html', 'utf8')),

  // element and variable binding
  $: {
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {
    var profile = this.profiles.project;
    var vm = this._vm = new window.Vue({
      el: this.shadowRoot,
      data: {
        languages: [],
        defaultLanguage: '',
        newLangID: ''
      },
      watch: {
        defaultLanguage (val) {
          profile.data['default_language'] = val;
          profile.save();
          Editor.Scene.callSceneScript('i18n', 'update-default-language', val, function (err, result) {
            // console.log(result);
          });
        }
      },
      methods: {

        _dataPath (language) {
          return Path.relative(projectPath, Path.join(i18nPath, language + '.js')).replace(/\\/g, '/');
        },

        _createLanguage () {
          var dataPath = Path.join(i18nPath, this.newLangID + '.js');
          var resPath = Path.join(projectPath, 'assets', 'resources');  
          var initData = 'if (!window.i18n) window.i18n = {};\n'
            + 'if (!window.i18n.languages) window.i18n.languages = {};\n'
            + 'window.i18n.languages.' + this.newLangID + '={\n'
            + '// write your key value pairs here\n'
            + '};';
          var createAsset = function () {
            var url = 'db://' + Path.relative(projectPath, dataPath).replace(/\\/g, '/'); 
            Editor.assetdb.create(url, initData, function (err) {
              if (err) {
                Editor.assetdb.error('Failed to create asset %s, %s', url, err.stack);
                return;
              }
              this.languages.push(this.newLangID);
              this.newLangID = '';
              profile.data.languages = this.languages;
              profile.save();
            }.bind(this));
          }.bind(this);
          if (!Fs.isDirSync(resPath)) {
            Editor.assetdb.create('db://assets/resources', null, function(err) {
              Editor.assetdb.create('db://assets/resources/i18n', null, function(err) {
                createAsset();
              });
            });
          } else if (!Fs.isDirSync(i18nPath)) {
              Editor.assetdb.create('db://assets/resources/i18n', null, function(err) {
                createAsset();
              });              
          } else {
            createAsset();
          }
          // Editor.assetdb.refresh('db://' + Path.relative(projectPath, dataPath).replace(/\\/g, '/'), (err, results) => {
          //   if (err) {
          //     Editor.assetdb.error('Failed to reimport asset %s, %s', path, err.stack);
          //     return;
          //   }            
          // });
        },

        _deleteLanguage (lang) {
          var dataPath = Path.join(i18nPath, lang + '.js');
          if (Fs.existsSync(dataPath)) {
            let resultId = Editor.Dialog.messageBox({
              type: 'warning',
              buttons: ['Cancel', 'OK'],
              title: 'Delete Language Data',
              message: 'Delete i18n language data, this cannot be undone!',
              detail: dataPath,
              noLink: true
            });
            if (resultId === 1) {
              Editor.assetdb.delete(['db://' + Path.relative(projectPath, dataPath).replace(/\\/g, '/')], (err, results) => {
                if (err) {
                  Editor.assetdb.error('Failed to delete asset %s, %s', path, err.stack);
                  return;
                }
              });
            }          
          } else {
            Editor.log('Language data not existing, remove from languages list');
          }
          var id = this.languages.indexOf(lang);
          this.languages.splice(id, 1);
          profile.data.languages = this.languages;
          profile.save();
        },

        _validNewLang () {
          if (!this.newLangID) {
            return false;
          }
          if (lodash.includes(this.languages, this.newLangID)) {
            return false;
          }
          return true;
        },

        _openHelpClick (event) {
          event.stopPropagation();
          let url = 'https://github.com/cocos-creator-packages/i18n#i18n-for-cocos-creator';
          const Electron = require('electron');
          Electron.shell.openExternal(url);
        }
      }
    });

    vm.languages = profile.data.languages;
    vm.defaultLanguage = profile.data['default_language'];
  },

  // register your ipc messages here
  messages: {
  }
});