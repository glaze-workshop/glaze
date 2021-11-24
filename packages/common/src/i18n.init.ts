import i18next, { Module, Newable, NewableModule, t } from 'i18next'

import zhCN from './locales/zh.json'
import enUS from './locales/en.json'

/**
 * 支持的语言
 */
export enum SupportedLanguage {
  /**
   * 中
   */
  ZH = 'zh',

  /**
   * 英
   */
  EN = 'en'
}

export const getLanguageNaming = (): Record<SupportedLanguage, string> => ({
  [SupportedLanguage.ZH]: t('lang.zh'),
  [SupportedLanguage.EN]: t('lang.en')
})

/**
 * 初始化 i18n，尽可能在项目的最开始调用
 *
 * @param plugins 插件列表
 */
export function initI18n (...plugins: (Module | NewableModule<Module> | Newable<Module>)[]) {
  for (const plugin of plugins) {
    i18next.use(plugin)
  }
  i18next.init({
    debug: process.env.NODE_ENV === 'development',
    lng: SupportedLanguage.ZH,
    resources: {
      zh: { translation: zhCN },
      en: { translation: enUS }
    }
  })
}
