import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold mb-4">Budget Tracker</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Soluția ta simplă pentru a-ți urmări veniturile și cheltuielile.
          Conectează-te pentru a începe.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Autentificare</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
