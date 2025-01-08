import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    host: "",
    port: "587",
    username: "",
    password: "",
    from: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !config.host ||
      !config.port ||
      !config.username ||
      !config.password ||
      !config.from
    ) {
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
        <div>
          <Label htmlFor="from">From Email</Label>
          <Input
            id="from"
            value={config.from}
            onChange={(e) => setConfig({ ...config, from: e.target.value })}
            placeholder="your@email.com"
          />
        </div>
        <Button type="submit" className="text-black border-2 border-white hover:border-2 hover:border-primary hover:bg-white">Save SMTP Configuration</Button>
      </form>
    </Card>
  );
};
