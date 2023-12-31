"use client";

import { DragEndEvent, DragOverEvent, MeasuringStrategy } from "@dnd-kit/core";
import { SortableData, arrayMove } from "@dnd-kit/sortable";
import { Content, Form } from "database/schema";
import { EditorCanvas } from "features/editor/components/EditorCanvas";
import { SortableContainer } from "features/editor/components/SortableContainer";
import {
  formSettings,
  useEditorStore
} from "features/editor/hooks/useEditorStore";
import { ElementsType, FormElements } from "features/editor/types";
import { generateElementName } from "features/editor/utils/generateElementName";
import { useEffect, useId } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  form: Form;
};

const SPACER_ID = "spacer";

/**
 * The `FormEditor` component is a higher-level container that orchestrates the
 * form-building process, integrating with the @dnd-kit library to handle
 * drag-and-drop interactions for form elements. It utilizes the `EditorCanvas`
 * component for the main form editor interface and `SortableContainer`
 * for managing the sortable behavior of form elements.
 */
export const FormEditor = ({ form }: Props) => {
  const {
    elements,
    setElements,
    addElement,
    removeElement,
    updateSettings,
    hasLoaded,
    setHasLoaded
  } = useEditorStore(
    useShallow(state => ({
      elements: state.elements,
      setElements: state.setElements,
      addElement: state.addElement,
      removeElement: state.removeElement,
      updateSettings: state.updateSettings,
      hasLoaded: state.hasLoaded,
      setHasLoaded: state.setHasLoaded
    }))
  );

  useEffect(() => {
    if (form?.content && !elements?.length && !hasLoaded) {
      const content: Content = JSON.parse(form.content || "") || {
        elements: [],
        settings: formSettings
      };

      content?.elements?.length && setElements(content.elements);
      content?.settings && updateSettings(content.settings);
      setHasLoaded(true);
    }
  }, [
    elements?.length,
    form,
    hasLoaded,
    setElements,
    setHasLoaded,
    updateSettings
  ]);

  function onDragStart() {}

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) return;

    const activeElement = active.data.current;

    const isSortableElement = !!activeElement?.sortable;
    const isEditorButton = !!activeElement?.isEditorButton;

    const overSortable = over.data.current
      ?.sortable as SortableData["sortable"];
    const overCanvas = over.id === "editor-drop-area";

    if (isEditorButton) {
      const type = active.data?.current?.type as ElementsType;
      const newElement = FormElements[type].construct(SPACER_ID, SPACER_ID);

      // If an element is being dropped in and is hovering another element, insert
      // it at the same index.
      if (overSortable) {
        const nextIndex =
          overSortable.index > -1 ? overSortable.index : elements.length;

        removeElement(SPACER_ID);
        return addElement(nextIndex, newElement);
      }

      // If an element is being dropped in and isn't above an existing element,
      // put it right at the bottom.
      if (overCanvas) {
        const nextIndex = elements?.length;

        removeElement(SPACER_ID);
        return addElement(nextIndex, newElement);
      }
    }

    // If an element is being re-ordered but it's not over any other element,
    // put it right at the bottom.
    if (isSortableElement && overCanvas) {
      const activeIndex = elements.findIndex(
        element => element.id === active.id
      );

      const newArray = arrayMove([...elements], activeIndex, elements?.length);

      setElements(newArray);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    removeElement(SPACER_ID);

    const { active, over } = event;

    if (!active || !over || active.id === over.id) return;

    const activeElement = active.data.current;
    const isEditorButton = activeElement?.isEditorButton;
    const isSortable = activeElement?.sortable;

    if (isEditorButton) {
      const type = active.data?.current?.type as ElementsType;

      const newElement = FormElements[type].construct(
        crypto.randomUUID(),
        generateElementName(elements, type)
      );

      const spaceElementIndex = elements.findIndex(
        element => element.id === SPACER_ID
      );

      if (spaceElementIndex > -1) {
        const updatedElements = [...elements];
        updatedElements[spaceElementIndex] = newElement;

        return setElements(updatedElements);
      }

      return addElement(spaceElementIndex, newElement);
    }

    if (isSortable) {
      const oldIndex = elements.findIndex(element => element.id === active.id);
      const newIndex = elements.findIndex(element => element.id === over.id);
      setElements(arrayMove(elements, oldIndex, newIndex));
    }
  }

  function onDragCancel() {
    setElements(elements.filter(element => !element.id.includes(SPACER_ID)));
  }

  return (
    <SortableContainer
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
      id={useId()}
    >
      <EditorCanvas form={form} />
    </SortableContainer>
  );
};
