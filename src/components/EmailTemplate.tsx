import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // const insertVariable = (variable: string) => {
  //   const textArea = document.getElementById('emailBody') as HTMLTextAreaElement;
  //   const start = textArea.selectionStart;
  //   const end = textArea.selectionEnd;
  //   const newBody = body.substring(0, start) + `{{${variable}}}` + body.substring(end);
  //   handleBodyChange(newBody);
  // };
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

  // return (
  //   <div className="space-y-4">
  //     <div>
  //       <Label htmlFor="subject">Email Subject</Label>
  //       <Input
  //         id="subject"
  //         value={subject}
  //         onChange={(e) => handleSubjectChange(e.target.value)}
  //         placeholder="Enter email subject..."
  //         className="mt-1"
  //       />
  //     </div>
      
  //     <div>
  //       <Label htmlFor="emailBody">Email Body</Label>
  //       <Textarea
  //         id="emailBody"
  //         value={body}
  //         onChange={(e) => handleBodyChange(e.target.value)}
  //         placeholder="Enter email body..."
  //         className="mt-1 min-h-[200px]"
  //       />
  //     </div>

  //     <div>
  //       <Label>Available Variables</Label>
  //       <div className="flex flex-wrap gap-2 mt-2">
  //         {availableVariables.map((variable) => (
  //           <Button
  //             key={variable}
  //             variant="outline"
  //             size="sm"
  //             onClick={() => insertVariable(variable)}
  //           >
  //             {variable}
  //           </Button>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
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
    </div>
  );
};