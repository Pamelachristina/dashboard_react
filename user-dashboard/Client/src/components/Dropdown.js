import React from 'react';

const Dropdown = ({ label, options, selected, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
