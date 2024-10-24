"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signIn.schema";
import { signIn } from "next-auth/react";

const signInPage = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const router = useRouter();
  const [issubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const OnSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false, // Ensures the function doesn’t redirect automatically
    });
    console.log(result);
    setIsSubmitting(false);
    if (result?.error) {
      // Show a toast when there is an error
      toast({
        title: "Sign In failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    }
    if (result?.url) {
      toast({
        title: "Success",
        description: "Successfully signed in",
        variant: "default",
      });
      // Redirect to the dashboard if sign-in is successful
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-r from-emerald-50 via-amber-50 to-rose-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-xl rounded-xl ">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-700">Sign In </h1>
          <p className="text-gray-500">Sign In to see the Feedbacks.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 rounded-lg p-3"
                        placeholder="Username/Email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password field with conditional validation message */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 rounded-lg p-3"
                        type="password"
                        placeholder="Enter your Password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  {/* Show password validation error */}
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
              disabled={issubmitting}
            >
              {issubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-500">
            Doesn't Have an Account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default signInPage;
