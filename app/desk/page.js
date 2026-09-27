import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeskClient from "./ui";

export default async function DeskPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: profile } = await supabase.from("pinfold_profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) {
    const slug = (user.email?.split("@")[0] || "hand").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 18);
    const { data } = await supabase
      .from("pinfold_profiles")
      .insert({ id: user.id, handle: slug + Math.floor(Math.random() * 90 + 10), display_name: slug })
      .select()
      .single();
    profile = data;
  }

  const { data: slips } = await supabase
    .from("pinfold_slips")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return <DeskClient profile={profile} slips={slips || []} />;
}
