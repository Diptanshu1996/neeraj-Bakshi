export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-300/30 border-t-amber-400" />
        <p className="text-sm font-semibold tracking-wide text-amber-100">Loading...</p>
      </div>
    </div>
  );
}
