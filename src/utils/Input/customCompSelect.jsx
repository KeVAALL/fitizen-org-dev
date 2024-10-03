/* eslint-disable react/prop-types */
import React from "react";
import Select, { components } from "react-select";
import appleIcon from "../../assets/img/app-store.png";
import appleIconWhite from "../../assets/img/app-store-white.png";

const customStyles = {
  // Style the container (e.g., remove border and box shadow)
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  // Style the control (the main wrapper)
  control: (provided) => ({
    ...provided,
    border: "1px solid #9e9e9e", // Set border color
    boxShadow: "none", // Remove box shadow
    fontSize: "12px", // Match font size with BootstrapInput
    "&:hover": {
      border: "1px solid #9e9e9e", // Border color on hover
    },
  }),
  // Style the option (when not selected)
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#000000" : "#FFFFFF", // Black for selected, white otherwise
    color: state.isSelected ? "#FFFFFF" : "#000000", // White text for selected, black otherwise
    fontSize: "12px", // Match font size with BootstrapInput
    "&:hover": {
      backgroundColor: "#f5f5f5", // Light grey on hover
      color: "#000000", // Black text on hover
    },
  }),
  // Style the single value (the selected value displayed)
  singleValue: (provided) => ({
    ...provided,
    color: "#000000", // White text for selected value
    fontSize: "12px", // Match font size with BootstrapInput
  }),
  // Style the placeholder
  placeholder: (provided) => ({
    ...provided,
    color: "#000000", // Black placeholder text
    fontSize: "12px", // Match font size with BootstrapInput
  }),
};

export function CustomComponentSelect({ options, ...props }) {
  console.log(props);
  return (
    <Select
      options={options}
      styles={customStyles}
      placeholder="Select an option"
      components={{
        Option: ({ data, isSelected, ...props }) => (
          <components.Option {...props}>
            <img
              //   src={isSelected ? appleIconWhite : appleIcon}
              src={appleIcon}
              style={{
                marginRight: "8px",
                height: "20px",
                width: "20px",
              }}
            />
            <span style={{ marginLeft: "8px" }}>{data.label}</span>
          </components.Option>
        ),
      }}
      {...props}
    />
  );
}
