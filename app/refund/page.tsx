"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Footer } from "@/components/footer"
import { RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, CreditCard } from "lucide-react"

export default function RefundPage() {
  const refundScenarios = [
    {
      title: "Service Not Provided",
      description: "If the service provider fails to show up",
      refund: "100% refund",
      timeline: "Immediate",
      conditions: "Report within 2 hours of scheduled time"
    },
    {
      title: "Service Cancellation",
      description: "When you cancel the booking",
      refund: "Free cancellation up to 2 hours before service",
      timeline: "Within 5-7 business days",
      conditions: "Late cancellation fees may apply"
    },
    {
      title: "Poor Service Quality",
      description: "Service doesn't meet quality standards",
      refund: "Partial or full refund based on assessment",
      timeline: "Within 48 hours of complaint",
      conditions: "Supported by photos/videos and description"
    },
    {
      title: "Technical Issues",
      description: "Platform or payment system problems",
      refund: "100% refund",
      timeline: "Immediate",
      conditions: "Verified technical issues on our end"
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: "Submit Request",
      description: "Contact our support team with booking details and reason for refund",
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      step: 2,
      title: "Review & Verification",
      description: "Our team reviews your request and may request additional information",
      icon: <Clock className="h-5 w-5" />
    },
    {
      step: 3,
      title: "Decision & Processing",
      description: "Refund decision is made and processed if approved",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 4,
      title: "Refund Completion",
      description: "Refund is credited back to your original payment method",
      icon: <CreditCard className="h-5 w-5" />
    }
  ]

  const refundMethods = [
    {
      method: "Cash on Delivery",
      description: "No refund processing needed - payment collected after service",
      timeline: "N/A",
      fees: "No fees"
    },
    {
      method: "Credit/Debit Card",
      description: "Refund credited back to original card",
      timeline: "5-7 business days",
      fees: "No fees"
    },
    {
      method: "UPI/Digital Wallets",
      description: "Refund credited back to UPI ID or wallet",
      timeline: "1-3 business days",
      fees: "No fees"
    },
    {
      method: "Net Banking",
      description: "Refund credited back to bank account",
      timeline: "5-7 business days",
      fees: "No fees"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">💰</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our commitment to your satisfaction and fair refund practices
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: January 15, 2024
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <RefreshCw className="h-8 w-8 text-green-500 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    100% Satisfaction Guarantee
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    At Service Buddy, we are committed to providing high-quality services. If you&apos;re not completely satisfied,
                    we offer fair and transparent refund policies. Our goal is to ensure you have a positive experience with every service booking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refund Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            When Can You Get a Refund?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {refundScenarios.map((scenario, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {scenario.title}
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {scenario.refund}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Processing Time:</span>
                      <span className="font-medium">{scenario.timeline}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Conditions:</strong> {scenario.conditions}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Refund Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Refund Process
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      {step.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Step {step.step}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refund Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Refund Methods & Timelines
          </h2>
          <div className="space-y-4">
            {refundMethods.map((method, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {method.method}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {method.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-gray-500">{method.timeline}</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-gray-500">{method.fees}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Important Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  What We Cover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Service provider no-show</li>
                  <li>• Major service quality issues</li>
                  <li>• Platform technical problems</li>
                  <li>• Incorrect service delivery</li>
                  <li>• Emergency cancellations (case-by-case)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  What We Don&apos;t Cover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Change of mind after service starts</li>
                  <li>• Minor dissatisfaction without evidence</li>
                  <li>• Third-party service issues</li>
                  <li>• Force majeure events</li>
                  <li>• Services already consumed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Need a Refund?</CardTitle>
              <CardDescription>
                Contact our support team to initiate a refund request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">📧</div>
                  <h4 className="font-semibold mb-1">Email Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">refunds@servicebuddy.com</p>
                  <p className="text-xs text-gray-500">Response within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📞</div>
                  <h4 className="font-semibold mb-1">Phone Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+91 1800-XXX-XXXX</p>
                  <p className="text-xs text-gray-500">Mon-Sun: 8AM-10PM</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">💬</div>
                  <h4 className="font-semibold mb-1">Live Chat</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available on website</p>
                  <p className="text-xs text-gray-500">24/7 support</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Before Requesting a Refund
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Please ensure you have all relevant details including booking ID, service date, and description of the issue.
                      Having photos or videos of the service area can help expedite your refund request.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            This refund policy is part of our Terms of Service. For more details, please refer to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              complete terms
            </a>
            .
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}