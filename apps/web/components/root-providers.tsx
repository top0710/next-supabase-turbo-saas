'use client';

import dynamic from 'next/dynamic';

import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ThemeProvider } from 'next-themes';

import { CaptchaProvider } from '@kit/auth/captcha/client';
import { I18nProvider } from '@kit/i18n/provider';
import { MonitoringProvider } from '@kit/monitoring/components';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';

import appConfig from '~/config/app.config';
import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { i18nResolver } from '~/lib/i18n/i18n.resolver';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';

import { ReactQueryProvider } from './react-query-provider';

const captchaSiteKey = authConfig.captchaTokenSiteKey;

const CaptchaTokenSetter = dynamic(async () => {
  if (!captchaSiteKey) {
    return Promise.resolve(() => null);
  }

  const { CaptchaTokenSetter } = await import('@kit/auth/captcha/client');

  return {
    default: CaptchaTokenSetter,
  };
});

export function RootProviders({
  lang,
  theme = appConfig.theme,
  children,
}: React.PropsWithChildren<{
  lang: string;
  theme?: string;
}>) {
  const i18nSettings = getI18nSettings(lang);

  return (
    <MonitoringProvider>
      <ReactQueryProvider>
        <ReactQueryStreamedHydration>
          <I18nProvider settings={i18nSettings} resolver={i18nResolver}>
            <CaptchaProvider>
              <CaptchaTokenSetter siteKey={captchaSiteKey} />

              <AuthProvider>
                <ThemeProvider
                  attribute="class"
                  enableSystem
                  disableTransitionOnChange
                  defaultTheme={theme}
                  enableColorScheme={false}
                >
                  {children}
                </ThemeProvider>
              </AuthProvider>
            </CaptchaProvider>
          </I18nProvider>
        </ReactQueryStreamedHydration>
      </ReactQueryProvider>
    </MonitoringProvider>
  );
}

// we place this below React Query since it uses the QueryClient
function AuthProvider(props: React.PropsWithChildren) {
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
  });

  return props.children;
}
