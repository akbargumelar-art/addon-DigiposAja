import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title:"Agrabudi Digipos Portal", description:"Portal multi-account Digipos dalam MOCK MODE" };
export default function RootLayout({children}:{children:ReactNode}){ return <html lang="id"><body>{children}</body></html>; }
