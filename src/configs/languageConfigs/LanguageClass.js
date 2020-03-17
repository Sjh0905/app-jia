import I18n from 'react-native-i18n'

export default class LanguageClass {

    // 使用方法 $i18n.t('key')
    $i18n = I18n

    constructor(defaultLocal, options) {
        this.$i18n = I18n
        this.$i18n.defaultLocale = defaultLocal
        this.$i18n.fallbacks = true
        this.$i18n.translations = options
    }
}
