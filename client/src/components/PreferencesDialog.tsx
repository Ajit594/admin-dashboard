import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export function PreferencesDialog() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    emailNotifications: true,
    pushNotifications: false,
    weekStartsOn: "monday",
    dateFormat: "MM/DD/YYYY",
    autoSave: true,
  });

  const savePreferences = () => {
    // Save to localStorage
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    toast({
      title: "Preferences saved",
      description: "Your settings have been updated successfully.",
    });
    setOpen(false);
  };

  const resetPreferences = () => {
    setPreferences({
      language: "en",
      timezone: "UTC",
      emailNotifications: true,
      pushNotifications: false,
      weekStartsOn: "monday",
      dateFormat: "MM/DD/YYYY",
      autoSave: true,
    });
    toast({
      title: "Preferences reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4" />
          <span className="ml-3">Preferences</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Customize your dashboard experience and settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h4 className="text-sm font-medium mb-3">Appearance</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Dark mode</Label>
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          <Separator />

          {/* Localization */}
          <div>
            <h4 className="text-sm font-medium mb-3">Localization</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language" className="text-sm">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium mb-3">Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* General */}
          <div>
            <h4 className="text-sm font-medium mb-3">General</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-save changes</Label>
                <Switch
                  id="auto-save"
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, autoSave: checked }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="week-start" className="text-sm">Week starts on</Label>
                <Select
                  value={preferences.weekStartsOn}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, weekStartsOn: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date-format" className="text-sm">Date format</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, dateFormat: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={resetPreferences}>
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePreferences}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}