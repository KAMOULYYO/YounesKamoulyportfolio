import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

const commands = [
  { id: 'sections', label: 'Go to Sections' },
  { id: 'settings', label: 'Go to Settings' },
  { id: 'history', label: 'Go to Version History' },
  { id: 'preview', label: 'Switch to Preview mode' },
  { id: 'publish', label: 'Publish current changes' },
  { id: 'home', label: 'Open public home' },
  { id: 'logout', label: 'Logout admin' },
];

export default function AdminCommandPalette({ open, onClose, onRun }) {
  const [query, setQuery] = useState('');

  const list = useMemo(
    () => commands.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/65 p-4 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-950 p-3"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3">
              <Search size={16} className="text-zinc-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command..."
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
            <div className="space-y-1">
              {list.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onRun(item.id);
                    onClose();
                    setQuery('');
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
