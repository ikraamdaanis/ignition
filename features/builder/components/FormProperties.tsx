import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "components/ui/form";
import { AttributeInput } from "features/builder/components/attributes/AttributeInput";
import { AttributeLabel } from "features/builder/components/attributes/AttributeLabel";
import { AttributeLabelTooltip } from "features/builder/components/attributes/AttributeLabelTooltip";
import {
  formSettings,
  useEditorStore
} from "features/builder/hooks/useEditorStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

const propertiesSchema = z.object({
  maxWidth: z.string().max(200),
  gap: z.string().max(200)
});

type PropertiesSchema = z.infer<typeof propertiesSchema>;

/**
 * Form to handle the properties of a form.
 */
export const FormProperties = () => {
  const { settings, updateSettings } = useEditorStore(
    useShallow(state => ({
      settings: state.settings,
      updateSettings: state.updateSettings
    }))
  );

  const values = {
    maxWidth: settings.maxWidth,
    gap: settings.gap
  };

  const form = useForm<PropertiesSchema>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: values,
    values
  });

  function applyChanges(values: PropertiesSchema) {
    updateSettings(prevSettings => ({ ...prevSettings, ...values }));
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
          name="maxWidth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-2 space-y-0 rounded-sm p-0">
                <AttributeLabelTooltip message="The max-width CSS property sets the maximum width of the form.">
                  <AttributeLabel>Max Width</AttributeLabel>
                </AttributeLabelTooltip>
                <FormControl>
                  <AttributeInput
                    {...field}
                    onBlur={({ target: { value } }) => {
                      if (!value.length) {
                        field.onChange(formSettings.maxWidth);
                      }
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gap"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-2 space-y-0 rounded-sm p-0">
                <AttributeLabelTooltip message="The gap CSS shorthand property sets the gaps between the elements.">
                  <AttributeLabel>Gap</AttributeLabel>
                </AttributeLabelTooltip>
                <FormControl>
                  <AttributeInput
                    {...field}
                    onBlur={({ target: { value } }) => {
                      if (!value.length) {
                        field.onChange(formSettings.gap);
                      }
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};