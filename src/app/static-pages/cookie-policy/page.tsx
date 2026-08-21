import { PageHeader } from "@/components/PageHeader";
import { CookiePolicyCMS } from "./components/CookiePolicyCMS";

export default function CookiePolicyCMSPage() {
  return (
    <section className="flex flex-col gap-6 max-w-6xl mx-auto pb-20">
      <PageHeader
        title="Cookie Policy Page Content"
        description="Manage the introductory messaging, cookie explanations, and company contact details displayed on the Cookie Policy page."
      />

      <CookiePolicyCMS />
    </section>
  );
}
