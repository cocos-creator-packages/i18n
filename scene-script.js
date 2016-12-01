module.exports = {
    'update-default-language': function (event, language) {
        if (language) {
            let i18n = window.require('LanguageData');
            i18n.init(language);
            if (event.reply) {
                event.reply(null, 'successful');
                // walk all nodes with localize label and upate
                let rootNodes = cc.director.getScene().children;
                let allLocalizedLabels = [];
                for (let i = 0; i < rootNodes.length; ++i) {
                    let labels = rootNodes[i].getComponentsInChildren('LocalizedLabel');
                    Array.prototype.push.apply(allLocalizedLabels, labels);
                }
                for (let i = 0; i < allLocalizedLabels.length; ++i) {
                    let label = allLocalizedLabels[i];
                    label.updateLabel(); 
                }
            }
            return;
        }
        if (event.reply) {
            event.reply(new Error('language not specified!'));
        }
    }
};