export default function GridBackground() {
  return (
    <>
      {/* Grid Pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none grid-pattern" />

      {/* Light Theme Gradient Background */}
      <div className="fixed inset-0 -z-20 pointer-events-none light-gradient" />

      {/* Dark Theme Solid Background */}
      <div className="fixed inset-0 -z-20 pointer-events-none dark-background" />
    </>
  );
}
