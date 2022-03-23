// Generated by @glaze/sdk-toolkit

/**
 * @type {import('@glaze/types').GlazeConfig}
 */
const config = {
  plugins: [{
    id: '@glaze-plugin/google-analytic',
    name: '配置 Google Analytics',
    desc: '焦点热力图支持插件，监听所有元素的在用户视窗内的时间并上传 Glaze 分析服务器',
    type: 'PUBLIC',
    main: './analytic/index.ts',
    config: {
      string: {
        name: '字符串测试',
        type: 'text',
        default: 'string'
      },
      number: {
        name: '数字测试',
        type: 'number',
        default: 1,
        min: 0,
        max: 10
      }
    },
    icon: 'https://glaze-1257788062.cos.ap-nanjing.myqcloud.com/user/kunduin/icon.jpg'
  }],

  // Never change this object.
  generated: {
    ownerTeamId: 2
  }
}

module.exports = config
