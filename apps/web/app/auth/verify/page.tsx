import { redirect } from 'next/navigation';

import { MultiFactorChallengeContainer } from '@kit/auth/mfa';
import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerComponentClient } from '@kit/supabase/server-component-client';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

interface Props {
  searchParams: {
    next?: string;
  };
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();

  return {
    title: i18n.t('auth:signIn'),
  };
};

async function VerifyPage(props: Props) {
  const client = getSupabaseServerComponentClient();
  const needsMfa = await checkRequiresMultiFactorAuthentication(client);

  if (!needsMfa) {
    redirect(pathsConfig.auth.signIn);
  }

  const redirectPath = props.searchParams.next ?? pathsConfig.app.home;
  const auth = await requireUser(client);

  if (auth.error) {
    redirect(auth.redirectTo);
  }

  return (
    <MultiFactorChallengeContainer
      userId={auth.data.id}
      paths={{
        redirectPath,
      }}
    />
  );
}

export default withI18n(VerifyPage);
