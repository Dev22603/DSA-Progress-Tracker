export default function GridBackground() {
  return (
    <>
      {/* Grid Pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none grid-pattern" />

      {/* Gradient Background (Light Theme Only) */}
      <div className="fixed inset-0 -z-20 pointer-events-none light-gradient" />
    </>
  );
}
