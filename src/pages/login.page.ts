import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  get emailInput(): Locator {
    return this.page.getByTestId('login-email');
  }

  get passwordInput(): Locator {
    return this.page.getByTestId('login-password');
  }

  get submitButton(): Locator {
    return this.page.getByTestId('login-submit');
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Login', level: 1 });
  }

  get alert(): Locator {
    return this.page.getByTestId('alert-message');
  }

  async open(): Promise<void> {
    await this.goto('/notes/app/login');
    await this.waitForApp(this.emailInput);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
