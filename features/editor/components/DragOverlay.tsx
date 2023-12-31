import {
  Active,
  DragOverlay as DragOverlayContainer,
  useDndMonitor
} from "@dnd-kit/core";
import { ElementWrapper } from "features/editor/components/ElementWrapper";
import { ElementDropperOverlay } from "features/editor/components/ElementDropper";
import { useEditorStore } from "features/editor/hooks/useEditorStore";
import { ElementsType, FormElements } from "features/editor/types";
import { useState } from "react";

/**
 * Overlay container that displays elements that are being dragged from the
 * sidebar or elements being re-ordered in the canvas.
 */
export const DragOverlay = () => {
  const [elements] = useEditorStore(state => [state.elements]);
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: event => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    }
  });

  if (!draggedItem) return null;

  let node = <div>No drag</div>;
  const isSidebarButton = draggedItem.data?.current?.isEditorButton;

  if (isSidebarButton) {
    const type = draggedItem.data.current?.type as ElementsType;
    node = <ElementDropperOverlay formElement={FormElements[type]} />;
  }

  const element = elements.find(element => element.id === draggedItem.id);

  if (element) {
    node = <ElementWrapper element={element} isOverlay />;
  }

  return <DragOverlayContainer>{node}</DragOverlayContainer>;
};
