import React from 'react';

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon: Icon
}) => {
  return (
    <div className="mb-5">
      {label && <label className="block font-medium text-sm text-brand-dark mb-1.5">{label}</label>}
      <div className="relative flex items-center group">
        {Icon && (
          <Icon 
            className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-brand transition-colors" 
          />
        )}
        <input
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg outline-none 
                     transition-all focus:border-brand focus:ring-4 focus:ring-brand/10"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default InputField;
