import { searchJournal } from "./journal-index.mjs";

function publicMatch(entry) {
  const { slug, title, description, category, href } = entry;
  return { slug, title, description, category, href };
}

export async function registerWebMCPTools({
  documentLike = globalThis.document,
  journalEntries,
  onSearch,
  onNavigate,
  onStartSignup,
}) {
  const modelContext = documentLike?.modelContext;
  if (!modelContext?.registerTool) {
    return () => {};
  }

  const lifecycle = new AbortController();
  const options = { signal: lifecycle.signal };

  await modelContext.registerTool(
    {
      name: "search_journal",
      description: "Filter visible Sage & Spur Ranch journal stories.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async ({ query }) => {
        const safeQuery = typeof query === "string" ? query : "";
        const matches = searchJournal(journalEntries, safeQuery);
        onSearch(safeQuery);
        return { matches: matches.map(publicMatch) };
      },
    },
    options,
  );

  await modelContext.registerTool(
    {
      name: "open_story",
      description: "Open a selected Sage & Spur Ranch journal story.",
      inputSchema: {
        type: "object",
        properties: { slug: { type: "string" } },
        required: ["slug"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async ({ slug }) => {
        const story = journalEntries.find((entry) => entry.slug === slug);
        if (!story) {
          return { opened: false, message: "Story not found." };
        }
        onNavigate(story.href);
        return { href: story.href, status: "navigated" };
      },
    },
    options,
  );

  await modelContext.registerTool(
    {
      name: "start_founding_signup",
      description: "Open and focus the visible Founding Community interest form.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async () => {
        onStartSignup();
        return { status: "ready" };
      },
    },
    options,
  );

  return () => lifecycle.abort();
}
