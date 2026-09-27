import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Pinfold",
  description: "A public wall that turns with the hour.",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <nav>
          <Link className="mark" href="/">Pinfold</Link>
          <div>
            <Link href="/">Wall</Link>
            {user ? <Link href="/desk">Desk</Link> : <Link href="/login">Enter</Link>}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
