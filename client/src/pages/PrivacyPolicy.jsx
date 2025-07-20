import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-300">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-slate-300 leading-relaxed">
                ReWear ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our sustainable fashion marketplace platform. By using our service, you consent to the data practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.1 Personal Information</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Profile information and preferences</li>
                <li>Payment and transaction information</li>
                <li>Communication history with other users</li>
                <li>User-generated content (listings, reviews, comments)</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We automatically collect certain information when you use our platform:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Device information and IP address</li>
                <li>Browser type and operating system</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your consent)</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Provide and maintain our marketplace platform</li>
                <li>Process transactions and manage payments</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>Send important updates and notifications</li>
                <li>Improve our services and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
                <li>Provide customer support and resolve disputes</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>User Consent:</strong> When you explicitly consent to sharing</li>
                <li><strong>Platform Safety:</strong> To prevent fraud and ensure community safety</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage and backup procedures</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
              <p className="text-slate-300 leading-relaxed">
                Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-slate-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date. Your continued use of our platform after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-white/5 rounded-xl p-6">
                <p className="text-slate-300">
                  <strong>Email:</strong> privacy@rewear.com<br/>
                  <strong>Address:</strong> ReWear Inc., 123 Sustainable Street, Green City, GC 12345<br/>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 