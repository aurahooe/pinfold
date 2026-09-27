"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [mode, setMode] = useState("in");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setErr(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setErr(error.message);
      if (data.user) {
        const slug =
          (handle || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24) ||
          "hand";
        await supabase.from("pinfold_profiles").insert({
          id: data.user.id,
          handle: slug + Math.floor(Math.random() * 90 + 10),
          display_name: handle || slug,
        });
      }
    }
    router.push("/desk");
    router.refresh();
  }

  return (
    <main>
      <section className="hero">
        <h1>{mode === "in" ? "Come in." : "Take a desk."}</h1>
        <p>Email and a password. Your slips save to your account. Public ones appear on the wall.</p>
      </section>
      <form className="panel" onSubmit={onSubmit}>
        {mode === "up" && (
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="How you are called" />
        )}
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {err && <p className="err">{err}</p>}
        <button type="submit">{mode === "in" ? "Enter" : "Open a desk"}</button>
        <button type="button" className="ghost" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Need a desk?" : "Already have one?"}
        </button>
      </form>
    </main>
  );
}
