export default function LayoutMenuID({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-8">{children}</div>
    </>
  );
}
