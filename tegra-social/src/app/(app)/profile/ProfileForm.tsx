"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profile";
import { UploadButton } from "@/utils/uploadthing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string | null;
  country: string | null;
  image: string | null;
  photoUrl: string | null;
  bio: string | null;
  interests: string[] | null;
  funFact: string | null;
  favouriteFood: string | null;
  favouriteSport: string | null;
}

interface ProfileFormProps {
  profileData: ProfileData | null;
  isSetup?: boolean;
}

export function ProfileForm({ profileData, isSetup = false }: ProfileFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    profileData?.photoUrl ?? profileData?.image ?? null
  );
  const [isPending, setIsPending] = useState(false);

  const initials = profileData?.name
    ? profileData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const interestsDefaultValue = (profileData?.interests ?? []).join(", ");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile saved!");
        if (isSetup) {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      toast.error("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {/* Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Photo</CardTitle>
          <CardDescription>
            Upload a photo so your colleagues can recognise you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20 text-lg">
            <AvatarImage src={photoUrl ?? undefined} alt={profileData?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <UploadButton
              endpoint="profilePhoto"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.ufsUrl ?? res?.[0]?.url;
                if (url) {
                  setPhotoUrl(url);
                  toast.success("Photo uploaded!");
                }
              }}
              onUploadError={(error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              appearance={{
                button:
                  "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md px-4 py-2 text-sm font-medium",
                allowedContent: "text-xs text-zinc-500 dark:text-zinc-400",
              }}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Images up to 4 MB. JPG, PNG, GIF, WEBP.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={profileData?.name ?? ""}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                name="role"
                defaultValue={profileData?.role ?? ""}
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              name="country"
              defaultValue={profileData?.country ?? ""}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
            >
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="Iceland">Iceland</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profileData?.bio ?? ""}
              placeholder="Tell your colleagues a bit about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Fun Facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personality & Interests</CardTitle>
          <CardDescription>
            Help your colleagues find common ground with you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interests">
              Interests{" "}
              <span className="text-zinc-400 dark:text-zinc-500 font-normal text-xs">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="interests"
              name="interests"
              defaultValue={interestsDefaultValue}
              placeholder="e.g. hiking, chess, cooking"
            />
            {interestsDefaultValue && (
              <div className="flex flex-wrap gap-1 pt-1">
                {(profileData?.interests ?? []).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="funFact">Fun Fact</Label>
            <Input
              id="funFact"
              name="funFact"
              defaultValue={profileData?.funFact ?? ""}
              placeholder="Something surprising about you..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="favouriteFood">Favourite Food</Label>
              <Input
                id="favouriteFood"
                name="favouriteFood"
                defaultValue={profileData?.favouriteFood ?? ""}
                placeholder="e.g. Dosa, Skyr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favouriteSport">Favourite Sport</Label>
              <Input
                id="favouriteSport"
                name="favouriteSport"
                defaultValue={profileData?.favouriteSport ?? ""}
                placeholder="e.g. Cricket, Football"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : isSetup ? "Complete Setup" : "Save Profile"}
      </Button>
    </form>
  );
}
