import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock3, ShieldCheck, Rocket, Save, RotateCcw } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import SectionList from '../components/admin/SectionList';
import SectionEditorModal from '../components/admin/SectionEditorModal';
import AdminCommandPalette from '../components/admin/AdminCommandPalette';
import { SectionRenderer } from '../components/public/SectionRenderer';
import { logoutAdmin } from '../utils/auth';
import { useSiteConfigStore } from '../store/useSiteConfigStore';
import { readAnalytics, resetAnalytics } from '../utils/analytics';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState('sections');
  const [editingSection, setEditingSection] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [analytics, setAnalytics] = useState({ cvClicks: 0, projectClicks: 0, contactSubmits: 0 });

  const {
    config,
    history,
    toggleSection,
    updateSection,
    addCustomSection,
    deleteSection,
    reorderSections,
    addItemToSection,
    removeLastItemFromSection,
    saveConfig,
    resetConfig,
    setMode,
    publishConfig,
    restoreVersion,
    setConfig,
  } = useSiteConfigStore();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setAnalytics(readAnalytics());
  }, [panel]);

  const ordered = useMemo(
    () => [...config.sections].sort((a, b) => a.order - b.order),
    [config.sections]
  );

  const visibleForPreview = ordered.filter((section) => section.enabled);
  const readonly = config.mode === 'published';

  const onCommand = (id) => {
    if (id === 'sections') setPanel('sections');
    if (id === 'settings') setPanel('settings');
    if (id === 'history') setPanel('history');
    if (id === 'preview') setMode('preview');
    if (id === 'publish') publishConfig();
    if (id === 'home') navigate('/');
    if (id === 'logout') {
      logoutAdmin();
      navigate('/admin/login', { replace: true });
    }
  };

  const updateMeta = (patch) => {
    setConfig({ ...config, mode: 'preview', meta: { ...config.meta, ...patch } });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-zinc-100 premium-mesh p-4 md:p-5">
      <AdminCommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onRun={onCommand} />

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <AdminSidebar
          active={panel}
          onChange={setPanel}
          onVisitSite={() => navigate('/')}
          onLogout={() => {
            logoutAdmin();
            navigate('/admin/login', { replace: true });
          }}
        />

        <main className="grid gap-4">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Control Panel</p>
                <h1 className="font-display text-2xl font-bold">Site Configuration Dashboard</h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.mode === 'published' ? 'bg-green-900/40 text-green-300' : 'bg-amber-900/40 text-amber-300'}`}>
                  {config.mode === 'published' ? 'Published' : 'Preview'}
                </span>
                {config.updatedAt && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                    <Clock3 size={12} /> Updated
                  </span>
                )}
                <button type="button" onClick={saveConfig} className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:border-brand-red">
                  <Save size={14} /> Save
                </button>
                <button type="button" onClick={resetConfig} className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:border-brand-red">
                  <RotateCcw size={14} /> Reset
                </button>
                <button type="button" onClick={() => setMode('preview')} className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:border-brand-red">
                  <ShieldCheck size={14} /> Preview
                </button>
                <button type="button" onClick={publishConfig} className="inline-flex items-center gap-1 rounded-xl bg-brand-red px-3 py-2 text-sm font-semibold text-white hover:brightness-110">
                  <Rocket size={14} /> Publish
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-4 2xl:grid-cols-[1fr_1fr]">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4">
              {panel === 'sections' && (
                <SectionList
                  sections={ordered}
                  readonly={readonly}
                  onToggle={toggleSection}
                  onEdit={setEditingSection}
                  onDelete={deleteSection}
                  onAddCustom={addCustomSection}
                  onReorder={(activeId, overId) => reorderSections(activeId, overId)}
                  onAddItem={(sectionId, _kind, template) => addItemToSection(sectionId, template || { title: 'New item' })}
                  onRemoveItem={removeLastItemFromSection}
                />
              )}

              {panel === 'settings' && (
                <div className="space-y-3">
                  <h2 className="font-display text-xl font-semibold">Global settings</h2>
                  <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-sm text-zinc-300">
                    <p>Temporary login is <span className="font-mono">admin / admin</span>.</p>
                    <p className="mt-2 font-mono text-xs text-zinc-400">Override with VITE_ADMIN_USER / VITE_ADMIN_PASS until Supabase auth is connected.</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-sm text-zinc-300">
                    <p className="font-semibold text-zinc-100">Basic analytics</p>
                    <p className="mt-2">CV clicks: <span className="font-mono">{analytics.cvClicks}</span></p>
                    <p>Project clicks: <span className="font-mono">{analytics.projectClicks}</span></p>
                    <p>Contact submits: <span className="font-mono">{analytics.contactSubmits}</span></p>
                    <button
                      type="button"
                      onClick={() => setAnalytics(resetAnalytics())}
                      className="mt-3 rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:border-brand-red"
                    >
                      Reset analytics
                    </button>
                  </div>
                </div>
              )}

              {panel === 'history' && (
                <div className="space-y-3">
                  <h2 className="font-display text-xl font-semibold">Version history (last 5)</h2>
                  {history.length === 0 && <p className="text-sm text-zinc-500">No saved versions yet.</p>}
                  {history.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                      <p className="text-sm text-zinc-300">{new Date(entry.at).toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => restoreVersion(entry.id)}
                        className="mt-2 rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:border-brand-red"
                      >
                        Restore this version
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/75">
              <div className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-400">Live preview</div>
              <motion.div initial={{ opacity: 0.65 }} animate={{ opacity: 1 }} className="max-h-[72vh] overflow-y-auto p-4">
                {visibleForPreview.map((section) => (
                  <SectionRenderer key={section.id} section={section} meta={config.meta} />
                ))}
              </motion.div>
            </section>
          </div>
        </main>
      </div>

      <SectionEditorModal
        open={Boolean(editingSection)}
        section={editingSection}
        meta={config.meta}
        onClose={() => setEditingSection(null)}
        onSave={updateSection}
        onMetaSave={updateMeta}
        readonly={readonly}
      />
    </div>
  );
}
