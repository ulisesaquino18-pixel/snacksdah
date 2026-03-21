export const metadata = {
  title: 'Snacks Depot® — Dashboard',
  description: 'Estado de Resultados & Business Intelligence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
