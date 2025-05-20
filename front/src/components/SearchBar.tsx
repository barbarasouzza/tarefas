// src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  filterTag?: string;
  onClearFilterTag?: () => void;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  filterTag,
  onClearFilterTag,
}: SearchBarProps) => {
  return (
    <div
      className="searchbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar tarefas..."
          style={{
            width: '100%',
            padding: '0.4rem 2rem 0.4rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            aria-label="Limpar busca"
            style={{
              position: 'absolute',
              right: '0.4rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            ❌
          </button>
        )}
      </div>

      {filterTag && (
        <div
          style={{
            backgroundColor: '#e0e0e0',
            padding: '0.3rem 0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span>{filterTag}</span>
          <button
            onClick={onClearFilterTag}
            aria-label="Remover filtro"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
