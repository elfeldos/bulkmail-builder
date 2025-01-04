import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  from: string;
}

interface SmtpConfigProps {
  onConfigSave: (config: SmtpConfig) => void;
}

export const SmtpConfig = ({ onConfigSave }: SmtpConfigProps) => {
  const [config, setConfig] = useState<SmtpConfig>({
    host: '',
    port: '587',
    username: '',
    password: '',
    from: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.host || !config.port || !config.username || !config.password || !config.from) {
      toast.error('Please fill in all SMTP fields');
      return;
    }
    onConfigSave(config);
    toast.success('SMTP configuration saved');
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">SMTP Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="host">SMTP Host</Label>
          <Input
            id="host"
            value={config.host}
            onChange={(e) => setConfig({ ...config, host: e.target.value })}
            placeholder="smtp.gmail.com"
          />
        </div>
        <div>
          <Label htmlFor="port">SMTP Port</Label>
          <Input
            id="port"
            value={config.port}
            onChange={(e) => setConfig({ ...config, port: e.target.value })}
            placeholder="587"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            placeholder="Your SMTP password or app-specific password"
          />
        </div>
        <div>
          <Label htmlFor="from">From Email</Label>
          <Input
            id="from"
            value={config.from}
            onChange={(e) => setConfig({ ...config, from: e.target.value })}
            placeholder="your@email.com"
          />
        </div>
        <Button type="submit">Save SMTP Configuration</Button>
      </form>
    </Card>
  );
}; 