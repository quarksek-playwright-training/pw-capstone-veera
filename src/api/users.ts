import type { APIRequestContext } from '@playwright/test';
import { apiBaseURL } from '../config';
import type { Account } from '../data/accounts';

type ApiBody = {
  success?: boolean;
  message?: string;
  data?: { token?: string; id?: string; title?: string };
};

async function readBody(response: { json: () => Promise<unknown>; text: () => Promise<string> }): Promise<ApiBody> {
  try {
    return (await response.json()) as ApiBody;
  } catch {
    return { message: await response.text() };
  }
}

export async function ensureAccount(request: APIRequestContext, account: Account): Promise<void> {
  const response = await request.post(`${apiBaseURL}/users/register`, {
    data: {
      name: account.name,
      email: account.email,
      password: account.password,
    },
  });

  if (response.status() === 201 || response.status() === 409) {
    return;
  }

  throw new Error(
    `Could not ensure ${account.email}: ${response.status()} ${await response.text()}`,
  );
}

export async function loginAccount(request: APIRequestContext, account: Account): Promise<string> {
  const response = await request.post(`${apiBaseURL}/users/login`, {
    data: {
      email: account.email,
      password: account.password,
    },
  });
  const body = await readBody(response);
  const token = body.data?.token;
  if (!response.ok() || !token) {
    throw new Error(`Login failed for ${account.email}: ${response.status()} ${JSON.stringify(body)}`);
  }
  return token;
}
