import { HeadingElement } from "features/editor/components/fields/Heading";
import { SubmitButtonElement } from "features/editor/components/fields/SubmitButton";
import { TextFieldElement } from "features/editor/components/fields/TextField";
import { ReactNode } from "react";

export type ElementsType = "TextField" | "Heading" | "SubmitButton";
// | "TitleField"
// | "SubTitleField"
// | "ParagraphField"
// | "SeparatorField"
// | "SpacerField"
// | "NumberField"
// | "TextAreaField"
// | "DateField"
// | "SelectField"
// | "CheckboxField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementsType;
  construct: (id: string, alias: string) => FormElementInstance;
  designerButton: {
    icon: ReactNode;
    label: string;
  };
  editorComponent: (props: {
    element: FormElementInstance;
    isOverlay?: boolean;
  }) => JSX.Element;
  formComponent: (props: { element: FormElementInstance }) => JSX.Element;
  propertiesComponent: () => JSX.Element;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldElement,
  Heading: HeadingElement,
  SubmitButton: SubmitButtonElement
};

export type FormElementInstance<T = Record<string, any>> = {
  id: string;
  alias: string;
  type: ElementsType;
  extraAttributes: T;
};

export const fontWeights = ["300", "400", "500", "600", "700"] as const;
export type FontWeights = typeof fontWeights;
export type FontWeight = (typeof fontWeights)[number];

export const alignSelf = ["start", "center", "end"] as const;
export type AlignSelfs = typeof alignSelf;
export type AlignSelf = (typeof alignSelf)[number];
