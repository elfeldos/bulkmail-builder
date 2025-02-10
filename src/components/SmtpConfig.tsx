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
  // from: string;
}

const smtpProviders = {
  gmail: "smtp.gmail.com",
  outlook: "smtp.office365.com",
  yahoo: "smtp.mail.yahoo.com",
  custom: "custom"
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
  const [customHost, setCustomHost] = useState("");
  const [config, setConfig] = useState<SmtpConfig>({
    host: "",
    port: "587",
    username: "",
    password: "",
    // from: "",
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
            <p className="font-medium mb-1">Password Instructions:</p>
            <div className="space-y-2">
              <details className="cursor-pointer">
                <summary className="font-medium">Gmail</summary>
                <ol className="pl-4 mt-1 list-decimal">
                  <li>Enable 2-Step Verification in Google Account</li>
                  <li>
                    Generate App Password at{" "}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Google App Passwords
                    </a>
                  </li>
                </ol>
              </details>

              <details className="cursor-pointer">
                <summary className="font-medium">Outlook/Office 365</summary>
                <ol className="pl-4 mt-1 list-decimal">
                  <li>Enable 2-Step Verification in Microsoft Account</li>
                  <li>
                    Generate App Password at{" "}
                    <a
                      href="https://account.live.com/proofs/AppPassword"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Microsoft Security
                    </a>
                  </li>
                </ol>
              </details>

              <details className="cursor-pointer">
                <summary className="font-medium">Yahoo Mail</summary>
                <ol className="pl-4 mt-1 list-decimal">
                  <li>Enable 2-Step Verification in Yahoo Account</li>
                  <li>Generate App Password in Account Security settings</li>
                </ol>
              </details>

              <details className="cursor-pointer">
                <summary className="font-medium">Custom SMTP Server</summary>
                <p className="pl-4 mt-1">
                  Use the SMTP password provided by your email service provider
                </p>
              </details>
            </div>
          </div>
        </div>
        <Button type="submit" className="text-black border-2 border-white hover:border-2 hover:border-primary hover:bg-white">Save SMTP Configuration</Button>
      </form>
    </Card>
  );
};
