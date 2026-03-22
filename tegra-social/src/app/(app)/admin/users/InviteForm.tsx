"use client";

import { useState } from "react";
import { sendInvite } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await sendInvite(email, name);

    setLoading(false);

    if (result.success) {
      toast.success(`Invite sent to ${email}`);
      setEmail("");
      setName("");
    } else {
      toast.error(result.error ?? "Failed to send invite");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invite-name">Full name</Label>
          <Input
            id="invite-name"
            type="text"
            placeholder="Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-email">Work email</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="priya@roanuz.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading || !email || !name}>
        {loading ? "Sending…" : "Send Invite"}
      </Button>
    </form>
  );
}
