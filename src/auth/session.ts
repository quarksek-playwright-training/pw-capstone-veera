import fs from 'fs';
import path from 'path';
import type { AccountKey } from '../data/accounts';
import { appOrigin } from '../config';

export function authFile(account: AccountKey): string {
  return path.join(process.cwd(), '.auth', `${account}.json`);
}

export function storageStateFor(token: string) {
  return {
    cookies: [],
    origins: [
      {
        origin: appOrigin,
        localStorage: [{ name: 'token', value: token }],
      },
    ],
  };
}

export async function writeSession(account: AccountKey, token: string): Promise<void> {
  const file = authFile(account);
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, JSON.stringify(storageStateFor(token), null, 2));
}

export function readToken(account: AccountKey): string {
  const state = JSON.parse(fs.readFileSync(authFile(account), 'utf8')) as {
    origins: { origin: string; localStorage: { name: string; value: string }[] }[];
  };
  const origin = state.origins.find((entry) => entry.origin === appOrigin);
  const token = origin?.localStorage.find((entry) => entry.name === 'token')?.value;
  if (!token) {
    throw new Error(`Saved session for ${account} has no token`);
  }
  return token;
}
