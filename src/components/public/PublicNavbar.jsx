import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import cvFile from '../../cv-younes-kamouly.pdf';
import { trackAnalyticsEvent } from '../../utils/analytics';
import { uiText } from '../../utils/i18n';

export default function PublicNavbar({ sections, language = 'fr', onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const t = uiText[language] || uiText.fr;

  const navItems = useMemo(() => {
    const labelById = {
      projects: t.navProjects,
      skills: t.navSkills,
      contact: t.navContact,
    };
    const preferred = ['projects', 'skills', 'contact'];
    const mapped = preferred
      .map((id) => sections.find((section) => section.id === id))
      .filter(Boolean)
      .map((section) => ({
        id: section.id,
        label: labelById[section.id] || section.name.toUpperCase(),
      }));

    return mapped.length > 0
      ? mapped
      : sections
          .filter((section) => section.kind !== 'footer')
          .map((section) => ({ id: section.id, label: section.name.toUpperCase() }));
  }, [sections, t.navContact, t.navProjects, t.navSkills]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-lime-400/70 bg-black/80 backdrop-blur-xl">
      <nav className="mx-auto grid max-w-[1720px] grid-cols-[1fr_auto_1fr] items-center px-4 py-4 md:px-7">
        <a
          href="#hero"
          className="justify-self-start font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          <span className="text-lime-400">Y</span> KAMOULY<span className="text-lime-400">.</span>
        </a>

        <div className="hidden justify-self-center border border-zinc-800 bg-zinc-950/70 p-1 md:flex md:gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`px-6 py-2 text-sm tracking-[0.15em] transition ${
                active === item.id ? 'bg-lime-400 text-black' : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              [{` ${item.label} `}]
            </button>
          ))}
        </div>

        <div className="hidden items-center justify-self-end gap-3 md:flex">
          <div className="flex items-center border border-zinc-700 bg-zinc-950/70 p-0.5 text-xs uppercase tracking-[0.08em]">
            <span className="px-2 text-zinc-400">{t.localeLabel}</span>
            <button
              type="button"
              onClick={() => onLanguageChange?.('fr')}
              aria-label="Passer en francais"
              className={`px-2 py-1 ${language === 'fr' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange?.('en')}
              aria-label="Switch to English"
              className={`px-2 py-1 ${language === 'en' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
            >
              EN
            </button>
          </div>

          <a
            href="#contact"
            onClick={() => go('contact')}
            className="border border-lime-400 bg-lime-400 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-black"
          >
            {t.navCta}
          </a>

          <a
            href={cvFile}
            download="younes-cv.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackAnalyticsEvent('cv_click')}
            className="border border-zinc-200 bg-white px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-black"
          >
            YOUNES-CV.PDF
          </a>
        </div>

        <button
          type="button"
          className="justify-self-end rounded-none border border-zinc-700 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950/95 p-2 md:hidden">
          <div className="mb-2 flex items-center justify-center gap-2 border-b border-zinc-800 pb-2">
            <button
              type="button"
              onClick={() => onLanguageChange?.('fr')}
              aria-label="Passer en francais"
              className={`border px-3 py-1 text-xs ${language === 'fr' ? 'border-lime-400 bg-lime-400 text-black' : 'border-zinc-700 text-zinc-300'}`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange?.('en')}
              aria-label="Switch to English"
              className={`border px-3 py-1 text-xs ${language === 'en' ? 'border-lime-400 bg-lime-400 text-black' : 'border-zinc-700 text-zinc-300'}`}
            >
              EN
            </button>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className="mb-1 block w-full border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900"
            >
              [{` ${item.label} `}]
            </button>
          ))}
          <button
            type="button"
            onClick={() => go('contact')}
            className="mt-2 block w-full border border-lime-400 bg-lime-400 px-3 py-2 text-left text-sm font-semibold text-black"
          >
            {t.navCta}
          </button>
        </div>
      )}
    </header>
  );
}
