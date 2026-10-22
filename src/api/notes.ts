import type { APIRequestContext } from '@playwright/test';
import { apiBaseURL } from '../config';

type NoteRecord = { id: string; title: string };

type NotesResponse = {
  success?: boolean;
  data?: NoteRecord[];
};

export async function deleteNote(
  request: APIRequestContext,
  token: string,
  id: string,
): Promise<void> {
  const response = await request.delete(`${apiBaseURL}/notes/${id}`, {
    headers: { 'x-auth-token': token },
  });
  if (response.ok() || response.status() === 404) {
    return;
  }
  throw new Error(`Delete note ${id} failed: ${response.status()} ${await response.text()}`);
}

export async function deleteNotesByTitle(
  request: APIRequestContext,
  token: string,
  title: string,
): Promise<void> {
  const response = await request.get(`${apiBaseURL}/notes`, {
    headers: { 'x-auth-token': token },
  });
  if (!response.ok()) {
    throw new Error(`List notes failed during cleanup: ${response.status()} ${await response.text()}`);
  }
  const body = (await response.json()) as NotesResponse;
  const matches = (body.data ?? []).filter((note) => note.title === title);
  for (const note of matches) {
    await deleteNote(request, token, note.id);
  }
}
