import DashboardShell from '../(dashboard)/DashboardShell';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
