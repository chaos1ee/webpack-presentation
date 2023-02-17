import * as i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import commonEnUs from '~/locales/common/en_US.yaml'
import commonZhCn from '~/locales/common/zh_CN.yaml'
import navEnUs from '~/locales/nav/en_US.yaml'
import navZhCn from '~/locales/nav/zh_CN.yaml'
import permissionEnUs from '~/locales/permission/en_US.yaml'
import permissionZhCn from '~/locales/permission/zh_CN.yaml'
import ruleEnUs from '~/locales/rule/en_US.yaml'
import ruleZhCn from '~/locales/rule/zh_CN.yaml'

// TODO: support typescript https://react.i18next.com/latest/typescript
export const defaultNS = 'common'

export const resources = {
  en_US: {
    common: commonEnUs,
    nav: navEnUs,
    rule: ruleEnUs,
    permission: permissionEnUs,
  },
  zh_CN: {
    common: commonZhCn,
    nav: navZhCn,
    rule: ruleZhCn,
    permission: permissionZhCn,
  },
} as const

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: 'en_US',
    lng: 'zh_CN',
    ns: Object.keys(resources.en_US),
    defaultNS,
    resources,
    detection: {
      lookupLocalStorage: 'I18N',
    },
  })

export default i18n
