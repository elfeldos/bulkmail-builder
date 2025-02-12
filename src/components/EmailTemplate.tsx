import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface EmailTemplateProps {
  onTemplateChange: (subject: string, body: string, attachment?: File ) => void;
  availableVariables: string[];
}

export const EmailTemplate = ({ onTemplateChange, availableVariables }: EmailTemplateProps) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 5 MB');
        e.target.value = ''; 
        return;
      }
      setAttachment(file);
      onTemplateChange(subject, body, file);
    }
  };

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    onTemplateChange(value, body);
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    onTemplateChange(subject, value);
  };

  const insertVariable = (variable: string, field: 'subject' | 'body') => {
    if (field === 'subject') {
      const input = document.getElementById('subject') as HTMLInputElement;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = 
        subject.substring(0, start) + 
        `{{${variable}}}` + 
        subject.substring(end);
      handleSubjectChange(newValue);
    } else {
      const textarea = document.getElementById('emailBody') as HTMLTextAreaElement;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newValue = 
        body.substring(0, start) + 
        `{{${variable}}}` + 
        body.substring(end);
      handleBodyChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="subject">Email Subject</Label>
        <div className="flex gap-2">
          <Input
            id="subject"
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            placeholder="Enter email subject..."
            className="flex-1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Insert Variable
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableVariables.map((variable) => (
                <DropdownMenuItem
                  key={variable}
                  onClick={() => insertVariable(variable, 'subject')}
                >
                  {variable}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <Label htmlFor="emailBody">Email Body</Label>
        <div className="relative">
          <Textarea
            id="emailBody"
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder="Enter email body..."
            className="min-h-[200px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="absolute right-2 top-2"
              >
                Insert Variable
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableVariables.map((variable) => (
                <DropdownMenuItem
                  key={variable}
                  onClick={() => insertVariable(variable, 'body')}
                >
                  {variable}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <Label htmlFor="attachment">Attachment (Optional, max 5MB)</Label>
        {!attachment ? (
          <Input
              id="attachment"
              type="file"
              onChange={handleAttachmentChange}
              className="mt-2"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              max-size="5242880"
          />
        ) : (
          <Alert className="mt-2">
            <div className="flex items-center justify-between">
              <div>
                {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)}MB)
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAttachment(null);
                  onTemplateChange(subject, body, undefined);
                }}
              >
                Remove File
              </Button>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};