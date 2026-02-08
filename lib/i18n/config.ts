/**
 * i18n Configuration
 * Internationalization setup for English and French
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants'
import en from './locales/en.json'
import fr from './locales/fr.json'

const resources = {
  [SUPPORTED_LANGUAGES.EN]: { translation: en },
  [SUPPORTED_LANGUAGES.FR]: { translation: fr },
}

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  ns: ['translation'],
  defaultNS: 'translation',
})

export default i18n
