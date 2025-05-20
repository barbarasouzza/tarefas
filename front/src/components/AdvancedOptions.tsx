import React from "react";

interface AdvancedOptionsProps {
  next_due_date?: string;
  reminder_time?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  next_due_date,
  reminder_time,
  handleChange,
}) => {
  return (
    <>
      <div>
        <label htmlFor="next_due_date">Data do lembrete</label>
        <input
          type="date"
          id="next_due_date"
          name="next_due_date"
          value={next_due_date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="reminder_time">Hora do lembrete</label>
        <input
          type="time"
          id="reminder_time"
          name="reminder_time"
          value={reminder_time}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default AdvancedOptions;
