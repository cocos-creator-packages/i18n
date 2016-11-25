const i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true
    },

    properties: {
        dataID: {
            get () {
                return this._dataID;
            },
            set (val) {
                if (this._dataID !== val) {
                    this._dataID = val;
                    this.updateSprite();
                }
            }
        },
        _dataID: ''
    },
    
    onLoad () {
        i18n.init('zh');
        this.fetchRender();
    },

    fetchRender () {
        let sprite = this.getComponent(cc.Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite();
            return;
        }
    },

    updateSprite () {
        if (!this.sprite) {
            cc.error('Failed to update localized sprite, sprite component is invalid!');
            return;
        }
        let localizedUrl = i18n.t(this.dataID);
        if (localizedUrl && this.sprite.spriteFrame) {
            if (CC_EDITOR) {
                return;
            } 
            let sfUUID = this.sprite.spriteFrame._uuid;
            window._CCSettings.rawAssets.assets[sfUUID][0] = localizedUrl;
        }
    }
});