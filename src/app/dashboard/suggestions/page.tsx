// src/app/dashboard/suggestions/page.tsx
"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SuggestionsForm, type SuggestionsFormData } from "./components/SuggestionsForm";
import { SuggestionsDisplay } from "./components/SuggestionsDisplay";
import { getSuggestedActivitiesAction } from "./actions";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import type { SuggestActivitiesOutput } from "@/ai/flows/suggest-activities";
import { Lightbulb } from "lucide-react";

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestActivitiesOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleFormSubmit = async (data: SuggestionsFormData) => {
    setIsLoading(true);
    setError(undefined);
    setSuggestions(undefined);

    try {
      const result = await getSuggestedActivitiesAction(data);
      if (result.success && result.data) {
        setSuggestions(result.data);
        toast({
          title: "Suggestions Generated!",
          description: "AI has provided new activity ideas.",
        });
      } else {
        setError(result.error || "An unknown error occurred.");
        toast({
          title: "Error Generating Suggestions",
          description: result.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title="AI Activity Suggestions"
        description="Leverage AI to discover new and engaging activity ideas for your groups."
        icon={Lightbulb}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <SuggestionsForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="lg:sticky lg:top-24"> {/* Make display sticky on larger screens */}
          <SuggestionsDisplay suggestions={suggestions} error={error} />
        </div>
      </div>
    </RoleBasedGuard>
  );
}
