"use client";
import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import toast from "react-hot-toast";

type AccountType = "landowner" | "buyer";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("landowner");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await api.post("/auth/login", { email, password });
        login(response.data.token, response.data.user);
        toast.success("Login successful!");

        // Redirect based on role
        if (response.data.user.role === "admin") {
          router.push("/pages/dashboard");
        } else if (response.data.user.role === "landowner") {
          router.push("/pages/ownerdashbaord");
        } else {
          router.push("/pages/userdashboard");
        }
      } else {
        const response = await api.post("/auth/signup", {
          name: fullName,
          email,
          password,
          role: accountType,
        });
        login(response.data.token, response.data.user);
        toast.success("Account created successfully!");

        if (accountType === "landowner") {
          router.push("/pages/ownerdashbaord");
        } else {
          router.push("/pages/userdashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f1e18" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-36">
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/logo-icon.png"
            alt="TerraTrust"
            width={160}
            height={160}
            className="w-10 h-10"
          />
          <span className="font-display text-2xl text-[#fdf7e9]">
            TerraTrust
          </span>
        </div>
        <h1 className="font-display text-5xl text-[#fdf7e9] leading-tight mb-6">
          Secure your land. <br />
          Protect your future.
        </h1>
        <p className="font-body text-lg text-[#d8cca7] max-w-md leading-relaxed">
          {
            "Nigeria's tamper-resistant land registry platform. Verify ownership, transfer titles, and resolve disputes — all from your device."
          }
        </p>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-[#fefffe] rounded-2xl p-8 shadow-xl">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Image
              src="/logo-icon.png"
              alt="TerraTrust"
              width={160}
              height={160}
              className="w-8 h-8"
            />
            <span className="font-display text-lg text-foreground">
              TerraTrust
            </span>
          </div>

          {showForgot ? (
            <>
              <h2 className="font-display text-2xl text-[#0f1a16] mb-2">
                Reset Password
              </h2>
              <p className="font-body text-sm text-[#61776f] mb-6">
                Enter your email to receive a reset link.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[#61776f]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-[#f7f8f7] font-body text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#dce5e0]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#18422f] text-white font-body font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full text-center font-body text-sm text-[#61776f] hover:text-[#83a599]"
                >
                  Back to login
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl text-[#0f1a16] mb-2">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="font-body text-sm text-[#61776f] mb-6">
                {isLogin
                  ? "Sign in to your TerraTrust account"
                  : "Join TerraTrust to secure your land records"}
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    {/* Account type selector */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountType("landowner")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          accountType === "landowner"
                            ? "border-[#18422f] bg-[#f3f5f4]"
                            : "border-white bg-[#f3f5f4] hover:border-[#18422f]"
                        }`}
                      >
                        <Home className="w-6 h-6 text-[#18422f]" />
                        <span className="font-body text-sm font-semibold text-[#18422f]">
                          Landowner
                        </span>
                        <span className="font-body text-[11px] text-[#6e7a6f] text-center leading-tight">
                          I own or want to register land
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType("buyer")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          accountType === "buyer"
                            ? "border-[#18422f] bg-[#f3f5f4]"
                            : "border-white bg-[#f3f5f4] hover:border-[#18422f]"
                        }`}
                      >
                        <ShoppingCart className="w-6 h-6 text-[#18422f]" />
                        <span className="font-body text-sm font-semibold text-[#18422f]">
                          Buyer / Agent
                        </span>
                        <span className="font-body text-[11px] text-[#6e7a6f] text-center leading-tight">
                          I want to buy or verify land
                        </span>
                      </button>
                    </div>

                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-[#61776f]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-[#f7f8f7] font-body text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#dce5e0]"
                      />
                    </div>
                  </>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[#61776f]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-[#f7f8f7] font-body text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#dce5e0]"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#61776f]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-border bg-[#f7f8f7] font-body text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#dce5e0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#61776f]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm font-body text-[#c9af84] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#18422f] text-white font-body font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-body text-sm text-[#18422f] hover:text-black"
                >
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <span className="font-semibold text-primary">
                    {isLogin ? "Sign up" : "Sign in"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
