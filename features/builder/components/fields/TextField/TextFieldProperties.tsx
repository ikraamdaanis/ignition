import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "components/ui/form";
import { Select, SelectContent, SelectValue } from "components/ui/select";
import { AttributeInput } from "features/builder/components/attributes/AttributeInput";
import { AttributeLabel } from "features/builder/components/attributes/AttributeLabel";
import { AttributeLabelTooltip } from "features/builder/components/attributes/AttributeLabelTooltip";
import { AttributeSelectItem } from "features/builder/components/attributes/AttributeSelectItem";
import { AttributeSelectTrigger } from "features/builder/components/attributes/AttributeSelectTrigger";
import { TextFieldElement } from "features/builder/components/fields/TextField/TextField";
import { useEditorStore } from "features/builder/hooks/useEditorStore";
import { useForm } from "react-hook-form";
import { z } from "zod";

const propertiesSchema = z.object({
  label: z.string().max(200),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50)
});

type PropertiesSchema = z.infer<typeof propertiesSchema>;

/**
 * Form to handle the properties of a text field.
 */
export const TextFieldProperties = () => {
  const [activeElement, updateElement] = useEditorStore(state => [
    state.activeElement,
    state.updateElement
  ]);
  const element = activeElement as TextFieldElement;

  const form = useForm<PropertiesSchema>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder
    },
    values: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder
    }
  });

  function applyChanges(values: PropertiesSchema) {
    updateElement(element.id, {
      ...element,
      extraAttributes: { ...values }
    });
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(applyChanges)}
        onSubmit={e => {
          e.preventDefault();
        }}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-2 space-y-0 rounded-sm p-0">
                <AttributeLabelTooltip message="The label of the field. It will be displayed above the field">
                  <AttributeLabel>Label</AttributeLabel>
                </AttributeLabelTooltip>
                <FormControl>
                  <AttributeInput {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 rounded-sm p-0">
              <AttributeLabelTooltip message="The placeholder is the text in the input that will be displayed if the user hasn't typed anything.">
                <AttributeLabel>Placeholder</AttributeLabel>
              </AttributeLabelTooltip>
              <FormControl>
                <AttributeInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 rounded-sm p-0">
              <AttributeLabelTooltip message="Any helpful text for the user that will be below the text field.">
                <AttributeLabel>Helper Text</AttributeLabel>
              </AttributeLabelTooltip>
              <FormControl>
                <AttributeInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 rounded-sm p-0">
              <AttributeLabelTooltip message="Choose whether this text field should be required or not.">
                <AttributeLabel>Required</AttributeLabel>
              </AttributeLabelTooltip>
              <Select
                onValueChange={value => {
                  const isTrue = value === "true";
                  return field.onChange(isTrue);
                }}
                value={String(field.value)}
              >
                <FormControl>
                  <AttributeSelectTrigger>
                    <SelectValue
                      onChange={({ target }) => {
                        const isTrue =
                          (target as HTMLSelectElement).value === "true";
                        console.log(isTrue);

                        field.onChange(isTrue);
                      }}
                    />
                  </AttributeSelectTrigger>
                </FormControl>
                <SelectContent className="selector dark:bg-zinc-800">
                  <AttributeSelectItem value="true">Yes</AttributeSelectItem>
                  <AttributeSelectItem value="false">No</AttributeSelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};