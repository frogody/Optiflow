// This file makes it easier to import translations
import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import nl from './nl';

const translations = {
  en,
  nl,
  de,
  fr,
  es,
};

export type TranslationKey = keyof typeof translations;

export default translations;
