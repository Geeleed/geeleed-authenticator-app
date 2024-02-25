import md5 from "crypto-js/md5";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id_card");
  const sub = new Date().toISOString().split(":");
  const YYYY_MM_DDhhmm = (sub[0] + sub[1]).split("T").join("");
  const hash = md5(id + YYYY_MM_DDhhmm).toString();
  const take = hash.slice(0, 6).toUpperCase();
  return Response.json({ password: take });
}
