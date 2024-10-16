import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import LoginForm from "./_components/login-form";

const LoginPage = () => {
  return (
    <section className="container flex h-screen flex-col items-center justify-center">
      <Button variant="outline" asChild>
        <Link href="/profile" className={cn("absolute left-4 top-4")}>
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="mx-auto max-w-80 flex flex-col justify-center space-y-6 ">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground">
            Before editing your profile or viewing other profiles, please login. Thank you!
          </p>
        </div>

        <LoginForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            CUET Student? Register & Change Your Profile!
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/reset-password"
            className="hover:text-brand underline underline-offset-4"
          >
            Forgot your password? Reset it here!
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
