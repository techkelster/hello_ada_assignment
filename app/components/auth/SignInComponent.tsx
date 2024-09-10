import { signIn } from "next-auth/react";
import React, { useState, FC } from "react";
import { useRouter } from "next/navigation";

const SignInComponent: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for storing error messages
  const router = useRouter(); // Move useRouter hook outside of handleSignUp

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear error before sign-in attempt

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Don't redirect automatically
    });

    // Check if the sign-in attempt was unsuccessful
    if (result?.error) {
      setError(result.error); // Set error message if sign-in failed
    }
  };

  const handleSignUp = () => {
    router.push("/auth/signup"); // Correct path for sign up
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center animate-fadeIn">
        Welcome to Hello Ada Task Manager
      </h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 animate-slideUp">
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
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
            className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnHover"
          >
            Sign In
          </button>
        </form>

        <button
          onClick={() => signIn("google")}
          className="w-full py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnHover"
        >
          Sign In with Google
        </button>

        <button
          onClick={handleSignUp}
          className="w-full py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnHover"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignInComponent;
