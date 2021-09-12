
import * as i18n from './LanguageData';

import { _decorator, Component, SpriteFrame, Sprite } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedSpriteItem')
class LocalizedSpriteItem {
    @property
    language: string = 'zh';
    @property({
        type: SpriteFrame,
    })
    spriteFrame: SpriteFrame | null = null;
}

@ccclass('LocalizedSprite')
@executeInEditMode
export class LocalizedSprite extends Component {
    sprite: Sprite | null = null;

    @property({
        type: LocalizedSpriteItem,
    })
    spriteList = [];

    onLoad() {
        if (!i18n.ready) {
            i18n.init('zh');
        }
        this.fetchRender();
    }

    fetchRender () {
        let sprite = this.getComponent('cc.Sprite') as Sprite;
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite();
            return;
        } 
    }

    updateSprite () {
        for (let i = 0; i < this.spriteList.length; i++) {
            const item = this.spriteList[i];
            // @ts-ignore
            if (item.language === i18n._language) {
                // @ts-ignore
                this.sprite.spriteFrame = item.spriteFrame;
                break;
            }
        }
    }
}
