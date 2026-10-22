export type AccountKey = 'primary' | 'secondary';

export type Account = {
  key: AccountKey;
  name: string;
  email: string;
  password: string;
};

export const accounts = {
  primary: {
    key: 'primary',
    name: 'Veera Primary',
    email: 'veera.capstone.primary@example.com',
    password: 'NotesPrimary1',
  },
  secondary: {
    key: 'secondary',
    name: 'Veera Secondary',
    email: 'veera.capstone.secondary@example.com',
    password: 'NotesSecondary1',
  },
} as const satisfies Record<AccountKey, Account>;

export const accountList: Account[] = [accounts.primary, accounts.secondary];
