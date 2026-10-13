/**
 * ABC Car Showroom - Design Tokens (PRD Section 13.1)
 * Single source of truth for color definitions.
 * When the final showroom logo arrives, edit these tokens and CSS variables here.
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: '#14161C',     // Deep Charcoal - Main brand text & dark accents
    accent: '#C8102E',      // Showroom Red - Primary CTAs and focal highlights
    surface: '#FFFFFF',     // Clean White - Cards, dialogs, surfaces
    bgLight: '#F7F7F5',     // Off-white / light neutral page background
    success: '#1F9D55',     // Operational status positive
    warning: '#E0A800',     // Pending / warning status
    soldTag: '#C8102E',     // SOLD status badge
    soldText: '#FFFFFF',    // SOLD badge text
  },
  typography: {
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
