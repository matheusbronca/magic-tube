import { Suspense } from "react";
import { FormSectionSkeleton } from "./form-section-skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { FormSectionSuspense } from "./form-section-suspense";

export interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
