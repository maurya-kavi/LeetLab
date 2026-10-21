import React , {useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Link } from 'react-router-dom'
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

import {z} from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "../components/ThemeToggle";

const LoginSchema = z.object({
  email:z.string().email("Enter a valid email"),
  password:z.string().min(6 , "Password must be atleast of 6 characters"),
})

const LoginPage = () => {

  const [showPassword , setShowPassword] = useState(false);

  const {isLoggingIn , login} = useAuthStore()

  const {
    register,
    handleSubmit,
    formState:{errors},
  } = useForm({
    resolver:zodResolver(LoginSchema)
  })

  const onSubmit = async (data)=>{
   try {
    await login(data)
    // console.log("login data" , data)
   } catch (error) {
     console.error("signup failed:", error);
   }
  }


  return (
    <div className='grid min-h-screen bg-base-200 lg:grid-cols-[1fr_1fr]'>
        <ThemeToggle className="fixed right-4 top-4 z-50" />
        <div className="flex flex-col justify-center items-center px-5 py-12 sm:px-10 lg:px-14">
        <div className="surface-card w-full max-w-md space-y-8 p-6 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm text-base-content/60">Sign in to continue your coding practice.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
          

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary mt-1 w-full shadow-lg shadow-primary/20"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in…
                </>
                ) : (
                  "Sign in"
                )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

       {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your journey with us. Don't have an account ? Create one now."
        }
      />
    </div>
  )
}

export default LoginPage
