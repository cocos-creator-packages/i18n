const Polyglot = require('polyglot.min');
const Fs = require('fs');
const Path = require('path');

let polyInst = null;
let curLang = '';

if (CC_EDITOR) {
    let profilePath = Path.join(Editor.projectInfo.path, 'settings', 'i18n.json');
    // if (fs.existsSync(profilePath)) {
    let profile = JSON.parse(Fs.readFileSync(profilePath, 'utf8'));
    curLang = profile['default_language'];
    // }
}

function loadLanguageData (language) {
    return window.i18n[language];
}

function initPolyglot (data) {
    if (data) {
        if (polyInst) {
            polyInst.replace(data);
        } else {
            polyInst = new Polyglot({ phrases: data, allowMissing: true });
        }
    }
}

module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init (language) {
        if (language && language === curLang) {
            return;
        }
        let data = null;
        if (!language) {
            data = loadLanguageData(curLang);
        } else {
            data = loadLanguageData(language);
            curLang = language;
        }
        initPolyglot(data);
    },
    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     *
     * var myText = i18n.t('MY_TEXT_KEY');
     *
     * // if your data source is defined as
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t (key, opt) {
        if (polyInst) {
            return polyInst.t(key, opt);
        }
    },

    inst: polyInst
};