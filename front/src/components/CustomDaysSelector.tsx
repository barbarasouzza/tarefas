import React from 'react';

interface CustomDaysSelectorProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
}

const daysOfWeek = [
  { value: 'monday', label: 'Seg' },
  { value: 'tuesday', label: 'Ter' },
  { value: 'wednesday', label: 'Qua' },
  { value: 'thursday', label: 'Qui' },
  { value: 'friday', label: 'Sex' },
  { value: 'saturday', label: 'Sáb' },
  { value: 'sunday', label: 'Dom' },
];

const CustomDaysSelector: React.FC<CustomDaysSelectorProps> = ({ selectedDays, onChange }) => {
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div>
      <label><strong>Dias Personalizados:</strong></label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
        {daysOfWeek.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={selectedDays.includes(value)}
            onClick={() => toggleDay(value)}
            style={{
              padding: '5px 10px',
              backgroundColor: selectedDays.includes(value) ? '#4caf50' : '#e0e0e0',
              color: selectedDays.includes(value) ? 'white' : 'black',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomDaysSelector;
