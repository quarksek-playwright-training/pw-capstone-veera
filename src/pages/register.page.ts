import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  get nameInput(): Locator {
    return this.page.getByTestId('register-name');
  }

  get emailInput(): Locator {
    return this.page.getByTestId('register-email');
  }

  get passwordInput(): Locator {
    return this.page.getByTestId('register-password');
  }

  get confirmPasswordInput(): Locator {
    return this.page.getByTestId('register-confirm-password');
  }

  get submitButton(): Locator {
    return this.page.getByTestId('register-submit');
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Register', level: 1 });
  }

  get alert(): Locator {
    return this.page.getByTestId('alert-message');
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: 'Click here to Log In' });
  }

  async open(): Promise<void> {
    await this.goto('/notes/app/register');
    await this.waitForApp(this.emailInput);
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.nameInput.fill(name);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }
}
