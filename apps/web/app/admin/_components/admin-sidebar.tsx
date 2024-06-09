import { redirect } from 'next/navigation';

import { Home, Users } from 'lucide-react';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerActionClient } from '@kit/supabase/server-actions-client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
} from '@kit/ui/sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';

export async function AdminSidebar() {
  const client = getSupabaseServerActionClient();
  const user = await requireUser(client);

  if (user.error) {
    redirect(user.redirectTo);
  }

  return (
    <Sidebar>
      <SidebarContent className={'py-4'}>
        <AppLogo href={'/admin'} />
      </SidebarContent>

      <SidebarContent className={'mt-5'}>
        <SidebarGroup label={'Admin'} collapsible={false}>
          <SidebarItem end path={'/admin'} Icon={<Home className={'h-4'} />}>
            Home
          </SidebarItem>

          <SidebarItem
            path={'/admin/accounts'}
            Icon={<Users className={'h-4'} />}
          >
            Accounts
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>

      <SidebarContent className={'absolute bottom-4'}>
        <ProfileAccountDropdownContainer user={user.data} collapsed={false} />
      </SidebarContent>
    </Sidebar>
  );
}
