module.exports = {
    'update-default-language': function (event, language) {
        if (language) {
            let i18n = require('LanguageData');
            i18n.init(language);
            if (event.reply) {
                event.reply('successful');
            }
            return;
        }
        if (event.reply) {
            event.reply('language not specified!');
        }
    }
};