import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailTemplateProps {
  onTemplateChange: (subject: string, body: string) => void;
  availableVariables: string[];
}

export const EmailTemplate = ({ onTemplateChange, availableVariables }: EmailTemplateProps) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    onTemplateChange(value, body);
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    onTemplateChange(subject, value);
  };

  const insertVariable = (variable: string) => {
    const textArea = document.getElementById('emailBody') as HTMLTextAreaElement;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const newBody = body.substring(0, start) + `{{${variable}}}` + body.substring(end);
    handleBodyChange(newBody);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="subject">Email Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          placeholder="Enter email subject..."
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="emailBody">Email Body</Label>
        <Textarea
          id="emailBody"
          value={body}
          onChange={(e) => handleBodyChange(e.target.value)}
          placeholder="Enter email body..."
          className="mt-1 min-h-[200px]"
        />
      </div>

      <div>
        <Label>Available Variables</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableVariables.map((variable) => (
            <Button
              key={variable}
              variant="outline"
              size="sm"
              onClick={() => insertVariable(variable)}
            >
              {variable}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};