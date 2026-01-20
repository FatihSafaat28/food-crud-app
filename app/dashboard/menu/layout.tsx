export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-4 lg:p-6">{children}</div>
    </>
  );
}
