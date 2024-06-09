import type { PlopTypes } from '@turbo/gen';
import { writeFileSync } from 'node:fs';

import { generator } from '../../utils';

export function createEnvironmentVariablesGenerator(
  plop: PlopTypes.NodePlopAPI,
) {
  const allVariables = generator.loadAllEnvironmentVariables('apps/web');

  if (allVariables) {
    console.log(
      `Loaded ${Object.values(allVariables).length} default environment variables in your env files. We use these as defaults.`,
    );
  }

  return plop.setGenerator('env', {
    description: 'Generate the environment variables to be used in the app',
    actions: [
      async (answers) => {
        let env = '';

        for (const [key, value] of Object.entries(
          (
            answers as {
              values: Record<string, string>;
            }
          ).values,
        )) {
          env += `${key}=${value}\n`;
        }

        writeFileSync('turbo/generators/templates/env/.env.local', env);

        return 'Environment variables generated at /turbo/generators/templates/env/.env.local.\nPlease double check and use this file in your hosting provider to set the environment variables. \nNever commit this file, it contains secrets!';
      },
    ],
    prompts: [
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_SITE_URL',
        message:
          'What is the site URL of you website? (Ex. https://makerkit.dev)',
        default: allVariables.NEXT_PUBLIC_SITE_URL,
      },
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_PRODUCT_NAME',
        message: 'What is the name of your product? (Ex. MakerKit)',
        default: allVariables.NEXT_PUBLIC_PRODUCT_NAME,
      },
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_SITE_TITLE',
        message:
          'What is the title of your website? (Ex. MakerKit - The best way to make things)',
        default: allVariables.NEXT_PUBLIC_SITE_TITLE,
      },
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_SITE_DESCRIPTION',
        message:
          'What is the description of your website? (Ex. MakerKit is the best way to make things and stuff)',
        default: allVariables.NEXT_PUBLIC_SITE_DESCRIPTION,
      },
      {
        type: 'list',
        name: 'values.NEXT_PUBLIC_DEFAULT_THEME_MODE',
        message: 'What is the default theme mode of your website?',
        choices: ['light', 'dark', 'system'],
        default: allVariables.NEXT_PUBLIC_DEFAULT_THEME_MODE ?? 'light',
      },
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_DEFAULT_LOCALE',
        message: 'What is the default locale of your website?',
        default: allVariables.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_AUTH_PASSWORD',
        message: 'Do you want to use email/password authentication?',
        default: getBoolean(allVariables.NEXT_PUBLIC_AUTH_PASSWORD, true),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_AUTH_MAGIC_LINK',
        message: 'Do you want to use magic link authentication?',
        default: getBoolean(allVariables.NEXT_PUBLIC_AUTH_MAGIC_LINK, false),
      },
      {
        type: 'input',
        name: 'values.CONTACT_EMAIL',
        message: 'What is the contact email you want to receive emails to?',
        default: allVariables.CONTACT_EMAIL,
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_THEME_TOGGLE',
        message: 'Do you want to enable the theme toggle?',
        default: getBoolean(allVariables.NEXT_PUBLIC_ENABLE_THEME_TOGGLE, true),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION',
        message: 'Do you want to enable personal account deletion?',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION,
          true,
        ),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING',
        message: 'Do you want to enable personal account billing?',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING,
          true,
        ),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS',
        message: 'Do you want to enable team accounts?',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS,
          true,
        ),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNT_DELETION',
        message: 'Do you want to enable team account deletion?',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNT_DELETION,
          true,
        ),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING',
        message: 'Do you want to enable team account billing?',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING,
          true,
        ),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION',
        message: 'Do you want to enable team account creation?',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION,
          true,
        ),
      },
      {
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_ENABLE_NOTIFICATIONS',
        message:
          'Do you want to enable notifications? If not - we will hide the notifications bell from the UI.',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
          true,
        ),
      },
      {
        when: (answers) => answers.values.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
        type: 'confirm',
        name: 'values.NEXT_PUBLIC_REALTIME_NOTIFICATIONS',
        message:
          'Do you want to enable realtime notifications? If yes, we will enable the realtime notifications from Supabase. If not - updated will be fetched lazily.',
        default: getBoolean(
          allVariables.NEXT_PUBLIC_REALTIME_NOTIFICATIONS,
          false,
        ),
      },
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_SUPABASE_URL',
        message: 'What is the Supabase URL? (Ex. https://yourapp.supabase.co)',
        default: allVariables.NEXT_PUBLIC_SUPABASE_URL,
      },
      {
        type: 'input',
        name: 'values.NEXT_PUBLIC_SUPABASE_ANON_KEY',
        message: 'What is the Supabase anon key?',
        default: allVariables.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      {
        type: 'input',
        name: 'values.SUPABASE_SERVICE_ROLE_KEY',
        message: 'What is the Supabase Service Role Key?',
      },
      {
        type: 'list',
        name: 'values.NEXT_PUBLIC_BILLING_PROVIDER',
        message: 'What is the billing provider you want to use?',
        choices: ['stripe', 'lemon-squeezy'],
        default: allVariables.NEXT_PUBLIC_BILLING_PROVIDER ?? 'stripe',
      },
      {
        when: (answers) =>
          answers.values.NEXT_PUBLIC_BILLING_PROVIDER === 'stripe',
        type: 'input',
        name: 'values.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        message: 'What is the Stripe publishable key?',
        default: allVariables.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      },
      {
        when: (answers) =>
          answers.values.NEXT_PUBLIC_BILLING_PROVIDER === 'stripe',
        type: 'input',
        name: 'values.STRIPE_SECRET_KEY',
        message: 'What is the Stripe secret key?',
      },
      {
        when: (answers) =>
          answers.values.NEXT_PUBLIC_BILLING_PROVIDER === 'stripe',
        type: 'input',
        name: 'values.STRIPE_WEBHOOK_SECRET',
        message: 'What is the Stripe webhook secret?',
      },
      {
        when: (answers) =>
          answers.values.NEXT_PUBLIC_BILLING_PROVIDER === 'lemon-squeezy',
        type: 'input',
        name: 'values.LEMON_SQUEEZY_SECRET_KEY',
        message: 'What is the Lemon Squeezy secret key?',
      },
      {
        when: (answers) =>
          answers.values.NEXT_PUBLIC_BILLING_PROVIDER === 'lemon-squeezy',
        type: 'input',
        name: 'values.LEMON_SQUEEZY_STORE_ID',
        message: 'What is the Lemon Squeezy store ID?',
        default: allVariables.LEMON_SQUEEZY_STORE_ID,
      },
      {
        when: (answers) =>
          answers.values.NEXT_PUBLIC_BILLING_PROVIDER === 'lemon-squeezy',
        type: 'input',
        name: 'values.LEMON_SQUEEZY_SIGNING_SECRET',
        message: 'What is the Lemon Squeezy signing secret?',
      },
      {
        type: 'input',
        name: 'values.SUPABASE_DB_WEBHOOK_SECRET',
        message: 'What is the Supabase DB webhook secret?',
      },
      {
        type: 'list',
        name: 'values.CMS_CLIENT',
        message: 'What is the CMS client you want to use?',
        choices: ['keystatic', 'wordpress'],
        default: allVariables.CMS_CLIENT ?? 'keystatic',
      },
      {
        type: 'list',
        name: 'values.MAILER_PROVIDER',
        message: 'What is the mailer provider you want to use?',
        choices: ['nodemailer', 'resend'],
        default: allVariables.MAILER_PROVIDER ?? 'nodemailer',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'resend',
        type: 'input',
        name: 'values.RESEND_API_KEY',
        message: 'What is the Resend API key?',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_SENDER',
        message: 'What is the email sender? (ex. info@makerkit.dev)',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_HOST',
        message: 'What is the email host?',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_PORT',
        message: 'What is the email port?',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_USER',
        message: 'What is the email username? (check your email provider)',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_PASSWORD',
        message: 'What is the email password? (check your email provider)',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'confirm',
        name: 'values.EMAIL_TLS',
        message: 'Do you want to enable TLS for your emails?',
        default: getBoolean(allVariables.EMAIL_TLS, true),
      },
      {
        type: 'confirm',
        name: 'captcha',
        message:
          'Do you want to enable Cloudflare Captcha protection for the Auth endpoints?',
      },
      {
        when: (answers) => answers.captcha,
        type: 'input',
        name: 'values.NEXT_PUBLIC_CAPTCHA_SITE_KEY',
        message:
          'What is the Cloudflare Captcha site key? NB: this is the PUBLIC key!',
      },
      {
        when: (answers) => answers.captcha,
        type: 'input',
        name: 'values.CAPTCHA_SECRET_TOKEN',
        message:
          'What is the Cloudflare Captcha secret key? NB: this is the PRIVATE key!',
      },
    ],
  });
}

function getBoolean(value: string | undefined, defaultValue: boolean) {
  return value === 'true' ? true : defaultValue;
}
