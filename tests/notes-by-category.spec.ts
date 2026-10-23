import { expect, test } from '../src/fixtures/test';
import { notesByCategory, uniqueNote } from '../src/data/notes';
import { NotesPage } from '../src/pages/notes.page';

test(
  'notes from one data source appear under their own category filters',
  { tag: ['@regression', '@notes'] },
  async ({ primaryPage, createdNotes }) => {
    const notes = notesByCategory.map((draft) => uniqueNote(draft));
    const notesPage = new NotesPage(primaryPage);
    await notesPage.open();

    for (const note of notes) {
      createdNotes.push({ account: 'primary', title: note.title });
      await notesPage.create(note);
    }

    for (const note of notes) {
      await notesPage.filterBy(note.category);
      await expect(notesPage.noteTitle(note.title)).toBeVisible();
      await expect(notesPage.noteDescription(note.title)).toHaveText(note.description);
      for (const other of notes) {
        if (other.category !== note.category) {
          await expect(notesPage.noteTitle(other.title)).toHaveCount(0);
        }
      }
    }
  },
);
