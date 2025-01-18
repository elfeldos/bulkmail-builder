import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { EmailTemplate } from "@/components/EmailTemplate";
import { SmtpConfig } from "@/components/SmtpConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Footer } from "@/components/ui/footer";
import { motion } from "motion/react";

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
    <div className="min-h-screen bg-frederik relative">
      <div className="absolute inset-0 bg-frederik">
        <div className="absolute inset-0 bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" 
             style={{
               backgroundImage: `linear-gradient(to right, #e5e8ec 1px, transparent 1px),
                               linear-gradient(to bottom, #e5e8ec 1px, transparent 1px)`
             }}>
        </div>
      </div>
      <div className="container relative mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-16">
            <span className="text-primary">Send</span> Bulk Emails from your <br/> Mailadress for <span className="underline">free</span>.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-20">
            Upload your CSV file with contact details, customize your email
            template, and send personalized emails to your entire list in
            seconds.
          </p>
          <div className="grid grid-cols-3 max-w-4xl mx-auto bg-white border-2 border-primary py-4 rounded-md">
            <div>✅ for free</div>
            <div>🚫 no data storage</div>
            <div>👤 no login needed</div>
          </div>
          <div className="py-20 max-w-4xl mx-auto grid-auto-rows">
            <h2 className="text-xl font-semibold mb-6">This is how it works</h2>
            <div className="grid grid-cols-3 gap-4"> 
            <Card className="w-auto p-6">
              <h1 className="text-md font-semibold py-2">1. Fill in data</h1>
              <div>Choose your Email provider, state your Email address you want to send the mails from and type in your password (This is not your regular password).</div>
            </Card>
            <Card className="w-auto p-6">
              <h1 className="text-md font-semibold py-2">2. Upload csv containing data</h1>
              <div>Upload your file as in the csv format containing the colum descriptions in row one. The program will extract them automatically.</div>
            </Card>
            <Card className="w-auto p-6">
              <h1 className="text-md font-semibold py-2">3. Write Email</h1>
              <div>Choose your subject, type in your text (click on the variable to insert it into the text) and bulk-send your Email to the contacts in your csv.</div>
            </Card>
              
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div className="div" initial={{ opacity: 0, }} transition={{ duration: 0.5, ease: "easeIn" }} whileInView={{ opacity: 1, }} viewport={{ margin: "-200px", once: true,}}>
            <h2 className="text-xl text-center font-semibold mb-6">Let's get crackin'</h2>
            <SmtpConfig onConfigSave={setSmtpConfig} />
          </motion.div>

          <motion.div className="div" initial={{ opacity: 0, }} transition={{ duration: 0.5, ease: "easeIn" }} whileInView={{ opacity: 1, }} viewport={{ margin: "-200px", once: true,}}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">2. Upload your csv file</h2>
              <FileUpload onFileUpload={handleFileUpload} />
              {csvData.length > 0 && (
                <p className="mt-4 text-sm text-gray-600">
                  ✓ Loaded {csvData.length} contacts
                </p>
              )}
            </Card>
          </motion.div>
          
          <motion.div className="div" initial={{ opacity: 0, }} transition={{ duration: 0.5, ease: "easeIn" }} whileInView={{ opacity: 1, }} viewport={{ margin: "-200px", once: true,}}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                3. Configure and send your mail 
              </h2>
              <EmailTemplate
                onTemplateChange={handleTemplateChange}
                availableVariables={csvData.length ? Object.keys(csvData[0]) : []}
              />
            </Card>
          </motion.div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleSendEmails}
              className="text-black border-2 border-white ghover:border-2 hover:border-primary hover:bg-white"
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
