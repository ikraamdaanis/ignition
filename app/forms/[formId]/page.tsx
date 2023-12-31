import { fetchPublicForm } from "features/forms/actions/fetchPublicForm";
import { PublishedForm } from "features/forms/components/PublishedForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: {
    formId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await fetchPublicForm(params.formId);

  return {
    title: form?.name || "Form"
  };
}

// We want this page to refresh it's data on every request.
export const dynamic = "force-dynamic";

/**
 * Page for the published form. Fetches the public version of the form model
 * and displays it for the users to fill in and submit.
 */
const FormPage = async ({ params }: Props) => {
  const form = await fetchPublicForm(params.formId);

  if (!form) {
    return redirect("/not-found");
  }

  return <PublishedForm form={form} />;
};

export default FormPage;
