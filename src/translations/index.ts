// This file makes it easier to import translations
import en from './en';
import nl from './nl';
import de from './de';
import fr from './fr';
import es from './es';

const translations = {
  en,
  nl,
  de,
  fr,
  es,
};

export type TranslationKey = keyof typeof translations;

export default translations;
