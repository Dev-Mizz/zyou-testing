import { Link } from "react-router-dom"
import { Seo } from "@/components/ui/Seo"
import "./legal.css"

/** /terms-of-use — static legal copy, dark-theme shell to match the rest of the site. */
export function TermsOfUse() {
  return (
    <main className="lg-page">
      <Seo
        title="Terms of Use | Zyou"
        description="The terms that govern your use of Zyou."
        canonical="https://zyou.ai/terms-of-use"
      />
      <div className="lg-wrap">
        <h1 className="lg-h1">Terms of Use</h1>
        <p className="lg-date">Effective Date: April 8, 2026</p>

        <h2 className="lg-h2">Introduction</h2>
        <p className="lg-p">
          This website zyou.ai (the "Website") is owned and operated by ZYOU AI SYSTEM SOLUTIONS Pvt Ltd (hereinafter "ZYOU"). The following Terms of Use ("Terms") regulate the access to and use of Services (as defined below). Please review the Terms carefully. In order to use Services you must be a registered user and have an advertising account on www.facebook.com ("Facebook") or www.instagram.com ("Instagram") and you must unconditionally consent to and accept these terms and conditions by ticking the "I agree" box when you sign up to the Services whereby you are entering into a legally binding agreement with ZYOU.
        </p>

        <h2 className="lg-h2">Data Processing Agreement</h2>
        <p className="lg-p">By using our Services, you acknowledge and agree to the terms of our Data Processing Agreement (DPA), which governs the processing of personal data in accordance with applicable data protection laws. The DPA is incorporated by reference into these Terms.</p>

        <h3 className="lg-h3">Related Links</h3>
        <div className="lg-related">
          <Link to="/privacy-policy" className="lg-link">Privacy Policy</Link>
        </div>

        <h2 className="lg-h2">1. Definitions</h2>
        <p className="lg-p"><strong>Agreement</strong> means these terms and conditions including all policies, procedures and/or guidelines which appear on the Website from time to time as well as all Facebook Terms and Instagram Terms.</p>
        <p className="lg-p"><strong>Ads Content</strong> means any and all information and files that you post on Facebook or Instagram by the use of the Services.</p>
        <p className="lg-p"><strong>Membership</strong> means the subscription service that entitles you to use ZYOU to publish and manage ads on Facebook.</p>
        <p className="lg-p"><strong>ZYOU</strong> means ZYOU's advanced management tool, its assignees and its successors, for Facebook and/or Instagram ads, which is used to provide the Services.</p>
        <p className="lg-p"><strong>Services</strong> means the web based features and services included in, and provided as part of, ZYOU.</p>

        <h2 className="lg-h2">2. Use of Services</h2>
        <p className="lg-p">The Website is not intended for individuals under the age of 18. ZYOU does not knowingly collect Personal Data from individuals under the age of 18.</p>
        <p className="lg-p">ZYOU grants you a non-exclusive, non-transferable, revocable, limited, personal right to use and access Services. You are responsible for your own username and password ("Login Information") and all individuals that access Services through your Login Information ("Authorized Users"). You and your Authorized Users may use Services only for your own business, not to build a similar or competitive product or service.</p>

        <h2 className="lg-h2">3. Pricing</h2>
        <p className="lg-p">The fees for Membership (the "Membership Fee") are set forth in ZYOU's current pricing schedule, which is available for review at zyou.ai/pricing.</p>
        <p className="lg-p">The Membership Fee covers access to the ZYOU technical platform only. It does not include, and is strictly exclusive of, any advertising expenditure ("Ad Spend") incurred on Facebook, Instagram, Google, or any other social media or advertising platform. You acknowledge and agree that you remain solely responsible for the direct payment of all advertising costs to the respective third-party platforms. ZYOU shall not be liable for any payments, billing disputes, or budget overages related to your external advertising accounts.</p>

        <h2 className="lg-h2">4. Disclaimer and Limitation of Liability</h2>
        <p className="lg-p">To the maximum extent permitted by law, ZYOU shall not be liable for any indirect, incidental, special, or consequential damages, or any loss of profits, revenues, or data resulting from your use of the Services.</p>
        <p className="lg-p">ZYOU provides a technical application and does not prescreen Ads Content. You assume all risks associated with publishing ads. ZYOU's aggregate liability will not exceed the lower of one hundred dollars ($100) or the amount you have paid to ZYOU in the past twelve (12) months.</p>

        <h2 className="lg-h2">5. Intellectual Property Rights</h2>
        <p className="lg-p">All copyright, designs, patent, trademarks, and other intellectual property rights ("IPR") in and to ZYOU remain the exclusive property of ZYOU. User-generated content remains your property; however, you grant ZYOU a worldwide, non-exclusive license to use and display such content for the purpose of providing the Services.</p>

        <h2 className="lg-h2">6. Data Collection &amp; Google Analytics Integration</h2>
        <p className="lg-p">Submitting your name and email is a condition to using the Services. Please review our <Link to="/privacy-policy" className="lg-link">Privacy Policy</Link> for more details.</p>

        <h3 className="lg-h3">Google Analytics Integration</h3>
        <p className="lg-p">When you connect your Google Analytics account to ZYOU, our use of information received from Google Analytics APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.</p>
        <ul className="lg-list">
          <li>We access only the data you explicitly authorize.</li>
          <li>Data is used exclusively for marketing analytics and reporting within ZYOU.</li>
          <li>We do not sell, rent, or share your Google Analytics data with third parties.</li>
          <li>You can revoke access at any time through your Google Account permissions.</li>
        </ul>
        <p className="lg-p">Email Communication: You may unsubscribe from our emails at any time. Every email from us will include a clearly visible 'unsubscribe' link.</p>

        <h2 className="lg-h2">7. Relationship of Parties</h2>
        <p className="lg-p">Nothing in these Terms shall constitute any agency, association, partnership, joint venture or employee-employer relationship between you and ZYOU.</p>

        <h2 className="lg-h2">8. Your Indemnity</h2>
        <p className="lg-p">You agree to indemnify and hold ZYOU harmless from all loss and expenses arising from your violation of these Terms, your Ads Content, or your use of third-party websites.</p>

        <h2 className="lg-h2">9. Governing Law</h2>
        <p className="lg-p">These Terms are governed by the laws of the State of Maharashtra, India, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of Pune, Maharashtra.</p>

        <h2 className="lg-h2">10. Amendments</h2>
        <p className="lg-p">ZYOU may modify these terms at any time. Changes will be notified by posting a notice on the Website or by email. Continued use of the Services after 30 days constitutes your consent to the changes.</p>

        <h2 className="lg-h2">11. Acceptable Use</h2>
        <p className="lg-p">You agree not to misuse the Services, including attempting to probe, scan, or test the vulnerability of our systems or networks.</p>

        <h2 className="lg-h2">12. Contact</h2>
        <p className="lg-p">For questions regarding these terms, please contact us at <a href="mailto:founder@zyou.ai" className="lg-link">founder@zyou.ai</a>.</p>
      </div>
    </main>
  )
}
