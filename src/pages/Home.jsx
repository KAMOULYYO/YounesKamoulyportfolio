import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PublicNavbar from '../components/public/PublicNavbar';
import { SectionRenderer } from '../components/public/SectionRenderer';
import { useSiteConfigStore } from '../store/useSiteConfigStore';
import { localizeConfig } from '../utils/i18n';
import { uiText } from '../utils/i18n';
import { applySeo } from '../utils/seo';

const LANGUAGE_STORAGE_KEY = 'portfolio_language';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'fr';
  });
  const config = useSiteConfigStore((state) => state.config);
  const localizedConfig = useMemo(() => localizeConfig(config, language), [config, language]);

  const ordered = useMemo(
    () => [...localizedConfig.sections].sort((a, b) => a.order - b.order),
    [localizedConfig.sections]
  );

  const alwaysVisible = new Set(['hero', 'projects', 'contact']);
  const visibleSections = ordered.filter(
    (section) => section.enabled || alwaysVisible.has(section.id)
  );
  const t = uiText[language] || uiText.fr;

  useEffect(() => {
    applySeo(localizedConfig, language);
  }, [localizedConfig, language]);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-brand-bg text-zinc-100 premium-mesh noise-overlay">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="ambient-orb ambient-orb-one"
          animate={{ x: [0, 40, -30, 0], y: [0, -35, 20, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="ambient-orb ambient-orb-two"
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -25, 0], scale: [1, 0.92, 1.06, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="ambient-orb ambient-orb-three"
          animate={{ x: [0, 25, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.06, 0.96, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="ambient-grid" />
      </div>

      <PublicNavbar
        sections={visibleSections}
        language={language}
        onLanguageChange={setLanguage}
      />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 md:px-6"
      >
        {visibleSections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            meta={localizedConfig.meta}
            language={language}
          />
        ))}
      </motion.main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-black/90 p-3 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
          <a href="#contact" className="border border-lime-400 bg-lime-400 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-black">
            {t.stickyPrimary}
          </a>
          <a href={`mailto:${localizedConfig.meta?.email || ''}`} className="border border-zinc-600 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-zinc-100">
            {t.stickySecondary}
          </a>
        </div>
      </div>

      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl"
            >
              <span className="text-lime-400">Y</span> KAMOULY<span className="text-lime-400">.</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
