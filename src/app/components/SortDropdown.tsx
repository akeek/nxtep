import React from "react";

interface SortDropdownProps {
  onSort: (order: "asc" | "desc") => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
  return (
    <div className="relative inline-block">
      <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded shadow">
        Sort by Year
      </button>
      <div className="absolute mt-2 w-full bg-white border rounded shadow">
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => onSort("asc")}
        >
          Ascending
        </button>
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => onSort("desc")}
        >
          Descending
        </button>
      </div>
    </div>
  );
};
