import { expect, test } from '../src/fixtures/test';
import { uniqueNote } from '../src/data/notes';
import { NotesPage } from '../src/pages/notes.page';

test(
  'a created note is saved and shows under its own category',
  { tag: ['@smoke', '@notes'] },
  async ({ primaryPage, createdNotes }) => {
    const note = uniqueNote({
      title: 'Grocery list',
      description: 'Milk, bread, and coffee',
      category: 'Work',
    });
    createdNotes.push({ account: 'primary', title: note.title });

    const notesPage = new NotesPage(primaryPage);
    await notesPage.open();
    await notesPage.create(note);

    await notesPage.filterBy('Work');
    await expect(notesPage.noteTitle(note.title)).toBeVisible();
    await expect(notesPage.noteDescription(note.title)).toHaveText(note.description);
    await expect(notesPage.completionToggle(note.title)).not.toBeChecked();

    await notesPage.filterBy('Home');
    await expect(notesPage.noteTitle(note.title)).toHaveCount(0);
  },
);
