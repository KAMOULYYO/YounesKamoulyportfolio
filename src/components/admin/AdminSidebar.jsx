import { Settings, LayoutPanelLeft, History, Eye, LogOut } from 'lucide-react';

const items = [
  { key: 'sections', label: 'Sections Manager', icon: LayoutPanelLeft },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'history', label: 'Version History', icon: History },
];

export default function AdminSidebar({ active, onChange, onVisitSite, onLogout }) {
  return (
    <aside className="sticky top-4 h-[calc(100vh-2rem)] rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">YK Control</p>
        <h2 className="font-display text-xl font-bold">Admin</h2>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <button
            type="button"
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              active === item.key ? 'bg-brand-red text-white' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={onVisitSite}
          className="flex w-full items-center gap-2 rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:border-brand-red"
        >
          <Eye size={15} /> Open public site
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:border-red-500"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
