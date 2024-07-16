import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <main>
      <div className="max-w-4xl mx-auto p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-200 mb-4">Last updated: 7/16/2024</p>

        <p className="text-gray-200 mb-4">
          Welcome to the Urban Dictionary Discord Bot! By using our bot, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-200 mb-4">
          By accessing and using the Urban Dictionary Discord Bot, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the bot.
        </p>

        <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
        <p className="text-gray-200 mb-4">
          The Urban Dictionary Discord Bot provides definitions and other related information from urbandictionary.com. The bot fetches data via API requests and delivers responses in real-time based on user commands.
        </p>

        <h2 className="text-2xl font-semibold mb-3">3. Usage Guidelines</h2>
        <p className="text-gray-200 mb-4">
          <strong>Respectful Use:</strong> Users must use the bot respectfully and not for any illegal or unauthorized purposes.<br />
          <strong>Prohibited Activities:</strong> Users must not attempt to exploit, hack, or abuse the bot in any manner. This includes spamming commands or sending malicious content.<br />
          <strong>Compliance:</strong> Users must comply with all applicable laws and regulations while using the bot.
        </p>

        <h2 className="text-2xl font-semibold mb-3">4. Data and Privacy</h2>
        <p className="text-gray-200 mb-4">
          <strong>No Data Collection:</strong> We do not collect or store any personal data from users. For more information, please refer to our Privacy Policy.<br />
          <strong>API Requests:</strong> The bot sends API requests to urbandictionary.com to fetch definitions and related information.
        </p>

        <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
        <p className="text-gray-200 mb-4">
          <strong>Content:</strong> All content provided by the Urban Dictionary Discord Bot, including definitions and other related information, is sourced from urbandictionary.com and is subject to their terms of use.<br />
          <strong>Trademarks:</strong> {"\"Urban Dictionary\""} is a trademark of Urban Dictionary, LLC. All rights reserved.
        </p>

        <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
        <p className="text-gray-200 mb-4">
          <strong>No Warranties:</strong> The service is provided {"\"as is\""} without any warranties, express or implied. We do not guarantee the accuracy or reliability of the information provided by the bot.<br />
          <strong>No Liability:</strong> In no event shall we be liable for any damages arising out of or in connection with the use of the bot.
        </p>

        <h2 className="text-2xl font-semibold mb-3">7. Changes to the Terms of Service</h2>
        <p className="text-gray-200 mb-4">
          We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page with an updated revision date. By continuing to use the bot after any changes, you agree to the revised terms.
        </p>

        <h2 className="text-2xl font-semibold mb-3">8. Termination</h2>
        <p className="text-gray-200 mb-4">
          We reserve the right to terminate or suspend access to the bot at any time, without prior notice or liability, for any reason whatsoever, including but not limited to a breach of these Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
        <p className="text-gray-200 mb-4">
          If you have any questions or concerns about these Terms of Service, please contact me at <a href="mailto:contact@badbird.dev" className="text-blue-500 hover:text-blue-600 hover:transition-all">contact@badbird.dev</a>.
        </p>

        <p className="text-gray-200">
          By using the Urban Dictionary Discord Bot, you acknowledge that you have read, understood, and agree to these Terms of Service.
        </p>
        <div className="flex flex-row gap-4 pt-4 justify-center">
          <Link href="/">
            <Button>Home</Button>
          </Link>
          <Link href="/privacy">
            <Button>Privacy Policy</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
export default Page;