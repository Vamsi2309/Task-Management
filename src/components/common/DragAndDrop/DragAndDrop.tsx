import React, { useState, useCallback, useRef } from 'react';

interface DragAndDropListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  onReorder: (fromIndex: number, toIndex: number) => void;
  className?: string;
  grid?: boolean;
}

export function DragAndDropList<T>({
  items,
  keyExtractor,
  renderItem,
  onReorder,
  className = '',
  grid = false,
}: DragAndDropListProps<T>) {

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      dragIndexRef.current = index;
      setDragIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = '0.4';
      }
    },
    []
  );

  const handleDragOver = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setOverIndex(index);
    },
    []
  );

  const handleDrop = useCallback(
    (toIndex: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex !== null && fromIndex !== toIndex) {
        onReorder(fromIndex, toIndex);
      }

      dragIndexRef.current = null;
      setDragIndex(null);
      setOverIndex(null);
    },
    [onReorder]
  );


  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }

    dragIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }, []);


  const handleDragLeave = useCallback(() => {
    setOverIndex(null);
  }, []);

  return (
    <div
      className={`${grid ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2'} ${className}`}
      role="list"
      aria-label="Reorderable list"
    >
      {items.map((item, index) => {
        const key = keyExtractor(item);
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== index;

        return (
          <div
            key={key}
            role="listitem"
            aria-roledescription="Draggable item"
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDrop={handleDrop(index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            className={`
              transition-all duration-200 select-none
              ${isDragging ? 'opacity-40 scale-[0.98]' : ''}
              ${isOver ? 'ring-2 ring-brand-400 ring-offset-2 dark:ring-offset-gray-900 rounded-xl' : ''}
            `}
          >
            {renderItem(item, index, isDragging)}
          </div>
        );
      })}
    </div>
  );
}
