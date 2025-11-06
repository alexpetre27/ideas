import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Autentificare</h2>
        <p className="mb-6 text-muted-foreground">
          Folosește contul tău Google pentru a accesa dashboard-ul.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" size="lg" className="w-full">
            Autentificare cu Google
          </Button>
        </form>
      </div>
    </div>
  );
}
