import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
}

const smtpProviders = {
  gmail: {
    host: "smtp.gmail.com",
    instructions: {
      title: "Gmail SMTP Password Setup Instructions",
      steps: [
      "1. Go to https://myaccount.google.com/apppassword",
      "2. Choose name of Connection",
      "3. Use the generated 16-character password as your SMTP password"
      ]
    } 
  },
  outlook: {
    host: "smtp.office365.com",
    instructions: {
      title: "Outlook/Office 365 SMTP Password Setup Instructions",
      steps: [ 
      "1. Go to https://account.live.com/proofs/AppPassword",
      "2. Create an app password",
      "3. Use your email and the generated app password"
      ]
    }
  },
  yahoo: {
    host: "smtp.mail.yahoo.com",
    instructions: {
      title: "Yahoo Mail SMTP Password Setup Instructions",
      steps: [
      "1. Go to Yahoo Account Security settings",
      "2. Enable 2-Step Verification",
      "3. Generate an App Password",
      "4. Select 'Other App' → Enter a name",
      "5. Use the generated password for SMTP"
      ]
    }
  },
  custom: {
    host: "custom",
    instructions: {
      title: "Instructions for your individual SMTP Setup",
      steps: [
      "1. Enter your SMTP server address",
      "2. Use port 587 for TLS",
      "3. Enter your full email address",
      "4. Use your email password or app-specific password",
      "5. Contact your email provider for specific settings"
      ]
    }
  },
} as const;

const smtpConfigs: Record<SmtpProvider, SmtpMapping> = {
  gmail: {
    host: "smtp.gmail.com",
    port: "587",
    secure: false
  },
  outlook: {
    host: "smtp.office365.com",
    port: "587",
    secure: false
  },
  yahoo: {
    host: "smtp.mail.yahoo.com",
    port: "587",
    secure: false
  },
  custom: {
    host: "",
    port: "587",
    secure: false
  }
};

type SmtpProvider = keyof typeof smtpProviders;

interface SmtpConfigProps {
  onConfigSave: (config: SmtpConfig) => void;
}

interface SmtpMapping {
  host: string;
  port: string;
  secure: boolean;
}

export const SmtpConfig = ({ onConfigSave }: SmtpConfigProps) => {
  const [selectedProvider, setSelectedProvider] = useState<SmtpProvider>("gmail");
  const [customHost, setCustomHost] = useState(" ");
  const [config, setConfig] = useState<SmtpConfig>({
    host: smtpProviders.gmail.host,
    port: "587",
    username: "",
    password: "",
  });

  const handleProviderChange = (value: SmtpProvider) => {
    setSelectedProvider(value);
    if (value !== "custom") {
      setConfig({
        ...config,
        ...smtpConfigs[value]
      });
    }
  };

  const handleCustomHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHost(e.target.value);
    setConfig({
      ...config,
      host: e.target.value
    });
  };

  const isConfigValid = () => {
    return(
      config.host.length > 0 &&
      config.username.length > 0 &&
      config.password.length > 0 &&
      config.port.length > 0
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigValid()) {
      toast.error("Please fill in all SMTP fields");
      return;
    }
    onConfigSave(config);
    toast.success("SMTP configuration saved");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">1. Fill in your Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="port">SMTP Port: 587</Label>
        </div>
        <div>
          <Label htmlFor="host">E-Mail Provider</Label>
          <Select
            value={selectedProvider}
            onValueChange={(value: SmtpProvider) => handleProviderChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your email provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gmail">Gmail</SelectItem>
              <SelectItem value="outlook">Outlook/Office 365</SelectItem>
              <SelectItem value="yahoo">Yahoo Mail</SelectItem>
              <SelectItem value="custom">Custom SMTP Server</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show custom host input only when custom is selected */}
        {selectedProvider === "custom" && (
          <div className="mt-4">
            <Label htmlFor="customHost">Custom SMTP Host</Label>
            <Input
              id="customHost"
              value={customHost}
              onChange={handleCustomHostChange}
              placeholder="Enter your SMTP server address"
            />
          </div>
        )}

        <div>
          <Label htmlFor="username">E-Mail</Label>
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
            placeholder="Enter SMTP password"
          />
          <div className="mt-2 text-sm text-gray-600">
            {/* <p className="font-medium mb-1">Password Instructions:</p> */}
            <div className="space-y-2">
              
            {selectedProvider && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">
                  {smtpProviders[selectedProvider]['instructions'].title}
                </h3>
                <ul className="space-y-2">
                  {smtpProviders[selectedProvider]['instructions'].steps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SMTP Configuration fields
            {selectedProvider && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="username">Email/Username</Label>
                  <Input
                    id="username"
                    value={config.username}
                    onChange={(e) => setConfig({ ...config, username: e.target.value })}
                    placeholder={selectedProvider === 'gmail' ? 'your.email@gmail.com' : 'your.email@domain.com'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">
                    {selectedProvider === 'custom' ? 'Password' : 'App Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                </div>

                {selectedProvider === 'custom' && (
                  <div>
                    <Label htmlFor="host">SMTP Host</Label>
                    <Input
                      id="host"
                      value={config.host}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                      placeholder="smtp.yourdomain.com"
                    />
                  </div>
                )}
              </div>
            )} */}

            </div>
          </div>
        </div>
        <Button type="submit" className="text-black border-2 border-white hover:border-2 hover:border-primary hover:bg-white">Save SMTP Configuration</Button>
      </form>
    </Card>
  );
};
