'use client'

import {
  LayoutDashboard,
  CalendarCheck,
  UserPlus,
  Users,
  Receipt,
  Settings,
  PawPrint,
} from 'lucide-react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

const navMain = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Projetos', url: '/admin/projects', icon: CalendarCheck },
  { title: 'Voluntários', url: '/admin/volunteers', icon: UserPlus },
  { title: 'Usuários', url: '/admin/users', icon: Users },
  { title: 'Notas Fiscais', url: '/admin/fiscal-notes', icon: Receipt },
  { title: 'Configurações', url: '/admin/settings', icon: Settings },
]

type AppSidebarProps = {
  user?: { name: string; email: string }
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/admin">
                <PawPrint className="size-5!" />
                <span className="text-base font-semibold">Ascesa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? { name: 'Admin', email: '' }} />
      </SidebarFooter>
    </Sidebar>
  )
}
