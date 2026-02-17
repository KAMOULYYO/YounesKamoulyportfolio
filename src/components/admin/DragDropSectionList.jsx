import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

function SortableRow({ section, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-zinc-800 bg-zinc-950/70">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2 text-xs text-zinc-500">
        <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical size={14} />
        </button>
        <span>Drag</span>
      </div>
      {children}
    </div>
  );
}

export default function DragDropSectionList({ sections, onReorder, renderSection }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(sections, oldIndex, newIndex);
    onReorder(active.id, over.id, reordered);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sections.map((section) => (
            <SortableRow key={section.id} section={section}>
              {renderSection(section)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
