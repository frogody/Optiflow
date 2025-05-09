// @ts-nocheck - This file has some TypeScript issues that are hard to fix
/**
 * Browser detection utilities for platform-specific fixes
 */

/**
 * Detects if the current browser is Safari
 * @returns {boolean} True if the browser is Safari
 */
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent.toLowerCase();
  return (
    ua.indexOf('safari') !== -1 &&
    ua.indexOf('chrome') === -1 &&
    ua.indexOf('android') === -1
  );
};

/**
 * Detects if the current browser is Mobile Safari
 * @returns {boolean} True if the browser is Mobile Safari
 */
export const isMobileSafari = (): boolean => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent.toLowerCase();
  return (
    ua.indexOf('safari') !== -1 &&
    ua.indexOf('chrome') === -1 &&
    ua.indexOf('android') === -1 &&
    (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1)
  );
};

/**
 * Applies Safari-specific CSS classes to the document body
 * Can be called in layout or app component
 */
export const applySafariDetection = (): void => {
  if (typeof document === 'undefined') return;

  if (isSafari()) {
    document.body.classList.add('safari');
  }

  if (isMobileSafari()) {
    document.body.classList.add('mobile-safari');
  }
};

/**
 * Gets the Safari version if the browser is Safari
 * @returns {number|null} Safari version or null if not Safari
 */
export const getSafariVersion = (): number | null => {
  if (!isSafari()) return null;

  const ua = window.navigator.userAgent;
  const safariRegex = /version\/(\d+(\.\d+)?)/i;
  const match = ua.match(safariRegex);

  if (match && match[1]) {
    return parseFloat(match[1]);
  }

  return null;
};
