"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FileText, Users, Shield, AlertTriangle, Scale } from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Agreement",
      content: "By accessing and using Service Buddy, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Service Description",
      content: "Service Buddy provides a platform connecting customers with verified service providers for home and personal services. We facilitate bookings but are not directly responsible for service quality, which is managed by our partner service providers."
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "User Responsibilities",
      content: "Users must provide accurate information, respect service providers, maintain appropriate conduct, and comply with applicable laws. Any misuse of the platform may result in account suspension or termination."
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Booking and Cancellation",
      content: "Bookings are confirmed upon payment. Free cancellation is available up to 2 hours before service time. Late cancellations or no-shows may incur charges. Service providers may have their own cancellation policies."
    }
  ]

  const terms = [
    {
      title: "Account Registration",
      items: [
        "Users must be 18 years or older to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the confidentiality of account credentials",
        "Notify us immediately of any unauthorized account access",
        "One account per user; multiple accounts may be suspended"
      ]
    },
    {
      title: "Service Provider Standards",
      items: [
        "All service providers are background-checked and verified",
        "Providers maintain appropriate licenses and insurance",
        "Quality standards are monitored through customer feedback",
        "Service providers are independent contractors, not employees",
        "Platform reserves right to remove providers not meeting standards"
      ]
    },
    {
      title: "Payment Terms",
      items: [
        "Payment is collected after service completion for COD",
        "Online payments are processed securely through third parties",
        "Refunds processed within 5-7 business days",
        "Disputes must be raised within 48 hours of service completion",
        "Additional charges may apply for special requests or emergencies"
      ]
    },
    {
      title: "Liability Limitations",
      items: [
        "Platform acts as intermediary between users and providers",
        "Not liable for service quality or provider actions",
        "Maximum liability limited to booking amount",
        "Users encouraged to purchase appropriate insurance",
        "Force majeure events may affect service availability"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please read these terms carefully before using our services
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
                <FileText className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Agreement Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    These Terms of Service (&quot;Terms&quot;) govern your use of Service Buddy&apos;s website, mobile application, and services.
                    By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these terms,
                    then you may not access the service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                      {section.icon}
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Terms */}
        <div className="space-y-8">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{term.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {term.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 dark:text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Prohibited Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Prohibited Activities</CardTitle>
              <CardDescription>
                Activities that violate our terms of service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Platform Misuse</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Attempting to gain unauthorized access</li>
                    <li>• Using the platform for illegal activities</li>
                    <li>• Interfering with platform operations</li>
                    <li>• Creating fake accounts or reviews</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Content Violations</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Posting harmful or offensive content</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Sharing false or misleading information</li>
                    <li>• Harassment or discrimination</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Termination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We reserve the right to terminate or suspend your account immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account,
                you may simply discontinue using the Service or contact us to delete your account.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Questions about these terms?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Email: legal@servicebuddy.com</p>
                  <p className="font-medium">Phone: +91 1800-XXX-XXXX</p>
                  <p className="text-sm text-gray-500">Legal Department, Service Buddy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            These terms are governed by and construed in accordance with the laws of India.
            Any disputes shall be subject to the exclusive jurisdiction of the courts in Berhampur, Odisha.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}