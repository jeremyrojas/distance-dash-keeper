import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RecordEntry {
  distance: string;
  placeholder: string;
}

interface PersonalRecord {
  id?: string;
  distance: string;
  time: string;
  race_location: string;
  date_achieved: string;
}

const RECORD_TYPES: RecordEntry[] = [
  { distance: "1 Mile", placeholder: "MM:SS" },
  { distance: "5K", placeholder: "HH:MM:SS" },
  { distance: "10K", placeholder: "HH:MM:SS" },
  { distance: "Half Marathon", placeholder: "HH:MM:SS" },
  { distance: "Full Marathon", placeholder: "HH:MM:SS" },
];

interface RecordsSectionProps {
  userId: string | undefined;
}

const RecordsSection = ({ userId }: RecordsSectionProps) => {
  const [records, setRecords] = useState<Record<string, PersonalRecord>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      loadRecords();
    }
  }, [userId]);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const recordsMap: Record<string, PersonalRecord> = {};
      data?.forEach(record => {
        recordsMap[record.distance] = record;
      });
      setRecords(recordsMap);
    } catch (error) {
      console.error("Error loading records:", error);
    }
  };

  const handleInputChange = (distance: string, field: keyof PersonalRecord, value: string) => {
    setRecords(prev => ({
      ...prev,
      [distance]: {
        ...prev[distance],
        distance,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("No authenticated user found");
      return;
    }

    setSaving(true);
    try {
      const recordsToSave = Object.values(records).filter(record => 
        record.time && record.distance // Only save records with at least time and distance
      );

      for (const record of recordsToSave) {
        const { error } = await supabase
          .from('personal_records')
          .upsert({
            ...record,
            user_id: userId,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'distance,user_id'
          });

        if (error) throw error;
      }

      console.log("Records saved successfully");
      await loadRecords(); // Reload records to get the latest data
    } catch (error) {
      console.error("Error saving records:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="animate-fade-in space-y-6 p-6 bg-surface rounded-lg shadow-sm mt-6">
      <h2 className="text-xl font-semibold text-center mb-6">Personal Records</h2>
      <div className="space-y-4">
        {RECORD_TYPES.map((record) => (
          <div key={record.distance} className="grid grid-cols-1 md:grid-cols-[1fr,2fr,2fr] gap-4 items-center">
            <label className="text-secondary font-medium">{record.distance}</label>
            <input
              type="text"
              placeholder={record.placeholder}
              value={records[record.distance]?.time || ''}
              onChange={(e) => handleInputChange(record.distance, 'time', e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Location"
                value={records[record.distance]?.race_location || ''}
                onChange={(e) => handleInputChange(record.distance, 'race_location', e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="date"
                value={records[record.distance]?.date_achieved || ''}
                onChange={(e) => handleInputChange(record.distance, 'date_achieved', e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors duration-200 font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Records'}
        </button>
      </div>
    </section>
  );
};

export default RecordsSection;