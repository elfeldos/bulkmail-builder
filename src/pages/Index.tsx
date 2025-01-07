import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { EmailTemplate } from "@/components/EmailTemplate";
import { SmtpConfig } from "@/components/SmtpConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Footer } from "@/components/ui/footer";

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  from: string;
}

const Index = () => {
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig | null>(null);

  const handleFileUpload = (data: Array<Record<string, string>>) => {
    setCsvData(data);
  };

  const handleTemplateChange = (subject: string, body: string) => {
    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleSendEmails = async () => {
    if (!csvData.length || !emailSubject || !emailBody || !smtpConfig) {
      toast.error(
        "Please fill in all fields and SMTP configuration before sending"
      );
      return;
    }

    toast.info("Sending emails...");

    try {
      const response = await fetch("https://bulkmailserver-jxku.onrender.com/api/send-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: csvData,
          subject: emailSubject,
          body: emailBody,
          smtp: smtpConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully sent ${csvData.length} emails`);
      } else {
        toast.error("Failed to send emails: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending emails");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-16">
            <span className="text-primary">Send</span> Bulk Emails from your <br/> Mailadress for <span className="underline">free</span>.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-20">
            Upload your CSV file with contact details, customize your email
            template, and send personalized emails to your entire list in
            seconds.
          </p>
          <div className="grid grid-cols-3 max-w-4xl mx-auto bg-primary py-4 rounded-md">
            <div>✅ for free</div>
            <div>🚫 no data storage</div>
            <div>👤 no login needed</div>
          </div>
          <div className="py-20">
            <h2 className="text-md font-semibold ">This is how it works:</h2>
            <div>1. Fill in your data</div>
            <div>2. Upload your csv with necessary data</div>
            <div>3. Write your E-Mail</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <SmtpConfig onConfigSave={setSmtpConfig} />

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">1. Upload Contacts</h2>
            <FileUpload onFileUpload={handleFileUpload} />
            {csvData.length > 0 && (
              <p className="mt-4 text-sm text-gray-600">
                ✓ Loaded {csvData.length} contacts
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              2. Create Email Template
            </h2>
            <EmailTemplate
              onTemplateChange={handleTemplateChange}
              availableVariables={csvData.length ? Object.keys(csvData[0]) : []}
            />
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleSendEmails}
              disabled={
                !csvData.length || !emailSubject || !emailBody || !smtpConfig
              }
            >
              Send Emails
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
