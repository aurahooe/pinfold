"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeskClient({ profile, slips }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");

  async function publish(e) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.from("pinfold_slips").insert({
      author_id: profile.id,
      title,
      body,
      is_public: isPublic,
    });
    if (error) return setErr(error.message);
    setTitle("");
    setBody("");
    setIsPublic(false);
    router.refresh();
  }

  async function toggle(slip) {
    await supabase.from("pinfold_slips").update({ is_public: !slip.is_public }).eq("id", slip.id);
    router.refresh();
  }

  async function remove(id) {
    await supabase.from("pinfold_slips").delete().eq("id", id);
    router.refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main>
      <section className="hero">
        <h1>Desk for {profile.display_name}.</h1>
        <p>Write here. Mark a slip public and it shows on the wall. Leave it private and it stays with you.</p>
      </section>
      <form className="panel" onSubmit={publish}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, if you want one" />
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="The slip itself" />
        <label className="check">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Mark public
        </label>
        {err && <p className="err">{err}</p>}
        <button type="submit">Keep this slip</button>
        <button type="button" className="ghost" onClick={signOut}>Leave</button>
      </form>
      <div className="grid">
        {slips.map((s, i) => (
          <article className="slip" key={s.id} style={{ animationDelay: `${0.04 * i}s` }}>
            {s.title ? <h3>{s.title}</h3> : null}
            <p>{s.body}</p>
            <div className="meta">{s.is_public ? "On the wall" : "Private"} · {new Date(s.created_at).toLocaleString()}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button type="button" className="ghost" onClick={() => toggle(s)}>
                {s.is_public ? "Make private" : "Make public"}
              </button>
              <button type="button" className="ghost" onClick={() => remove(s.id)}>Drop</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
