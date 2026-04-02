import { useState, useCallback } from 'react';

/**
 * useForm Hook
 * Provides a standardized way to manage form states across the application.
 * 
 * @param {Object} initialValues - Initial values for form fields
 * @param {Function} onSubmit - Callback function to fire on form submission
 * @returns {Object} { formData, handleChange, resetForm, handleSubmit }
 */
export const useForm = (initialValues = {}, onSubmit) => {
  const [formData, setFormData] = useState(initialValues);

  // Updates form state when an input field changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Resets the form back to initial values
  const resetForm = useCallback(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // Standardized form submission wrapper
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  }, [formData, onSubmit]);

  return {
    formData,
    handleChange,
    resetForm,
    handleSubmit,
    setFormData
  };
};

export default useForm;
