'use strict';

Vue.component('localized-sprite', {
  template: `
    <ui-prop style="padding-top: 10px" v-for="item in target.spriteFrameSet.value"
    name="{{item.language}}"
    >
        <ui-asset class="flex-1"
            type="sprite-frame"
            v-value="item.spriteFrame.value"
        ></ui-asset>
    </ui-prop>
      <ui-button
        class="blue tiny"
        @confirm="initSpriteFrameSet"
      >
      Add SpriteFrames
      </ui-button>
  `,

  props: {
    target: {
      twoWay: true,
      type: Object,
    },
  },

  computed: {
    // a computed getter
    spriteFrameSet: function () {
        if (this.target.spriteFrameSet.value.length > 0) {
            return this.target.spriteFrameSet.value;
        }
        let languages = Object.keys(window.i18n.languages);
        let set = languages.map((lang) => {
            return {
                language: lang,
                spriteFrame: null
            };
        });
        return set;
    },
  },

  methods: {
    initSpriteFrameSet: function () {
        let languages = Object.keys(window.i18n.languages);
        let SpriteFrameSet = window.require('SpriteFrameSet');
        let newSet = languages.map((lang) => {
            let sfs = new SpriteFrameSet();
            sfs.language = lang;
            sfs.spriteFrame = null;
            return sfs;
        });
        this.target.spriteFrameSet.value = newSet;
    }
  }
});