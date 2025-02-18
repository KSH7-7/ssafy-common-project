"use client"
import LuggagePickupForm from "./LuggagePickupForm";
import { Suspense } from 'react';

export default function LuggageSavePage() {
  return (
    <div className="w-full min-h-[calc(95vh-4rem)] flex flex-col items-center justify-start mt-2 p-8">
        <Suspense fallback={<div>Loading...</div>}>
            <LuggagePickupForm />
        </Suspense>
    </div>
  );
}
