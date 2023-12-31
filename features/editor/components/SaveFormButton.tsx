import { Button } from "components/ui/button";
import { Content, FormUpdateSchema } from "database/schema";
import { updateForm } from "features/forms/actions/updateForm";
import { useEditorStore } from "features/editor/hooks/useEditorStore";
import { SaveIcon } from "lucide-react";
import { useTransition } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  formId: string;
};

/**
 * Button to save a form to the database.
 */
export const SaveFormButton = ({ formId }: Props) => {
  const [loading, startTransition] = useTransition();
  const { elements, settings } = useEditorStore(
    useShallow(state => ({
      elements: state.elements,
      settings: state.settings
    }))
  );

  async function handleFormButton() {
    /**
     * Gets all of the field names for the element. These field names will
     * be displayed in the submissions table.
     */
    const formFields = elements.reduce((fields: string[], element) => {
      const field = element.extraAttributes?.fieldName as string;

      if (field && !fields.includes(field)) {
        fields.push(field);
      }

      return fields;
    }, []);

    const content: Content = {
      elements,
      settings,
      formFields
    };

    try {
      const data: FormUpdateSchema = {
        id: formId,
        content: JSON.stringify(content),
        updatedAt: new Date()
      };

      await updateForm(data);
    } catch (error) {
      console.error("Error updating the form: ", error);
    }
  }

  return (
    <Button
      variant="outline"
      className="h-8 gap-2 px-2 text-xs font-semibold transition hover:brightness-90 dark:border-0 dark:bg-zinc-700"
      disabled={loading}
      onClick={() => startTransition(handleFormButton)}
    >
      <SaveIcon className="h-4 w-4" />
      Save
    </Button>
  );
};
