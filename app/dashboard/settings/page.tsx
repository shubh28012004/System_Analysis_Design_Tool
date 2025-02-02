"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [email, setEmail] = useState("user@example.com")
  const [notifications, setNotifications] = useState(true)
  const [units, setUnits] = useState("metric")

  const handleSave = () => {
    // Here you would typically save these settings to a backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Email Notifications</Label>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="units">Preferred Units</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger id="units">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (m, kg, N)</SelectItem>
                <SelectItem value="imperial">Imperial (ft, lb, lbf)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}

