import React from "react";
import { Input } from "@/components/ui/input";

type SearchPatientProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SearchPatient: React.FC<SearchPatientProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="relative w-full max-w-md">
        <Input
          id="search"
          type="text"
          placeholder="Search for a patient by name or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        />
      </div>
    </div>
  );
};


export default SearchPatient;
