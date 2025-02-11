"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search as SearchIcon,
  Film,
  History,
  Sparkles,
  Star,
  FilmIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { ModeToggle } from "@/components/toggletheme";

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (currentQuery: string) => {
    if (currentQuery.trim()) {
      setOpen(false);
      const newSearches = [
        currentQuery.trim(),
        ...recentSearches.filter((s) => s !== currentQuery.trim()),
      ].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newSearches));
      router.push(`/search?query=${encodeURIComponent(currentQuery.trim())}`);
    }
  };

  return (
    <div className="w-full flex items-center space-x-2">
      <Link href="/" className="flex items-center gap-2 cursor-pointer group">
        <FilmIcon className="w-6 h-6 text-yellow-400" />
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-transparent bg-clip-text bg-size-200 animate-gradient-slow hover:scale-105 transition-transform duration-200">
          IMDb
        </span>
      </Link>
      <Button
        variant="outline"
        className={cn(
          "relative h-10 w-full justify-start rounded-lg border bg-background px-4 text-sm font-normal text-muted-foreground shadow-sm transition-colors hover:bg-accent sm:pr-12",
          "dark:bg-muted dark:hover:bg-muted/80"
        )}
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        Search movies...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <ModeToggle />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="overflow-hidden rounded-xl border shadow-2xl">
          <DialogTitle asChild>
            <VisuallyHidden>Search movies</VisuallyHidden>
          </DialogTitle>
          <div className="flex border-b">
            <CommandInput
              placeholder="Search movies..."
              value={query}
              onValueChange={setQuery}
              className="border-0 focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(query);
                }
              }}
            />
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty className="py-6 text-center text-sm">
              <Film className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No movies found</h3>
              <p className="text-muted-foreground">
                Try searching for something else
              </p>
            </CommandEmpty>

            {query === "" && recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches" className="mb-2">
                {recentSearches.map((search) => (
                  <CommandItem
                    key={search}
                    onSelect={() => handleSearch(search)}
                    className="flex items-center px-4 py-2"
                  >
                    <History className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandGroup heading="Popular" className="mb-2">
              <CommandItem
                onSelect={() => handleSearch("Top Gun: Maverick")}
                className="flex items-center px-4 py-2"
              >
                <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                Top Gun: Maverick
              </CommandItem>
              <CommandItem
                onSelect={() => handleSearch("Oppenheimer")}
                className="flex items-center px-4 py-2"
              >
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Oppenheimer
              </CommandItem>
            </CommandGroup>

            {query && (
              <CommandGroup heading="Search Results">
                <CommandItem
                  onSelect={() => handleSearch(query)}
                  className="flex items-center px-4 py-2"
                >
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Search for "{query}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </div>
  );
}
