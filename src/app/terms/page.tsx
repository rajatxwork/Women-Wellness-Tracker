import { LegalLayout, LegalSection } from "@/components/legal-layout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="September 17, 2026">
      <p>
        By creating an account, you agree to these terms. Please also read the{" "}
        <a href="/privacy" className="font-semibold text-terracotta-deep">
          Privacy Policy
        </a>
        , which explains what we do with your data.
      </p>

      <LegalSection heading="Who can use Selene">
        <p>
          You must be at least 18 years old to create an account. By signing up,
          you confirm the information you provide is accurate and that you&apos;re
          creating the account for yourself.
        </p>
      </LegalSection>

      <LegalSection heading="Not medical advice">
        <p>
          Selene is a wellness journal, not a medical device or a substitute for
          professional healthcare. Cycle predictions, nutrition targets, and
          movement guidance are general and educational, based on published
          research and reference values, not a diagnosis or a personalized
          treatment plan. Always consult a doctor, registered dietitian, or other
          qualified professional for medical decisions, and before starting a new
          exercise or nutrition program, especially if you are pregnant,
          postpartum, or managing an existing condition.
        </p>
      </LegalSection>

      <LegalSection heading="Your account and your data">
        <p>
          You&apos;re responsible for keeping your login credentials secure. You own
          the data you log. We don&apos;t sell it or share it with third parties,
          see the Privacy Policy for the full detail on retention and deletion.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Use Selene for its intended purpose: tracking your own wellness. Don&apos;t
          try to access another user&apos;s account or data, interfere with the
          service, or use it in any way that violates applicable law.
        </p>
      </LegalSection>

      <LegalSection heading="No warranty">
        <p>
          Selene is provided as is, without warranties of any kind. We work to keep
          it accurate and available, but we can&apos;t guarantee it will be
          error-free, uninterrupted, or fit for a particular medical purpose.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Selene and its creators are not
          liable for indirect, incidental, or consequential damages arising from
          your use of the app. Nothing here limits liability where the law
          doesn&apos;t allow it to be limited.
        </p>
      </LegalSection>

      <LegalSection heading="Account deletion">
        <p>
          You can delete your account at any time from account settings. This
          immediately and permanently removes your data. We may also suspend or
          terminate an account that violates these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to these terms">
        <p>
          We may update these terms as the app evolves. Continuing to use Selene
          after a change means you accept the updated terms.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
