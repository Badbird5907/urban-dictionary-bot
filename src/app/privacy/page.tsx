import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <main>
      <div className="max-w-4xl mx-auto p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-200 mb-4">Last updated: 7/16/2024</p>

        <p className="text-gray-200 mb-4">
          This Privacy Policy outlines what data we collect, how we use it, and your rights regarding your information.
        </p>

        <h2 className="text-2xl font-semibold mb-3">1. Information Collection</h2>
        <p className="text-gray-200 mb-4">
          The Urban Dictionary Discord Bot does not collect or store any personal data from users. We do not save any messages, commands, or user interactions. However, we do send API requests to urbandictionary.com to fetch definitions and other related information.
        </p>

        <h2 className="text-2xl font-semibold mb-3">2. Use of Information</h2>
        <p className="text-gray-200 mb-4">
          Since we do not collect any personal data, there is no information for us to use, store, or process. The bot functions by sending API requests to urbandictionary.com in real-time and responding to user commands without retaining any data.
        </p>

        <h2 className="text-2xl font-semibold mb-3">3. Data Sharing</h2>
        <p className="text-gray-200 mb-4">
          As no data is collected, no data is shared with any third parties.
        </p>

        <h2 className="text-2xl font-semibold mb-3">4. Security</h2>
        <p className="text-gray-200 mb-4">
          We take security seriously. Although we do not store any data, we ensure that our bot operates in a manner that prevents unauthorized access and maintains the integrity of our service.
        </p>

        <h2 className="text-2xl font-semibold mb-3">5. Changes to This Privacy Policy</h2>
        <p className="text-gray-200 mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. By continuing to use the Urban Dictionary Discord Bot after any changes, you agree to the revised Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
        <p className="text-gray-200 mb-4">
          If you have any questions or concerns about this Privacy Policy, please contact me at <a href="mailto:contact@badbird.dev" className="text-blue-500 hover:text-blue-600 hover:transition-all">contact@badbird.dev</a>.
        </p>

        <p className="text-gray-200">
          By using the Urban Dictionary Discord Bot, you acknowledge that you understand and agree to this Privacy Policy.
        </p>
        <div className="flex flex-row gap-4 pt-4 justify-center">
          <Link href="/">
            <Button>Home</Button>
          </Link>
          <Link href="/tos">
            <Button>Terms Of Service</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
export default Page;