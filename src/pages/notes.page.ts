import type { Locator } from '@playwright/test';
import type { NoteCategory, NoteDraft } from '../data/notes';
import { BasePage } from './base.page';

function xpathLiteral(value: string): string {
  if (!value.includes("'")) {
    return `'${value}'`;
  }
  if (!value.includes('"')) {
    return `"${value}"`;
  }
  const parts = value.split("'").map((part) => `'${part}'`);
  return `concat(${parts.join(`, "'", `)})`;
}

export class NotesPage extends BasePage {
  get addNoteButton(): Locator {
    return this.page.getByTestId('add-new-note');
  }

  get logoutButton(): Locator {
    return this.page.getByTestId('logout');
  }

  get titleInput(): Locator {
    return this.page.getByTestId('note-title');
  }

  get descriptionInput(): Locator {
    return this.page.getByTestId('note-description');
  }

  get categorySelect(): Locator {
    return this.page.getByTestId('note-category');
  }

  get submitButton(): Locator {
    return this.page.getByTestId('note-submit');
  }

  get loader(): Locator {
    return this.page.getByTestId('loader');
  }

  get emptyState(): Locator {
    return this.page.getByTestId('no-notes-message');
  }

  get noteCards(): Locator {
    return this.page.getByTestId('note-card');
  }

  noteTitle(title: string): Locator {
    return this.page.getByTestId('note-card-title').filter({ hasText: title });
  }

  /**
   * The description sits in the card body that follows the title header.
   * Nothing associates that paragraph with the title: there is no label and
   * no aria-describedby, so getByRole and getByLabel cannot name it.
   * getByTestId('note-card-description') matches every card, and getByText
   * matches the description wherever else that string is rendered.
   * The title header and the body are siblings, so the following-sibling
   * axis is the relationship that identifies this note's description.
   */
  noteDescription(title: string): Locator {
    const titleText = xpathLiteral(title);
    return this.page.locator(
      `xpath=//div[@data-testid="note-card-title" and normalize-space()=${titleText}]/following-sibling::div[contains(@class,"card-body")]//*[@data-testid="note-card-description"]`,
    );
  }

  /**
   * The completed checkbox is rendered with a duplicated id="switch" and no
   * label, so getByLabel cannot target one note and getByRole('checkbox')
   * matches every card. getByTestId('toggle-note-switch') has the same
   * problem: the test id is repeated and is not the note title.
   * The checkbox only belongs to a title through the card that contains
   * that title header, which the ancestor axis expresses.
   */
  completionToggle(title: string): Locator {
    const titleText = xpathLiteral(title);
    return this.page.locator(
      `xpath=//div[@data-testid="note-card-title" and normalize-space()=${titleText}]/ancestor::div[@data-testid="note-card"]//input[@data-testid="toggle-note-switch"]`,
    );
  }

  async open(): Promise<void> {
    await this.goto('/notes/app/');
    await this.waitForApp(this.logoutButton.or(this.loader).first());
  }

  async waitForWorkspace(): Promise<void> {
    await this.addNoteButton.waitFor({ state: 'visible' });
    await this.loader.waitFor({ state: 'hidden' });
  }

  async filterBy(category: NoteCategory | 'All'): Promise<void> {
    await this.page.getByTestId(`category-${category.toLowerCase()}`).click();
  }

  async create(note: NoteDraft): Promise<void> {
    await this.addNoteButton.click();
    await this.titleInput.waitFor({ state: 'visible' });
    await this.categorySelect.selectOption(note.category);
    await this.titleInput.fill(note.title);
    await this.descriptionInput.fill(note.description);

    let failure = '';
    const created = this.page.waitForResponse(async (response) => {
      if (response.request().method() !== 'POST') {
        return false;
      }
      if (!/\/notes\/api\/notes\/?$/.test(new URL(response.url()).pathname)) {
        return false;
      }
      try {
        const body = (await response.json()) as { success?: boolean; message?: string };
        if (body.success !== true) {
          failure = body.message || `status ${response.status()}`;
        }
      } catch (error) {
        if (!response.ok()) {
          failure = error instanceof Error ? error.message : `status ${response.status()}`;
        }
      }
      return true;
    });

    await this.submitButton.click();
    await created;
    if (failure) {
      throw new Error(`Create note failed: ${failure}`);
    }

    await this.noteTitle(note.title).waitFor({ state: 'visible' });
    await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
    await this.noteTitle(note.title).waitFor({ state: 'visible' });
  }
}
