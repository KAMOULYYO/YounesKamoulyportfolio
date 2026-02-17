function upsertMeta({ attr, key, content }) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink({ rel, href }) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function toAbsoluteUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
  return new URL(url, window.location.origin).toString();
}

export function applySeo(config, language = 'fr') {
  if (!config) return;

  const langTag = language === 'en' ? 'en' : 'fr';
  const locale = language === 'en' ? 'en_US' : 'fr_CA';
  const metaName = config.meta?.name || 'Portfolio';
  const hero = (config.sections || []).find((section) => section.id === 'hero');
  const heroTitle = hero?.data?.title || config.meta?.role || '';
  const heroSubtitle = hero?.data?.subtitle || '';
  const description = (heroSubtitle || config.meta?.role || '').slice(0, 160);
  const pageTitle = `${metaName} | ${language === 'en' ? 'Portfolio' : 'Portfolio'}`;
  const canonical = window.location.origin + '/';
  const image = toAbsoluteUrl(hero?.data?.image || '');

  document.documentElement.setAttribute('lang', langTag);
  document.title = pageTitle;
  upsertLink({ rel: 'canonical', href: canonical });

  upsertMeta({ attr: 'name', key: 'description', content: description });
  upsertMeta({ attr: 'property', key: 'og:type', content: 'website' });
  upsertMeta({ attr: 'property', key: 'og:locale', content: locale });
  upsertMeta({ attr: 'property', key: 'og:title', content: `${metaName} - ${heroTitle}` });
  upsertMeta({ attr: 'property', key: 'og:description', content: description });
  upsertMeta({ attr: 'property', key: 'og:url', content: canonical });
  if (image) upsertMeta({ attr: 'property', key: 'og:image', content: image });

  upsertMeta({ attr: 'name', key: 'twitter:card', content: 'summary_large_image' });
  upsertMeta({ attr: 'name', key: 'twitter:title', content: `${metaName} - ${heroTitle}` });
  upsertMeta({ attr: 'name', key: 'twitter:description', content: description });
  if (image) upsertMeta({ attr: 'name', key: 'twitter:image', content: image });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: metaName,
        jobTitle: config.meta?.role || '',
        email: config.meta?.email || '',
        url: canonical,
        sameAs: [config.meta?.linkedin, config.meta?.github].filter(Boolean),
        address: {
          '@type': 'PostalAddress',
          addressLocality: config.meta?.location || '',
        },
      },
      {
        '@type': 'WebSite',
        name: `${metaName} Portfolio`,
        url: canonical,
        inLanguage: langTag,
      },
    ],
  };

  let script = document.getElementById('seo-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
}
