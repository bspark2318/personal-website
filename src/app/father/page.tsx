import { cookies } from "next/headers";
import Nav from "@/components/Nav";
import Dashboard from "@/components/father/Dashboard";
import Gate from "@/components/father/Gate";
import { FATHER_COOKIE, isValidSession } from "@/lib/father/auth";
import { FATHER } from "@/lib/father/data";

export const dynamic = "force-dynamic";

export default async function FatherPage() {
  const session = (await cookies()).get(FATHER_COOKIE)?.value;
  if (!isValidSession(session)) return <Gate />;
  return (
    <main>
      <Nav />
      <Dashboard data={FATHER} />
    </main>
  );
}
