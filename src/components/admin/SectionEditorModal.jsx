import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  image: z.string().optional(),
  ctaPrimary: z.string().optional(),
  ctaSecondary: z.string().optional(),
  badges: z.string().optional(),
  values: z.string().optional(),
  timeline: z.string().optional(),
  stats: z.string().optional(),
  note: z.string().optional(),
  email: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

const toCSV = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
const parseCSV = (raw) =>
  raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const cleanText = (value) => {
  if (typeof value !== 'string') return value;
  const v = value.trim();
  return v.length ? v : undefined;
};

const buildEmptyFromTemplate = (template) => {
  const out = {};
  Object.entries(template || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) out[key] = [];
    else if (typeof value === 'number') out[key] = 0;
    else if (typeof value === 'boolean') out[key] = false;
    else out[key] = '';
  });
  if (Object.keys(out).length === 0) return { title: 'New item' };
  return out;
};

const castFromInput = (original, raw) => {
  if (Array.isArray(original)) return parseCSV(raw);
  if (typeof original === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof original === 'boolean') return raw.toLowerCase() === 'true';
  return raw;
};

const displayValue = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value == null) return '';
  return String(value);
};

const knownDataKeys = new Set([
  'title',
  'subtitle',
  'body',
  'image',
  'ctaPrimary',
  'ctaSecondary',
  'badges',
  'values',
  'timeline',
  'stats',
  'items',
  'note',
]);

