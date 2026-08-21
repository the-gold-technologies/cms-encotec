import { PageHeader } from "@/components/PageHeader";
import { PrivacyPolicyCMS } from "./components/PrivacyPolicyCMS";

export default function PrivacyPolicyCMSPage() {
  return (
    <section className="flex flex-col gap-6 max-w-6xl mx-auto pb-20">
      <PageHeader
        title="Privacy Policy Page Content"
        description="Manage the legal declarations, responsible data controller info, DPO contacts, and whistleblower addresses displayed on the Privacy Policy page."
      />

      <PrivacyPolicyCMS />
    </section>
  );
}
