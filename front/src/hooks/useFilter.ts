import { useState } from 'react';

export function useFilter() {
  const [searchQuery, setSearchQuery] = useState('');
const [recurrenceFilter, setRecurrenceFilter] = useState<string>(''); // ou null


  const clearSearch = () => setSearchQuery('');
  const clearAllFilters = () => {
    setSearchQuery('');
    setRecurrenceFilter('');
  };

  return {
    searchQuery,
    setSearchQuery,
    recurrenceFilter,
    setRecurrenceFilter,
    clearSearch,
    clearAllFilters,
  };
}
