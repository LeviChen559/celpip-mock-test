"use client";

import { Button } from "@/components/ui/button";

interface TestNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isLast?: boolean;
}

export default function TestNavigation({
  onPrevious,
  onNext,
  onSubmit,
  hasPrevious,
  hasNext,
  isLast,
}: TestNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPrevious}
      >
        Previous
      </Button>
      {isLast ? (
        <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700 text-white">
          Submit & Continue
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!hasNext}>
          Next
        </Button>
      )}
    </div>
  );
}
