import React, { useEffect } from 'react';
import { env } from '../config/env.ts';

export interface SeoProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  ogType?: string;
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  noindex = false,
  ogType = 'website',
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title 
      ? `${title} | ABC Car Showroom` 
      : 'ABC Car Showroom';
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.content = contentVal;
    };

    // 2. Description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
    }

    // 3. OpenGraph Title and Type
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:type', ogType);

    // 4. Robots (noindex)
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) robots.remove();
    }

    // 5. Canonical Link (only if VITE_PUBLIC_SITE_URL configured, otherwise omit)
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (env.publicSiteUrl && env.publicSiteUrl.startsWith('http')) {
      let canonical = existingCanonical as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `${env.publicSiteUrl.replace(/\/+$/, '')}${window.location.pathname}`;
    } else if (existingCanonical) {
      existingCanonical.remove();
    }
  }, [title, description, noindex, ogType]);

  return null;
};
