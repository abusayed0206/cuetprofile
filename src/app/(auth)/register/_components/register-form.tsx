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
  studentid: z.string().min(7, "Student ID is required."),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type RegisterValuesType = z.infer<typeof registerFormSchema>;

const defaultValues: RegisterValuesType = {
  studentid: "",
  email: "",
  password: "",
};

const RegisterForm = () => {
  const [loading, setLoading] = useState(false); // State to manage loader
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<RegisterValuesType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const fetchEmailByStudentId = async (studentid: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/idcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentid }),
      });

      const data = await res.json();

      if (res.ok) {
        form.setValue("email", data.email);
      } else {
        toast.error(data.message || "Error fetching email.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the email.");
    } finally {
      setLoading(false);
    }
  };

  async function handleRegister(values: RegisterValuesType) {
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
          label="Student ID"
          name="studentid"
          placeholder="Enter your Student ID"
          description=""
          required
          onBlur={(e) => fetchEmailByStudentId(e.target.value)}
        />

        {loading && <p>Loading email...</p>} {/* Loader */}

        <InputForm
          label="Email"
          name="email"
          placeholder="hello@sarathadhi.com"
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

        <Button disabled={loading}>Register</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
