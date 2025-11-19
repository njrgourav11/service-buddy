"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone, address)",
        "Booking and service history",
        "Payment information (processed securely by third parties)",
        "Device and usage information for app functionality",
        "Location data for service area determination"
      ]
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your service bookings",
        "Communicate about your bookings and services",
        "Improve our services and customer experience",
        "Send important updates and promotional offers",
        "Ensure platform security and prevent fraud",
        "Comply with legal obligations"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Information Sharing",
      content: [
        "With service providers to fulfill your bookings",
        "With payment processors for secure transactions",
        "When required by law or to protect rights",
        "With your consent for specific purposes",
        "In aggregated form for analytics and improvements"
      ]
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission",
        "Secure storage with access controls",
        "Regular security audits and updates",
        "Limited access to personal data on need-to-know basis",
        "Secure deletion of data when no longer needed"
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
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How we collect, use, and protect your personal information
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
                <Shield className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Our Commitment to Privacy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    At Service Buddy, we are committed to protecting your privacy and ensuring the security of your personal information.
                    This privacy policy explains how we collect, use, and safeguard your data when you use our platform.
                    By using our services, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                      {section.icon}
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
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

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
              <CardDescription>
                You have control over your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Access & Update</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can access and update your personal information through your account settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Deletion</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can request deletion of your account and associated data at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Communication Preferences</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your email and SMS preferences in your account settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cookie Settings</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Control cookie preferences through your browser settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
              <CardDescription>
                Questions about our privacy practices?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">privacy@servicebuddy.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Data Protection Officer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">dpo@servicebuddy.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this privacy policy periodically to stay informed about how we protect your information.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@servicebuddy.com" className="text-blue-600 hover:text-blue-500">
              privacy@servicebuddy.com
            </a>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}