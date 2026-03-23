import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function Home() {
  const session = await verifySession();
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
