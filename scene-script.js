module.exports = {
    'update-default-language': function (event, language) {
        if (language) {
            let i18n = window.require('LanguageData');
            i18n.init(language);
            i18n.updateSceneRenderers();
            if (event.reply) {
                event.reply(null, 'successful');
            }
            return;
        }
        if (event.reply) {
            event.reply(new Error('language not specified!'));
        }
    }
};