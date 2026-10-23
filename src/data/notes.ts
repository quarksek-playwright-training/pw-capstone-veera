export const noteCategories = ['Home', 'Work', 'Personal'] as const;

export type NoteCategory = (typeof noteCategories)[number];

export type NoteDraft = {
  title: string;
  description: string;
  category: NoteCategory;
};

/** Single source for the data-driven category coverage scenario. */
export const notesByCategory: NoteDraft[] = [
  {
    category: 'Home',
    title: 'Home filter note',
    description: 'Stored with the home category',
  },
  {
    category: 'Work',
    title: 'Work filter note',
    description: 'Stored with the work category',
  },
  {
    category: 'Personal',
    title: 'Personal filter note',
    description: 'Stored with the personal category',
  },
];

export function uniqueNote(draft: NoteDraft): NoteDraft {
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    ...draft,
    title: `${draft.title} ${suffix}`,
  };
}
