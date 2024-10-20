"use client";
import Link from "next/link";
import { Button } from "../components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-100 via-amber-100 to-rose-100 text-gray-800 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-teal-800 mb-4">About Us</h2>
          <p className="text-gray-700">
            Our platform allows you to securely receive anonymous feedbacks or
            messages from your community.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-2xl font-bold text-teal-800 mb-4">
            Useful Links
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-gray-700 hover:underline hover:text-teal-600 transition-colors"
              >
                Email
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-gray-700 hover:underline hover:text-teal-600 transition-colors"
              >
                Github
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 hover:underline hover:text-teal-600 transition-colors"
              >
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have questions or feedback? Feel free to reach out to us.
          </p>
          <Button className="mt-4 bg-teal-600 text-white hover:bg-teal-700 transition-colors px-4 py-2 rounded-md">
            Get in Touch
          </Button>
        </div>

        {/* <div>
  <h2 className="text-2xl font-bold text-teal-800 mb-4">Support Us</h2>
  <p className="text-gray-700">
    If you love our platform and want to support us, consider buying us a coffee!
    Your support helps us keep improving and delivering great features.
  </p>
  <a
    href="https://www.buymeacoffee.com/yourprofile" // Replace with your actual Buy Me a Coffee URL
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 inline-block bg-teal-600 text-white hover:bg-teal-700 transition-colors px-4 py-2 rounded-md"
  >
    Buy Me a Coffee
  </a>
</div> */}
      </div>

      {/* Bottom Footer Section */}
      <div className="mt-8 border-t border-gray-200 pt-4 text-center text-gray-600">
        <p>&copy; 2024 Anonymous Feedback Platform. All rights reserved.</p>
        <p>&copy;Namay Gupta</p>
      </div>
    </footer>
  );
};

export default Footer;
