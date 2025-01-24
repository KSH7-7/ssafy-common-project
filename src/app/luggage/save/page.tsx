import LuggageSaveForm from "./LuggageSaveForm";

export default function LuggageSavePage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      <LuggageSaveForm />
      <a href="/" className="mt-4" style={{ color: '#969A9D' }}>
        처음으로
      </a>
    </div>
  );
}
