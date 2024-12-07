import React from "react";

interface ProfileSectionProps {
  onImageUpload: (file: File) => void;
}

const ProfileSection = ({ onImageUpload }: ProfileSectionProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <section className="animate-fade-in space-y-6 p-6 bg-surface rounded-lg shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-surface-dark flex items-center justify-center overflow-hidden border-2 border-primary">
            <label htmlFor="profile-image" className="cursor-pointer w-full h-full flex items-center justify-center">
              <span className="text-secondary text-sm">Upload Photo</span>
            </label>
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
              placeholder="Name"
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <textarea
              placeholder="Bio (max 150 characters)"
              maxLength={150}
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors resize-none h-24"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;