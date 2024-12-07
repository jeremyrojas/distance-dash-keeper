import React from "react";

interface RecordEntry {
  distance: string;
  placeholder: string;
}

const RECORD_TYPES: RecordEntry[] = [
  { distance: "1 Mile", placeholder: "MM:SS" },
  { distance: "5K", placeholder: "HH:MM:SS" },
  { distance: "10K", placeholder: "HH:MM:SS" },
  { distance: "Half Marathon", placeholder: "HH:MM:SS" },
  { distance: "Full Marathon", placeholder: "HH:MM:SS" },
];

const RecordsSection = () => {
  return (
    <section className="animate-fade-in space-y-6 p-6 bg-surface rounded-lg shadow-sm mt-6">
      <h2 className="text-xl font-semibold text-center mb-6">Personal Records</h2>
      <div className="space-y-4">
        {RECORD_TYPES.map((record) => (
          <div key={record.distance} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-secondary font-medium">{record.distance}</label>
            <input
              type="text"
              placeholder={record.placeholder}
              className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Location"
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="date"
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors duration-200 font-medium">
          Save Records
        </button>
      </div>
    </section>
  );
};

export default RecordsSection;