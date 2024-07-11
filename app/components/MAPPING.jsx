import React, { useState, useEffect, useCallback } from 'react';
import { LegacyCard,Card, Checkbox, Select } from "@shopify/polaris";

const MAPPING = ({ mapping, plugin, preference, token, setNotificationMessage ,preferenceActiveTab , mappings }) => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState();
  const [selectValue, setSelectValue] = useState();
  const [checked, setChecked] = useState(false);
  const [plugin2, setPlugin2] = useState();
  const [selectedValue, setSelectedValue] = useState('');
  let field = {};


  console.log("it is running................................................................")

  const handleChange = useCallback(
    (id) => {
      setChecked((prevChecked) => ({
        ...prevChecked,
        [id]: !prevChecked[id], // Toggle checkbox state for the given id
      }));
    },
    [],
  );

  const pref = preference.form.slice(1, 2)[0].options;
  const opt = { [pref[0].value]: pref[0].label, [pref[1].value]: pref[1].label };
  const checkboxHeader = opt[plugin];

  useEffect(() => {
    
      if(mappings?.selected){
      Object.entries(mappings?.selected).reduce((acc, [key, value]) => {
        handleChange(key);
        console.log(mappings?.mapping?.[key]?.[plugin],"full",mappings?.[key],"half",plugin,"plugin")
        handleSelectChange(key,mappings?.mapping?.[key]?.[plugin]);
      
        //console.log("key=>",key,"value=>", value);
      }, {});
      }
    console.log('under Mapping ',mapping);
    setValue(mapping?.[plugin]);
    pref.filter((p) => p.value !== plugin).map((get) => {
      setSelectValue(mapping?.[get.value]);
      setPlugin2(get.label);
    });
  }, [mapping, plugin]);

  field.options = [{ label: "Select Value", value: "" }];
  selectValue?.map((v) => {
    field.label = `[${plugin2}]`;
    field.name = `${v.id}`;
    field.options.push({ label: v.name, value: v.id });
  });

  const handleSelectChange = (id, selectedOption) => {
    setSelectedValue((prevSelectedValue) => ({
      ...prevSelectedValue,
      [id]: selectedOption,
    }));
  };

  const handleMapping = () => {

    const formattedValues = Object.entries(selectedValue).reduce((acc, [key, value]) => {
     
      acc[key] = { [plugin]: value };
      return acc;
    }, {});

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(formattedValues);



    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };



    fetch(`https://main.dev.saasintegrator.online/api/v1/${preferenceActiveTab}/save-mapping`, requestOptions)
      .then((response) => response.text())
      .then((result) => {console.log("mapping result ;;;===>",result)``
        setNotificationMessage("Mapping saved successfully");
      })
      .catch((error) => console.error(error));
      }

  // flex style object
  const flexStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%"
  }
  return (
    <>
    {value?.length >0 && (
      <LegacyCard title="Mapping" sectioned primaryFooterAction={{ content: 'Save Mapping', onAction: () => handleMapping() }}>
      <Card title="configform">
        <div
          style={flexStyle}
        >
          {value?.map((v) => (
            <div key={v.id} style={{ width: "48%" }}>
              <Checkbox
                label={`${v.name} [${checkboxHeader}]`}
                checked={checked[v.id] || false}
                onChange={() => handleChange(v.id)}
              />
              <Select
                name={`${field.name}:${v.id}`}
                label={`${field.label}`}
                options={field.options}
                onChange={(selectedOption) => handleSelectChange(v.id, selectedOption)}
                value={selectedValue[v.id]}
                disabled={!checked[v.id]}
              />
            </div>
          ))}
        </div>
        </Card>
      </LegacyCard>
      )}
    </>
  );
};

export default MAPPING;
