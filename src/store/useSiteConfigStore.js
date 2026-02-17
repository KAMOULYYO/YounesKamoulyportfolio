import { create } from 'zustand';
import { initialSiteConfig, createCustomSection } from '../data/siteConfig';
import { STORAGE_KEYS, readJSON, writeJSON } from '../utils/storage';

const clone = (value) => JSON.parse(JSON.stringify(value));
const EXPERIENCE_EMOJIS = ['💼', '🧑‍💻', '🛒', '🗂️', '🚀', '📈', '🤝'];

const sortSections = (sections) => [...sections].sort((a, b) => a.order - b.order);

const normalizeMeta = (meta) => ({
  ...initialSiteConfig.meta,
  ...(meta || {}),
});

const normalizeSection = (section, index) => {
  const fallback = initialSiteConfig.sections[index] || {};
  const id = typeof section?.id === 'string' && section.id.trim() ? section.id : fallback.id || `section-${index}`;
  const kind = typeof section?.kind === 'string' && section.kind.trim() ? section.kind : fallback.kind || 'text';
  const name = typeof section?.name === 'string' && section.name.trim() ? section.name : fallback.name || kind;
  const data = section?.data && typeof section.data === 'object' && !Array.isArray(section.data) ? section.data : {};

  return {
    ...section,
    id,
    kind,
    name,
    builtIn: Boolean(section?.builtIn),
    enabled: section?.enabled !== false,
    order: Number.isFinite(section?.order) ? section.order : index,
    data,
  };
};

const normalizeConfig = (config) => {
  const base = config && typeof config === 'object' ? config : {};
  const sectionsRaw = Array.isArray(base.sections) ? base.sections : initialSiteConfig.sections;
  const sections = sectionsRaw.map((section, index) => normalizeSection(section, index));

  return {
    ...initialSiteConfig,
    ...base,
    meta: normalizeMeta(base.meta),
    sections,
  };
};

const migrateConfig = (config) => {
  if (!config || !Array.isArray(config.sections)) return config;

  return {
    ...config,
    sections: config.sections.map((section) => {
      if (section.id !== 'hero') return section;

      const defaultHero = initialSiteConfig.sections.find((item) => item.id === 'hero');
      const defaultImage = defaultHero?.data?.image;
      const currentImage = section.data?.image;
      const isLegacyUnsplash =
        typeof currentImage === 'string' && currentImage.includes('images.unsplash.com/photo-1552664730-d307ca884978');

      if (!defaultImage) return section;
      if (!currentImage || isLegacyUnsplash) {
        return { ...section, data: { ...section.data, image: defaultImage } };
      }

      return section;
    }),
  };
};

const addVersion = (history, config) => {
  const next = [{ id: Date.now(), at: new Date().toISOString(), snapshot: clone(config) }, ...history];
  return next.slice(0, 5);
};

const loadInitialState = () => {
  const saved = readJSON(STORAGE_KEYS.siteSavedConfig, initialSiteConfig);
  const current = readJSON(STORAGE_KEYS.siteConfig, saved);
  const history = readJSON(STORAGE_KEYS.siteHistory, []);
  const migratedSaved = normalizeConfig(migrateConfig(saved));
  const migratedCurrent = normalizeConfig(migrateConfig(current));

  return {
    config: { ...migratedCurrent, sections: sortSections(migratedCurrent.sections || []) },
    savedConfig: { ...migratedSaved, sections: sortSections(migratedSaved.sections || []) },
    history,
  };
};

export const useSiteConfigStore = create((set, get) => ({
  ...loadInitialState(),

  persistAll: () => {
    const { config, savedConfig, history } = get();
    writeJSON(STORAGE_KEYS.siteConfig, config);
    writeJSON(STORAGE_KEYS.siteSavedConfig, savedConfig);
    writeJSON(STORAGE_KEYS.siteHistory, history);
  },

  setConfig: (nextConfig) => {
    set({ config: { ...nextConfig, sections: sortSections(nextConfig.sections || []) } });
    get().persistAll();
  },

  toggleSection: (sectionId) => {
    const { config } = get();
    const next = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: config.sections.map((section) =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      ),
    };
    get().setConfig(next);
  },

  updateSection: (sectionId, patch) => {
    const { config } = get();
    const next = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: config.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              ...patch,
              data: patch.data ? { ...section.data, ...patch.data } : section.data,
            }
          : section
      ),
    };
    get().setConfig(next);
  },

  addCustomSection: (kind) => {
    const { config } = get();
    const section = createCustomSection(kind);
    section.order = config.sections.length;
    const next = {
      ...config,
      mode: 'preview',
      updatedAt: new Date().toISOString(),
      sections: sortSections([...config.sections, section]).map((item, index) => ({ ...item, order: index })),
    };
    get().setConfig(next);
  },

  deleteSection: (sectionId) => {
    const { config } = get();
    const target = config.sections.find((section) => section.id === sectionId);
    if (!target) return;

    const next = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: config.sections
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index })),
    };
    get().setConfig(next);
  },

  reorderSections: (activeId, overId) => {
    if (!overId || activeId === overId) return;
    const { config } = get();
    const sections = sortSections(config.sections);

    const oldIndex = sections.findIndex((section) => section.id === activeId);
    const newIndex = sections.findIndex((section) => section.id === overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = [...sections];
    const [item] = moved.splice(oldIndex, 1);
    moved.splice(newIndex, 0, item);

    const next = {
      ...config,
      mode: 'preview',
      updatedAt: new Date().toISOString(),
      sections: moved.map((section, index) => ({ ...section, order: index })),
    };
    get().setConfig(next);
  },

  addItemToSection: (sectionId, newItem) => {
    const { config } = get();
    const next = {
      ...config,
      mode: 'preview',
      updatedAt: new Date().toISOString(),
      sections: config.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const items = [...(section.data.items || [])];
        let itemToAdd = newItem;

        if (section.kind === 'experience' && itemToAdd && typeof itemToAdd === 'object') {
          const nextEmoji = EXPERIENCE_EMOJIS[items.length % EXPERIENCE_EMOJIS.length];
          itemToAdd = { ...itemToAdd, emoji: itemToAdd.emoji || nextEmoji };
        }

        return { ...section, data: { ...section.data, items: [...items, itemToAdd] } };
      }),
    };
    get().setConfig(next);
  },

  removeLastItemFromSection: (sectionId) => {
    const { config } = get();
    const next = {
      ...config,
      mode: 'preview',
      updatedAt: new Date().toISOString(),
      sections: config.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const items = section.data.items || [];
        return { ...section, data: { ...section.data, items: items.slice(0, -1) } };
      }),
    };
    get().setConfig(next);
  },

  saveConfig: () => {
    const { config, history } = get();
    const nextHistory = addVersion(history, config);
    set({ savedConfig: clone(config), history: nextHistory });
    get().persistAll();
  },

  resetConfig: () => {
    const { savedConfig } = get();
    set({ config: clone(savedConfig) });
    get().persistAll();
  },

  setMode: (mode) => {
    const { config } = get();
    const next = { ...config, mode };
    get().setConfig(next);
  },

  publishConfig: () => {
    const { config, history } = get();
    const published = {
      ...config,
      mode: 'published',
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
    const nextHistory = addVersion(history, published);
    set({ config: published, savedConfig: clone(published), history: nextHistory });
    get().persistAll();
  },

  restoreVersion: (versionId) => {
    const { history } = get();
    const found = history.find((version) => version.id === versionId);
    if (!found) return;
    set({ config: clone(found.snapshot), savedConfig: clone(found.snapshot) });
    get().persistAll();
  },
}));
