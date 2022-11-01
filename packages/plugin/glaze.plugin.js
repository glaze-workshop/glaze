// Generated by @glaze/sdk-toolkit

/**
 * @type {import('@glaze/types').GlazeComponentConfig<import('./shadow/index').ShadowProps>}
 */
const shadowComponent = {
  id: '@glaze-custom-component/shadow',
  name: 'Custom Shadow',
  main: './shadow/index.tsx',
  type: 'PUBLIC',
  props: {
    background: {
      name: '背景',
      type: 'text',
      default: '#693429',
    },
  },
  defaultSize: {
    width: ['fixed', 300],
    height: ['fixed', 200],
  },
  hasChildren: 'true',
}

/**
 * @type {import('@glaze/types').GlazeConfig}
 */
const config = {
  plugins: [
    {
      id: '@glaze-plugin/click-heatmap',
      name: '点击热力图支持插件',
      desc: '点击热力图支持插件，监听所有 Glaze 节点的点击事件并上传 Glaze 分析服务器',
      type: 'PUBLIC',
      main: './click-heatmap/index.ts',
      icon: 'https://glaze-1257788062.cos.ap-nanjing.myqcloud.com/user/kunduin/icon.jpg',
    },
    {
      id: '@glaze-plugin/scroll-heatmap',
      name: '滚动热力图支持插件',
      desc: '滚动热力图支持插件，滚动消息，并将滚动消息上传到 Glaze 分析服务器',
      type: 'PUBLIC',
      main: './scroll-heatmap/index.ts',
      icon: 'https://glaze-1257788062.cos.ap-nanjing.myqcloud.com/user/kunduin/icon.jpg',
    },
    {
      id: '@glaze-plugin/schema-test',
      name: '配置信息测试插件',
      desc: '测试动态配置是否有效',
      type: 'PUBLIC',
      main: './schema-test/index.ts',
      icon: 'https://glaze-1257788062.cos.ap-nanjing.myqcloud.com/user/kunduin/icon.jpg',
      config: {
        stringTest: {
          name: '字符串测试',
          type: 'text',
          default: 'string',
        },
        numberTest: {
          name: '数字测试',
          type: 'number',
          default: 1,
          min: 0,
          max: 10,
        },
      },
    },
    {
      id: '@glaze-plugin/cursor',
      name: '配置光标插件',
      desc: '配置光标图片',
      type: 'PUBLIC',
      main: './cursor/index.ts',
      icon: 'https://glaze-1257788062.cos.ap-nanjing.myqcloud.com/meme/Nyan_Cat_Cursor.png',
      config: {
        url: {
          name: '光标图片地址',
          type: 'text',
          default:
            'https://glaze-1257788062.cos.ap-nanjing.myqcloud.com/meme/Nyan_Cat_Cursor.png',
          required: true,
        },
      },
    },
  ],

  components: [shadowComponent],

  // Never change this object.
  generated: {
    ownerTeamId: 14,
  },
}

module.exports = config
