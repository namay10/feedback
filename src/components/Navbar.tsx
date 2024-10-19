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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo or Title */}
          <Link href="/" className="text-2xl font-bold text-white">
            Feedback
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {session ? (
            <>
              <span className="text-white font-semibold">
                Welcome {user.username || user.email}
              </span>
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:underline">
                Sign In
              </Link>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 transition-colors">
                Login
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-500">
          <div className="space-y-4 px-4 py-4">
            {session ? (
              <>
                <span className="block text-white font-semibold">
                  Welcome {user.username || user.email}
                </span>
                <Button
                  className="bg-white text-blue-600 w-full hover:bg-gray-100 transition-colors"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="block text-white">
                  Sign In
                </Link>
                <Button className="bg-white text-blue-600 w-full hover:bg-gray-100 transition-colors">
                  Login
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
