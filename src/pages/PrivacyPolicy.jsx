// PrivacyPolicy.jsx
import React, { useEffect } from "react";

const PrivacyPolicy = () => {
        useEffect(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, []);
  return (
    <div className="bg-white text-gray-800 py-20 px-6 sm:px-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-purple-500 mb-10 text-center">Privacy Policy</h1>

      <div className="space-y-6 text-gray-700 text-base leading-relaxed">
        <p>
          This Privacy Policy describes how Megadie ("we," "us," or "our") collects,
          uses, discloses, and protects your information when you use our website,
          megadie.com ("Website"). By accessing or using our Website, you agree to the
          terms outlined in this Privacy Policy. If you do not agree, please refrain from
          using our Website.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Information We Collect</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>1.1</strong> We may collect personal information you voluntarily provide,
            such as your name, contact details, and payment information when you place an
            order or contact us.
          </li>
          <li>
            <strong>1.2</strong> We may automatically collect certain technical information
            like your IP address, browser type, and browsing behavior through cookies and
            similar technologies.
          </li>
          <li>
            <strong>1.3</strong> We may also collect non-personal, aggregated data about
            website usage and traffic patterns.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">2. Use of Information</h2>
        <ul className="list-disc list-inside">
          <li>Processing your orders and payments.</li>
          <li>Responding to your inquiries and providing customer support.</li>
          <li>Improving our Website, products, and services.</li>
          <li>Analyzing usage to enhance user experience.</li>
          <li>Sending promotional offers, subject to your consent.</li>
        </ul>
        <p>
          We strive to ensure the accuracy and reliability of the information we collect,
          but we do not guarantee it.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Disclosure of Information</h2>
        <ul className="list-disc list-inside">
          <li>
            To service providers and partners who help operate our Website and process
            transactions.
          </li>
          <li>
            To comply with legal obligations or requests from governmental authorities.
          </li>
          <li>
            To protect our rights, users, or the public.
          </li>
          <li>
            As part of any merger, sale, or transfer of business or assets.
          </li>
        </ul>
        <p>
          We are not responsible for third parties' actions but aim to share data only with
          those who uphold strong data protection standards.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Cookies and Tracking Technologies</h2>
        <p>
          Our Website may use cookies and similar technologies to improve your experience
          and analyze traffic. You can accept or decline cookies via browser settings,
          though this may affect functionality.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Data Security</h2>
        <p>
          We use reasonable measures to protect your data, but no internet transmission is
          100% secure. You share your information at your own risk.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Data Retention</h2>
        <p>
          We keep personal data only as long as needed for business or legal purposes. We
          may delete or anonymize data at our discretion.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Your Rights</h2>
        <p>
          You may request access to, correction, or deletion of your data. Contact us via
          our website’s contact form. We may verify your identity before processing
          requests.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Third-Party Links</h2>
        <p>
          We may link to external websites. We are not responsible for their content or
          privacy practices. Please review their policies.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Children’s Privacy</h2>
        <p>
          Our Website is not for users under 18. We do not knowingly collect data from
          children. If we do, we will delete it promptly.
        </p>

        <h2 className="text-xl font-semibold mt-8">10. Changes to This Policy</h2>
        <p>
          We may update this Policy at any time. Updates are effective upon posting. Your
          continued use indicates acceptance of those changes.
        </p>

        <h2 className="text-xl font-semibold mt-8">11. Contact Us</h2>
        <p>
          For questions about this policy, please contact us through our website’s contact form.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
