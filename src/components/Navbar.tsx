"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react"; // Icon for mobile navigation

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-100 via-amber-100 to-rose-100 text-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo or Title */}
          <Link href="/" className="text-2xl font-extrabold  text-teal-800">
            Feedback
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {session ? (
            <>
              <span className="text-gray-700 font-semibold">
                Welcome {user.username || user.email}
              </span>
              <Button
                className="bg-teal-600 text-white hover:bg-teal-700 transition-colors px-4 py-2 rounded-md"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-up" className="hover:underline text-gray-700">
                Sign Up
              </Link>
              <Button className="bg-teal-600 text-white hover:bg-teal-700 transition-colors px-4 py-2 rounded-md">
                <Link href={"/sign-in"}>Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-emerald-100 via-amber-100 to-rose-100 shadow-lg">
          <div className="space-y-4 px-4 py-4">
            {session ? (
              <>
                <span className="block text-gray-700 font-semibold">
                  Welcome {user.username || user.email}
                </span>
                <Button
                  className="bg-teal-600 text-white w-full hover:bg-teal-700 transition-colors px-4 py-2 rounded-md"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-up" className="block text-gray-700">
                  Sign Up
                </Link>
                <Button className="bg-teal-600 text-white w-full hover:bg-teal-700 transition-colors px-4 py-2 rounded-md">
                  <Link href={"/sign-in"}>Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
