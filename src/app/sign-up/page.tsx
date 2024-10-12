"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button, TextField, CircularProgress } from "@mui/material"; // Material-UI components
import Skeleton from "@mui/material/Skeleton";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/sign-up", user);
      console.log("signup success", response.data);
      router.push("/login");
    } catch (error) {
      console.log("signup error", error);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.password && user.username) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 md:px-0">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {loading ? "Processing..." : "Sign Up"}
        </h1>

        {loading ? (
          <div>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              className="mb-4"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              className="mb-4"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              className="mb-4"
            />
            <Skeleton variant="rectangular" width="100%" height={36} />
          </div>
        ) : (
          <div>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              fullWidth
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="mb-4"
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mb-4"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="mb-4"
            />
            <Button
              onClick={onSignup}
              disabled={buttonDisabled}
              variant="contained"
              color="primary"
              fullWidth
              className="w-full"
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </div>
        )}

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
