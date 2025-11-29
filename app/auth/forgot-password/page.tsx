"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Footer } from "@/components/footer"
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // For demo purposes, always succeed
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">📧</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Check Your Email
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3 mb-6">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Reset Link Sent
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click the link in your email to reset your password. The link will expire in 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/auth/login")}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full"
                    >
                      Try Different Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={handleSubmit}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={isLoading}
                >
                  resend the link
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/auth/login" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl mb-4"
            >
              🔑
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
                <CardDescription className="text-center">
                  No worries! We&apos;ll help you get back into your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We&apos;ll send a reset link to this email
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Reset Link...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Link
                      </div>
                    )}
                  </Button>
                </form>

                {/* Help Text */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-gray-500 dark:text-gray-400"
          >
            Need help? Contact our{" "}
            <Link href="/support" className="text-blue-600 hover:text-blue-500">
              support team
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}