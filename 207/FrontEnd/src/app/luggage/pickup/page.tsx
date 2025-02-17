import { Suspense } from "react";
import LuggagePickupForm from "./LuggagePickupForm";

export default function LuggageSavePage() {
  return (
    <div className="container mx-auto mt-2 p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <LuggagePickupForm />
      </Suspense>
    </div>
  );
}
