import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ id, children, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-2 rounded-lg bg-[#26262a] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical size={16} className="text-[#a1a1aa]" />
      </div>
      
      {/* Widget Content */}
      <div className={sortableIsDragging ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};

export default SortableWidget;