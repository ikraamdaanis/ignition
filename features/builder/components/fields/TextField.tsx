"use client";

import { useDndMonitor } from "@dnd-kit/core";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { ElementsType, FormElement, FormElementInstance } from "features/types";
import { Text } from "lucide-react";
import { useState } from "react";
import { cn } from "utils/cn";

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Text field",
  helperText: "Helper Text",
  required: false,
  placeholder: "Value here...."
};

export const TextFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerComponent: EditorComponent,
  formComponent: () => <div>Form</div>,
  propertiesComponent: () => <div>Properties</div>,
  designerButton: {
    icon: <Text className="h-5 w-5 cursor-grab text-primary" />,
    label: "Text Field"
  }
};

type CustomFormElementInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export function EditorComponent({ element }: { element: FormElementInstance }) {
  const elementInstance = element as CustomFormElementInstance;
  const { label, required, placeholder, helperText } =
    elementInstance.extraAttributes;

  const [isDragging, setIsDragging] = useState(false);

  useDndMonitor({
    onDragStart: event => {
      setIsDragging(event.active.id === element.id);
    },
    onDragEnd: () => {
      setIsDragging(false);
    }
  });

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-sm border border-transparent bg-zinc-50 hover:border-blue-300 dark:bg-zinc-900",
        isDragging && "opacity-0"
      )}
    >
      <Label>
        {element.id.slice(0, 6)}
        {label}
        {required && "*"}
      </Label>
      <Input
        readOnly
        placeholder={placeholder}
        className="pointer-events-none cursor-default"
      />
      {helperText && (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
