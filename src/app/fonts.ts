// Defining font variables for use with CSS variables
// This approach works with Babel unlike the next/font import

export const fontFamilies = {
  inter: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

// CSS variable name
export const interVariable = '--font-inter';

// For backwards compatibility with existing code
export const inter = {
  variable: interVariable,
  style: {
    fontFamily: fontFamilies.inter,
  }
}; 