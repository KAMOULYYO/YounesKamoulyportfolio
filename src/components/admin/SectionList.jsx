import { useMemo } from 'react';
import { Plus, Trash2, Pencil, Eye, EyeOff, SquarePlus, SquareMinus } from 'lucide-react';
import DragDropSectionList from './DragDropSectionList';

const sectionTemplates = {
  projects: { title: 'Nouveau projet', summary: 'Resume du projet', tags: ['React'], live: '#', github: '#', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop' },
  skills: { name: 'Nouvelle competence', level: 70 },
  experience: { emoji: '💼', title: 'Nouvelle experience', description: 'Decrivez votre impact et vos responsabilites.' },
  testimonials: { author: 'Nouvel auteur', quote: 'Collaboration professionnelle et fiable.' },
  blog: { title: 'Nouvel article', excerpt: "Court apercu de l'article." },
  grid: { title: 'Carte', body: "Contenu de l'element grille" },
  gallery: { title: "Titre de l'image", image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop' },
  stats: { label: 'Metrique', value: '42%' },
  faq: { question: 'Question', answer: 'Reponse' },
};

export default function SectionList({
  sections,
  onToggle,
  onEdit,
  onDelete,
  onAddCustom,
  onAddItem,
  onRemoveItem,
  onReorder,
  readonly,
}) {
  const sorted = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections]);

  const renderCard = (section) => {
    const hasItems = Array.isArray(section.data?.items);

    return (
      <div className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-100">{section.name}</p>
            <p className="text-xs text-zinc-500">{section.kind}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onToggle(section.id)}
              disabled={readonly}
              className="rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:border-brand-red disabled:opacity-40"
            >
              {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            {hasItems && (
              <>
                <button
                  type="button"
                  onClick={() => onAddItem(section.id, section.kind, sectionTemplates[section.kind])}
                  disabled={readonly}
                  className="rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:border-brand-red disabled:opacity-40"
                  title="Add item"
                >
                  <SquarePlus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveItem(section.id)}
                  disabled={readonly}
                  className="rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:border-brand-red disabled:opacity-40"
                  title="Remove item"
                >
                  <SquareMinus size={14} />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => onEdit(section)}
              disabled={readonly}
              className="rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:border-brand-red disabled:opacity-40"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(section.id)}
              disabled={readonly}
              className="rounded-lg border border-red-800/60 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-40"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        <p className="mb-3 text-sm text-zinc-300">Add custom section</p>
        <div className="flex flex-wrap gap-2">
          {['hero', 'about', 'projects', 'skills', 'experience', 'testimonials', 'blog', 'contact', 'text', 'grid', 'gallery', 'stats', 'faq'].map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onAddCustom(kind)}
              disabled={readonly}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs hover:border-brand-red disabled:opacity-40"
            >
              <span className="inline-flex items-center gap-1"><Plus size={12} /> {kind}</span>
            </button>
          ))}
        </div>
      </div>

      <DragDropSectionList
        sections={sorted}
        onReorder={onReorder}
        renderSection={renderCard}
      />
    </section>
  );
}
