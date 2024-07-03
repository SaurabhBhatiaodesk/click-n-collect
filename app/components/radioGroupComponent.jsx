import React, { useState, useEffect } from 'react';
import { RadioButton, Text } from "@shopify/polaris";

const RadioGroupComponent = ({ field, inputValues, handleconfigChange, mango, error }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [showError,setShowError]=useState(''); 

  useEffect(() => {
    // Ensure inputValues and inputValues.general are defined before accessing them
    const initialValue = inputValues?.[mango?.plugin_id]?.[field.name] || '';
    setSelectedValue(initialValue);
    if(field?.name==error?.name){
 
      setShowError("This field is Required");
    }
  }, [inputValues, field.name,error]);

  const handleChange = (value) => {
    setSelectedValue(value);
    handleconfigChange(value, field.name, mango?.plugin_id);
  };

  return (
    <>
    <div>
      <Text as="h2" variant="bodyMd">
        {field.label}
      </Text>
      {field?.options?.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          checked={selectedValue === option.value}
          id={field.id}
          name={field.name}
          value={option.value}
          onChange={() => handleChange(option.value)}
        />
      ))}
      <span style={{color:"red"}}>{showError}</span>
      </div>
    </>
  );
};

export default RadioGroupComponent;
