export default function DashboardShell({ children }: { children: React.ReactNode }) {
  // ✅ энд чинь өмнө layout дээр байсан Header/Sidebar/Shell бүгд яг хэвээрээ байна
  return (
    <>
      {children}
    </>
  );
}
