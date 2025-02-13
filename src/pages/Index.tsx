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
}

const Index = () => {
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleFileUpload = (data: Array<Record<string, string>>) => {
    setCsvData(data);
  };

  const handleTemplateChange = (subject: string, body: string, file?: File) => {
    setEmailSubject(subject);
    setEmailBody(body);
    if (file) setAttachment(file);
  };

  const handleSendEmails = async () => {
    if (!csvData.length || !emailSubject || !emailBody || !smtpConfig) {
      toast.error(
        "Please fill in all fields and SMTP configuration before sending"
      );
      return;
    }

    toast.info("Sending emails...");

    const formData = new FormData();
    formData.append('recipients', JSON.stringify(csvData));
    formData.append('subject', emailSubject);
    formData.append('body', emailBody);
    formData.append('smtp', JSON.stringify(smtpConfig));
    if (attachment && attachment.size <= 5 * 1024 * 1024) {
      formData.append('attachment', attachment);
    }

    console.log('Sending data:', {
      recipients: csvData,
      subject: emailSubject,
      body: emailBody,
      smtp: smtpConfig,
      attachment: attachment ? {
        name: attachment.name,
        size: attachment.size,
        type: attachment.type
      } : null
    });

    try {
      const response = await fetch("http://localhost:8080/api/send-emails", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        toast.error(`Error: ${errorData.message || 'Unknown error'}`);
        return;
      }

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
      <div className="container relative mx-auto px-4 pt-12 pb-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-16">
            <span className="text-primary">Send</span> Bulk-Emails from your <br/> Mailadress for <span className="underline">free</span>.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-20">
            Upload your CSV file with contact details, customize your email
            template, and send personalized emails to your entire list in
            seconds.
          </p>
          <div className="grid grid-cols-3 max-w-4xl mx-auto bg-white border-2 border-inline border-primary py-4 rounded-md">
            <div className="text-pretty">✅ send mails for free</div>
            <div className="text-pretty">🚫 none of your data stored</div>
            <div className="text-pretty">👤 no login needed</div>
          </div>
          <div className="py-20 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">This is how it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
              <Card className="w-auto pb-6 pt-4 px-6">
                <h1 className="text-md font-semibold py-2">1. Fill in data</h1>
                <div>Choose your Email provider, state your Email address you want to send the mails from and type in your password (This is not your regular password).</div>
              </Card>
              <Card className="w-auto pb-6 pt-4 px-6">
                <h1 className="text-md font-semibold py-2">2. Upload csv containing data</h1>
                <div>Upload your file as in the csv format containing the colum descriptions in row one. The program will extract them automatically.</div>
              </Card>
              <Card className="w-auto pb-6 pt-4 px-6">
                <h1 className="text-md font-semibold py-2">3. Write Email</h1>
                <div>Choose your subject, type in your text (click on the variable to insert it into the text) and bulk-send your Email to the contacts in your csv.</div>
              </Card>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div className="div" initial={{ opacity: 0, }} transition={{ duration: 0.5, ease: "easeIn" }} whileInView={{ opacity: 1, }} viewport={{ amount: 0.3, once: true,}}>
            <h2 className="text-xl text-center font-semibold mb-6">Let's get crackin'</h2>
            <SmtpConfig onConfigSave={setSmtpConfig} />
          </motion.div>

          <motion.div className="div" initial={{ opacity: 0, }} transition={{ duration: 0.5, ease: "easeIn" }} whileInView={{ opacity: 1, }} viewport={{ amount: 0.3, once: true,}}>
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
          
          <motion.div className="div" initial={{ opacity: 0, }} transition={{ duration: 0.5, ease: "easeIn" }} whileInView={{ opacity: 1, }} viewport={{ amount: 0.3, once: true,}}>
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
              className="text-black border-2 border-white hover:border-2 hover:border-primary hover:bg-white"
              disabled={
                !csvData.length || !emailSubject || !emailBody || !smtpConfig
              }
            >
              Send Emails
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
