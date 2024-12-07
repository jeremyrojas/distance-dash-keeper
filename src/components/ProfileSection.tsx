import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSectionProps {
  onImageUpload: (file: File) => void;
  userId: string | undefined;
}

interface Profile {
  name: string;
  location: string;
  bio: string;
}

const ProfileSection = ({ onImageUpload, userId }: ProfileSectionProps) => {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    location: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, location, bio, avatar_url')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        if (data.avatar_url) {
          setPreviewUrl(data.avatar_url);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageUpload(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("No authenticated user found");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          location: profile.location,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="animate-fade-in space-y-6 p-6 bg-surface rounded-lg shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-surface-dark flex items-center justify-center overflow-hidden border-2 border-primary">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <label htmlFor="profile-image" className="cursor-pointer w-full h-full flex items-center justify-center">
                <span className="text-secondary text-sm">Upload Photo</span>
              </label>
            )}
          </div>
          <input
            type="file"
            id="profile-image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="Bio (max 150 characters)"
              maxLength={150}
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors resize-none h-24"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;