export default function SectionEditorModal({ open, section, meta, onClose, onSave, onMetaSave, readonly }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [items, setItems] = useState([]);
  const [newItemFieldByIndex, setNewItemFieldByIndex] = useState({});
  const [extraData, setExtraData] = useState({});
  const [newExtraKey, setNewExtraKey] = useState('');

  useEffect(() => {
    if (!section) return;

    const stats = Array.isArray(section.data?.stats)
      ? section.data.stats.map((item) => `${item.label}:${item.value}`).join(', ')
      : '';

    reset({
      name: section.name || '',
      title: section.data?.title || '',
      subtitle: section.data?.subtitle || '',
      body: section.data?.body || '',
      image: section.data?.image || '',
      ctaPrimary: section.data?.ctaPrimary || '',
      ctaSecondary: section.data?.ctaSecondary || '',
      badges: toCSV(section.data?.badges),
      values: toCSV(section.data?.values),
      timeline: toCSV(section.data?.timeline),
      stats,
      note: section.data?.note || '',
      email: meta?.email || '',
      linkedin: meta?.linkedin || '',
      github: meta?.github || '',
    });

    setItems(Array.isArray(section.data?.items) ? section.data.items : []);
    setNewItemFieldByIndex({});

    const extras = Object.entries(section.data || {}).reduce((acc, [key, value]) => {
      if (!knownDataKeys.has(key)) acc[key] = value;
      return acc;
    }, {});
    setExtraData(extras);
    setNewExtraKey('');
  }, [section, reset, meta]);

  const updateItemField = (itemIndex, field, value) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIndex
          ? { ...item, [field]: castFromInput(item[field], value) }
          : item
      )
    );
  };

  const addItem = () => {
    const template = items[0] || {};
    setItems((prev) => [...prev, buildEmptyFromTemplate(template)]);
  };

  const removeItem = (itemIndex) => {
    setItems((prev) => prev.filter((_, idx) => idx !== itemIndex));
  };

  const addFieldToItem = (itemIndex) => {
    const field = (newItemFieldByIndex[itemIndex] || '').trim();
    if (!field) return;

    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIndex) return item;
        if (Object.prototype.hasOwnProperty.call(item, field)) return item;
        return { ...item, [field]: '' };
      })
    );

    setNewItemFieldByIndex((prev) => ({ ...prev, [itemIndex]: '' }));
  };

  const removeFieldFromItem = (itemIndex, field) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIndex) return item;
        const next = { ...item };
        delete next[field];
        return next;
      })
    );
  };

  const addExtraField = () => {
    const key = newExtraKey.trim();
    if (!key) return;
    if (Object.prototype.hasOwnProperty.call(extraData, key)) return;
    setExtraData((prev) => ({ ...prev, [key]: '' }));
    setNewExtraKey('');
  };

  const onImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setValue('image', reader.result, { shouldDirty: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const onItemImageUpload = (itemIndex, field, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateItemField(itemIndex, field, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = (values) => {
    if (!section) return;

    const stats = values.stats
      ? values.stats.split(',').map((item) => {
          const [label, value] = item.split(':').map((piece) => piece?.trim());
          return { label: label || 'Metric', value: value || '-' };
        })
      : [];

    const nextData = {
      ...section.data,
      title: cleanText(values.title),
      subtitle: cleanText(values.subtitle),
      body: cleanText(values.body),
      image: cleanText(values.image),
      ctaPrimary: cleanText(values.ctaPrimary),
      ctaSecondary: cleanText(values.ctaSecondary),
      badges: values.badges ? parseCSV(values.badges) : [],
      values: values.values ? parseCSV(values.values) : [],
      timeline: values.timeline ? parseCSV(values.timeline) : [],
      stats,
      items,
      note: cleanText(values.note),
      ...extraData,
    };

    onSave(section.id, { name: values.name, data: nextData });

    if (section.kind === 'contact') {
      onMetaSave({ email: values.email, linkedin: values.linkedin, github: values.github });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {open && section && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/65 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={handleSubmit(submit)}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Edit Section: {section.name}</h3>
              <button type="button" onClick={onClose} className="rounded-lg border border-zinc-700 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-zinc-300 md:col-span-2">
                Name
                <input {...register('name')} className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2" disabled={readonly} />
                {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
              </label>

              {['title', 'subtitle', 'image', 'ctaPrimary', 'ctaSecondary', 'note', 'badges', 'values', 'timeline', 'stats'].map((field) => (
                <label key={field} className="text-sm text-zinc-300 md:col-span-2">
                  {field}
                  <input {...register(field)} className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2" disabled={readonly} />
                </label>
              ))}

              <label className="text-sm text-zinc-300 md:col-span-2">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={readonly}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm"
                />
                <span className="mt-1 block text-xs text-zinc-500">Uploads as base64 into the image field (no code needed).</span>
              </label>

              <label className="text-sm text-zinc-300 md:col-span-2">
                Body
                <textarea {...register('body')} rows={4} className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2" disabled={readonly} />
              </label>

              {section.kind === 'contact' && (
                <>
                  <label className="text-sm text-zinc-300 md:col-span-2">
                    Email
                    <input {...register('email')} className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2" disabled={readonly} />
                  </label>
                  <label className="text-sm text-zinc-300 md:col-span-2">
                    LinkedIn
                    <input {...register('linkedin')} className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2" disabled={readonly} />
                  </label>
                  <label className="text-sm text-zinc-300 md:col-span-2">
                    GitHub
                    <input {...register('github')} className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2" disabled={readonly} />
                  </label>
                </>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-black/20 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-zinc-200">Items Editor (No Code)</h4>
                <button type="button" onClick={addItem} disabled={readonly} className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs hover:border-brand-red disabled:opacity-40">
                  <Plus size={13} /> Add item
                </button>
              </div>

              {items.length === 0 && <p className="text-sm text-zinc-500">No items yet. Click "Add item".</p>}

              <div className="space-y-4">
                {items.map((item, itemIndex) => (
                  <div key={`${itemIndex}-${Object.keys(item).join('-')}`} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-zinc-200">Item #{itemIndex + 1}</p>
                      <button type="button" onClick={() => removeItem(itemIndex)} disabled={readonly} className="inline-flex items-center gap-1 rounded-lg border border-red-900/70 px-2 py-1 text-xs text-red-300 disabled:opacity-40">
                        <Trash2 size={12} /> Remove item
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(item).map(([field, value]) => {
                        const longText = ['summary', 'description', 'excerpt', 'quote', 'body', 'answer', 'note'].includes(field.toLowerCase());
                        const isImageField = field.toLowerCase() === 'image';
                        return (
                          <label key={`${itemIndex}-${field}`} className="text-xs uppercase tracking-[0.08em] text-zinc-400 md:col-span-1">
                            {field}
                            {longText ? (
                              <textarea
                                value={displayValue(value)}
                                onChange={(e) => updateItemField(itemIndex, field, e.target.value)}
                                rows={3}
                                disabled={readonly}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm normal-case tracking-normal text-zinc-100"
                              />
                            ) : (
                              <input
                                value={displayValue(value)}
                                onChange={(e) => updateItemField(itemIndex, field, e.target.value)}
                                disabled={readonly}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm normal-case tracking-normal text-zinc-100"
                              />
                            )}
                            {isImageField && (
                              <>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => onItemImageUpload(itemIndex, field, e)}
                                  disabled={readonly}
                                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-xs normal-case tracking-normal text-zinc-100"
                                />
                                <span className="mt-1 block text-[11px] normal-case tracking-normal text-zinc-500">
                                  Upload image file (saved as base64).
                                </span>
                              </>
                            )}
                            <button
                              type="button"
                              disabled={readonly}
                              onClick={() => removeFieldFromItem(itemIndex, field)}
                              className="mt-1 inline-flex items-center gap-1 text-[11px] text-red-400 disabled:opacity-40"
                            >
                              <Trash2 size={10} /> Remove field
                            </button>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        value={newItemFieldByIndex[itemIndex] || ''}
                        onChange={(e) => setNewItemFieldByIndex((prev) => ({ ...prev, [itemIndex]: e.target.value }))}
                        placeholder="new_field_name"
                        disabled={readonly}
                        className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => addFieldToItem(itemIndex)}
                        disabled={readonly}
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-xs hover:border-brand-red disabled:opacity-40"
                      >
                        Add field
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-black/20 p-4">
              <h4 className="mb-3 font-semibold text-zinc-200">Extra Data Fields</h4>
              <div className="space-y-3">
                {Object.entries(extraData).map(([key, value]) => (
                  <div key={key} className="grid gap-2 md:grid-cols-[1fr_auto]">
                    <input
                      value={String(value ?? '')}
                      onChange={(e) => setExtraData((prev) => ({ ...prev, [key]: e.target.value }))}
                      disabled={readonly}
                      className="rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      disabled={readonly}
                      onClick={() =>
                        setExtraData((prev) => {
                          const next = { ...prev };
                          delete next[key];
                          return next;
                        })
                      }
                      className="rounded-lg border border-red-900/70 px-3 py-2 text-xs text-red-300 disabled:opacity-40"
                    >
                      Remove "{key}"
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  value={newExtraKey}
                  onChange={(e) => setNewExtraKey(e.target.value)}
                  placeholder="new_data_key"
                  disabled={readonly}
                  className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm"
                />
                <button type="button" onClick={addExtraField} disabled={readonly} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs hover:border-brand-red disabled:opacity-40">
                  Add data key
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={readonly} className="rounded-xl bg-brand-red px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                Save changes
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
