import { Page, PageMobileNavigation, PageNavigation } from '@kit/ui/page';

import { AdminSidebar } from '~/admin/_components/admin-sidebar';
import { AdminMobileNavigation } from '~/admin/_components/mobile-navigation';

export const metadata = {
  title: `Super Admin`,
};

export default function AdminLayout(props: React.PropsWithChildren) {
  return (
    <Page style={'sidebar'}>
      <PageNavigation>
        <AdminSidebar />
      </PageNavigation>

      <PageMobileNavigation>
        <AdminMobileNavigation />
      </PageMobileNavigation>

      {props.children}
    </Page>
  );
}
