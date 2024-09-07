"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/ui/input/input-form";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type RegisterValuesType = z.infer<typeof registerFormSchema>;

const defaultValues: RegisterValuesType = {
  email: "",
  password: "",
};

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<RegisterValuesType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const checkEmailExists = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("apidata")
        .select("email")
        .eq("email", email)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error("You are not a CUET student.");
        form.setError("email", { message: "You are not a CUET student." });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("An error occurred while checking your email.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  async function handleRegister(values: RegisterValuesType) {
    const isValidEmail = await checkEmailExists(values.email);
    if (!isValidEmail) return;

    const { error, data } = await supabase.auth.signUp({
      ...values,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      },
    });

    if (error) return toast.error(error.message);

    console.log({ data });
    toast.success("Verification email sent. Check your mail.");
    router.replace("/email-verify");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="w-full flex flex-col gap-y-4"
      >
        <InputForm
          label="Email"
          name="email"
          placeholder="hello@example.com"
          description=""
          required
        />
        <InputForm
          type="password"
          label="Password"
          name="password"
          description=""
          required
        />
        <Button disabled={loading}>
          {loading ? "Checking..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;