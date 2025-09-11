import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import hi from './locales/hi.json';
import pa from './locales/pa.json';

export type SupportedLocale = 'en' | 'hi' | 'pa';

export const i18n = new I18n({ en, hi, pa });
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export const getSystemLocale = (): SupportedLocale => {
	try {
		const tag = (Localization.getLocales?.()[0]?.languageCode || 'en') as SupportedLocale;
		return ['en', 'hi', 'pa'].includes(tag) ? (tag as SupportedLocale) : 'en';
	} catch {
		return 'en';
	}
};

export const setLocale = (locale: SupportedLocale) => {
	i18n.locale = locale;
	// Notify subscribers so UI can re-render on locale changes
	try { localeListeners.forEach((fn) => fn(locale)); } catch {}
};

// Initialize with system locale
try {
	setLocale(getSystemLocale());
} catch {
	// Fallback to English if initialization fails
	i18n.locale = 'en';
}

export const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);

// Lightweight subscription to react on locale changes from UI
type LocaleListener = (locale: SupportedLocale) => void;
const localeListeners = new Set<LocaleListener>();
export const subscribeToLocale = (listener: LocaleListener) => {
	localeListeners.add(listener);
	return () => localeListeners.delete(listener);
};


