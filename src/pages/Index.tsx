import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { EmailTemplate } from '@/components/EmailTemplate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

const Index = () => {
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleFileUpload = (data: Array<Record<string, string>>) => {
    setCsvData(data);
  };

  const handleTemplateChange = (subject: string, body: string) => {
    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleSendEmails = async () => {
    if (!csvData.length || !emailSubject || !emailBody) {
      toast.error('Please fill in all fields before sending');
      return;
    }

    // Here we'll integrate with SendGrid once the API key is provided
    toast.info('Sending emails...');
    
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success(`Test mode: Would send to ${csvData.length} recipients`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bulk Email Sender
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your CSV file with contact details, customize your email template,
            and send personalized emails to your entire list in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
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
            <h2 className="text-xl font-semibold mb-4">2. Create Email Template</h2>
            <EmailTemplate
              onTemplateChange={handleTemplateChange}
              availableVariables={csvData.length ? Object.keys(csvData[0]) : []}
            />
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleSendEmails}
              disabled={!csvData.length || !emailSubject || !emailBody}
            >
              Send Emails
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;