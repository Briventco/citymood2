import { Search } from "lucide-react";
import { site } from "@/config/site";

// Plain GET form, so search works without JavaScript.
export function SearchForm({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form role="search" action={site.searchPath} method="get" className={`flex ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search CityMood
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search stories"
        className="h-[46px] min-w-0 flex-1 bg-cm-white px-3.5 text-base text-cm-black placeholder:text-cm-meta"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-[46px] w-[50px] flex-none cursor-pointer items-center justify-center bg-cm-lime text-cm-black"
      >
        <Search aria-hidden="true" size={20} strokeWidth={2.4} />
      </button>
    </form>
  );
}
