"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); // State to store error messages
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); // Always call useRouter() at the top level

  // Set isMounted to true after the component has mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (res.ok && isMounted) {
      router.push("/tasks"); // Redirect to tasks page after successful registration
    } else {
      const { message } = await res.json(); // Assuming the response contains an error message
      setError(message || "An error occurred. Please try again."); // Set error message
    }
  };

  if (!isMounted) {
    return null; // Prevent rendering until the component is mounted
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center animate-fadeIn">
        Register
      </h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 animate-slideUp">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />

          {error && (
            <p className="text-red-500 text-center animate-fadeIn">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnHover"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
