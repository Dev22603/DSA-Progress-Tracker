export default function GridBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}
