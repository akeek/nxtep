"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "../../../@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../@/components/ui/form";
import { Input } from "../../../@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setError(null);

    try {
      console.log("Form Values:", values); // Log form values
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      console.log("Response:", response); // Log response to see if it's ok

      if (response.ok) {
        const data = await response.json();
        console.log("Response Data:", data); // Log the response data

        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        const err = await response.json();
        setError(err.error || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err); // Log the error
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-2xl font-bold pt-5">
        You need to log in mafakka
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="space-y-6 bg-white p-6 rounded"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="outline"
            type="submit"
            className="bg-green-200 hover:bg-green-500 hover:text-white"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
