// src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void; // ✅ nova prop
}

export const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }: SearchBarProps) => {
  return (
    <div className="searchbar" style={{ display: 'flex', alignItems: 'center' }}>
      <input 
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Buscar tarefas..."
      />
      {searchQuery && (
        <button
          onClick={onClearSearch}
        >
          ❌
        </button>
      )}
    </div>
  );
};

export default SearchBar;
