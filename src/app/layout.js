import "./globals.css";

export const metadata = {
  title: "MTRO",
  description: "Train tracking with city filtering and map view."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
