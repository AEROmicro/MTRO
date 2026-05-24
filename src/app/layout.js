import "./globals.css";

export const metadata = {
  title: "MTRO",
  description: "Transit tracking with city filtering and map view.",
  icons: {
    icon: "/MTRO_FAV.png",
    shortcut: "/MTRO_FAV.png",
    apple: "/MTRO_FAV.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
