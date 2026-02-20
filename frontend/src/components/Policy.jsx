import React from "react";

function Policy() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 text-gray-700">

      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Privacy Policy
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Last Updated: January 2026
      </p>

      <p className="mb-6 leading-relaxed">
        Prescripto is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, disclose, and safeguard
        your information when you use our medical appointment booking platform.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">1. Information We Collect</h2>
      <p className="mb-4 leading-relaxed">
        We may collect personal and medical-related information including:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Name, age, gender, and contact details</li>
        <li>Email address and phone number</li>
        <li>Medical symptoms and health information provided by you</li>
        <li>Doctor preferences and appointment details</li>
        <li>Payment transaction details (processed securely via payment gateway)</li>
      </ul>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>To book and manage medical appointments</li>
        <li>To recommend suitable doctors based on symptoms</li>
        <li>To improve healthcare services and user experience</li>
        <li>To process payments securely</li>
        <li>To communicate appointment updates and notifications</li>
      </ul>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">3. Sharing of Information</h2>
      <p className="leading-relaxed">
        We do not sell or rent your personal data. Your information may only be
        shared with registered doctors for appointment purposes and with trusted
        third-party services such as payment gateways and hosting providers
        strictly required to operate the platform.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">4. Data Security</h2>
      <p className="leading-relaxed">
        We implement industry-standard security measures to protect your data from
        unauthorized access, alteration, disclosure, or destruction. However, no
        online platform can guarantee absolute security.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">5. Payments</h2>
      <p className="leading-relaxed">
        All payments are processed securely through third-party payment providers.
        We do not store your card or banking details on our servers.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">6. User Rights</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You may request to update or delete your account information</li>
        <li>You may opt out of promotional communication</li>
        <li>You may contact us for any data-related concerns</li>
      </ul>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">7. Changes to This Policy</h2>
      <p className="leading-relaxed">
        We may update this Privacy Policy periodically. Continued use of the
        platform after changes means you accept the updated policy.
      </p>

      {/* Section */}
      <h2 className="text-xl font-semibold mt-10 mb-3">8. Contact Us</h2>
      <p className="leading-relaxed">
        If you have questions regarding this Privacy Policy, please contact us at:
      </p>

      <div className="mt-3">
        <p>Email: medi360@gmail.com</p>
        <p>Phone: +91 6269968982</p>
      </div>

    </div>
  );
}

export default Policy;
