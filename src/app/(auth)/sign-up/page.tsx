"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { userSignUpSchema } from "@/schemas/signUp.schema";
import axios from "axios";
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

const page = () => {
  const [username, setUsername] = useState("");
  const [usernamemessage, setUsernameMessage] = useState("");
  const [usernamechecking, setUsernameChecking] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof userSignUpSchema>>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkusernameunique = async () => {
      if (username) {
        setUsernameChecking(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/username_validation?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          setUsernameMessage("Error checking username");
        } finally {
          setUsernameChecking(false);
        }
      }
    };
    checkusernameunique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof userSignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error while signing up", error);
      toast({
        title: "Error",
        description: "An error occurred while signing up",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-xl rounded-lg transform transition duration-300 hover:scale-105">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-700">Join the Project</h1>
          <p className="text-gray-500">Sign up to start your journey.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username field with green tick */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 rounded-lg p-3"
                        placeholder="Enter a unique username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          debounced(e.target.value);
                        }}
                      />
                      {usernamechecking ? (
                        <span className="absolute inset-y-0 right-3 flex items-center">
                          <Loader2 className="animate-spin text-blue-400 h-5 w-5" />
                        </span>
                      ) : usernamemessage === "Username is available" ? (
                        <span className="absolute inset-y-0 right-3 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="green"
                            className="h-6 w-6 bg-green-100 text-green-500 rounded-full p-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 rounded-lg p-3"
                      placeholder="Enter your email"
                      {...field}
                    />
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
                        className={`border-2 ${
                          form.formState.errors.password
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 rounded-lg p-3`}
                        type="password"
                        placeholder="Create a strong password"
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
              disabled={issubmitting || usernamechecking}
            >
              {issubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default page;