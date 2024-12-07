import React from "react";
import ProfileSection from "../components/ProfileSection";
import RecordsSection from "../components/RecordsSection";

const Index = () => {
  const handleImageUpload = (file: File) => {
    // Will be implemented with Supabase later
    console.log("Image uploaded:", file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-3xl py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in">
          Running Personal Record Tracker
        </h1>
        
        <ProfileSection onImageUpload={handleImageUpload} />
        <RecordsSection />
      </div>
    </div>
  );
};

export default Index;