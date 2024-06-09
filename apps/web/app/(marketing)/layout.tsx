import { getSupabaseServerComponentClient } from '@kit/supabase/server-component-client';

import { SiteFooter } from '~/(marketing)/_components/site-footer';
import { SiteHeader } from '~/(marketing)/_components/site-header';
import { withI18n } from '~/lib/i18n/with-i18n';

async function SiteLayout(props: React.PropsWithChildren) {
  const client = getSupabaseServerComponentClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <SiteHeader user={user} />

      {props.children}

      <SiteFooter />
    </div>
  );
}

export default withI18n(SiteLayout);
