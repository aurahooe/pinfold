import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();
  const [{ data: hours }, { data: slips }] = await Promise.all([
    supabase.from("pinfold_hours").select("*").order("hour_mark", { ascending: false }).limit(1),
    supabase
      .from("pinfold_slips")
      .select("id,title,body,created_at,pinfold_profiles(handle,display_name)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(48),
  ]);
  const hour = hours?.[0];

  return (
    <main>
      <section className="hero">
        <h1>What you mark public<br />goes on the wall.</h1>
        <p>
          Private slips stay at your desk. The masthead is rewritten every hour,
          and a public slip can be lifted into it.
        </p>
      </section>

      {hour && (
        <article className="hour">
          <small>This hour · {new Date(hour.hour_mark).toUTCString().slice(0, 22)}</small>
          <h2>{hour.title}</h2>
          <p>{hour.body}</p>
        </article>
      )}

      <div className="grid">
        {(slips || []).length === 0 && (
          <p className="meta">The wall is empty. Write something at the desk and mark it public.</p>
        )}
        {(slips || []).map((s, i) => (
          <article className="slip" key={s.id} style={{ animationDelay: `${0.035 * i}s` }}>
            {s.title ? <h3>{s.title}</h3> : null}
            <p>{s.body}</p>
            <div className="meta">
              {(s.pinfold_profiles?.display_name || s.pinfold_profiles?.handle || "anon")} ·{" "}
              {new Date(s.created_at).toLocaleString()}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
