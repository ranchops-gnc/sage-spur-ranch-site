export function buildJournalIndex(entries) {
  return entries
    .map((entry) => ({
      ...entry,
      href: `/journal/${entry.slug}/`,
      searchText: [entry.title, entry.description, entry.category]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(),
    }))
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    );
}

export function searchJournal(index, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return index;
  }

  return index.filter((entry) => entry.searchText.includes(normalizedQuery));
}
