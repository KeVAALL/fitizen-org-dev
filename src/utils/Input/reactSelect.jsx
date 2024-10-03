/* eslint-disable react/prop-types */
import { CircularProgress } from "@mui/material";
import Select, { components } from "react-select";

const customStyles = {
  // Style the container (e.g., remove border and box shadow)
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  // Style the control (the main wrapper)
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #eb6400" : "1px solid #E0E3E7",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(235, 100, 0, 0.25)" : "none",
    fontSize: "12px", // Match font size with BootstrapInput
    "&:hover": {
      border: "1px solid #eb6400", // Border color on hover
    },
  }),
  // Style the option (when not selected)
  option: (base, state) => ({
    ...base,
    display: "flex", // Use flexbox for proper layout inside options
    alignItems: "center", // Align items in the center vertically
    padding: "8px", // Adjust padding to make it consistent
    backgroundColor: state.isSelected ? "#eb6400" : "#FFFFFF", // Black for selected, white otherwise
    color: state.isSelected ? "#FFFFFF" : "#000000", // White text for selected, black otherwise
    fontSize: "12px", // Match font size with BootstrapInput
    "&:hover": {
      backgroundColor: "#f5ecd7", // Light grey on hover
      color: "#000000", // Black text on hover
    },
  }),
  // Style the single value (the selected value displayed)
  singleValue: (provided) => ({
    ...provided,
    color: "#000", // White text for selected value
    fontSize: "12px", // Match font size with BootstrapInput
  }),
  // Style the placeholder
  placeholder: (provided) => ({
    ...provided,
    color: "#000000", // Black placeholder text
    fontSize: "12px", // Match font size with BootstrapInput
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#eb6400",
    cursor: "pointer",
    "&:hover": {
      color: "#eb6400", // Black text on hover
    },
  }),
};
export const customFilterStyles = {
  // Style the container (e.g., remove border and box shadow)
  container: (provided) => ({
    ...provided,
    width: "100%",
    borderRadius: "8px",
  }),
  // Style the control (the main wrapper)
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #eb6400" : "1px solid #E0E3E7",
    borderRadius: "8px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(235, 100, 0, 0.25)" : "none",
    fontSize: "12px", // Match font size with BootstrapInput
    "&:hover": {
      border: "1px solid #eb6400", // Border color on hover
    },
  }),
  // Style the option (when not selected)
  option: (base, state) => ({
    ...base,
    display: "flex",
    backgroundColor: state.isSelected ? "#eb6400" : "#FFFFFF", // Black for selected, white otherwise
    color: state.isSelected ? "#FFFFFF" : "#000000", // White text for selected, black otherwise
    fontSize: "12px", // Match font size with BootstrapInput
    "&:hover": {
      backgroundColor: "#f5ecd7", // Light grey on hover
      color: "#000000", // Black text on hover
    },
  }),
  // Style the single value (the selected value displayed)
  singleValue: (provided) => ({
    ...provided,
    color: "#000", // White text for selected value
    fontSize: "12px", // Match font size with BootstrapInput
  }),
  // Style the placeholder
  placeholder: (provided) => ({
    ...provided,
    color: "#000000", // Black placeholder text
    fontSize: "12px", // Match font size with BootstrapInput
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#eb6400",
    cursor: "pointer",
    "&:hover": {
      color: "#eb6400", // Black text on hover
    },
  }),
};

// Custom dropdown indicator with a loading spinner
const CustomDropdownIndicator = (props) => {
  const { isLoading } = props.selectProps;

  return (
    <components.DropdownIndicator {...props}>
      {isLoading ? (
        <CircularProgress size={20} color="inherit" /> // Show spinner when loading
      ) : (
        <components.DropdownIndicator {...props} /> // Default indicator when not loading
      )}
    </components.DropdownIndicator>
  );
};

export function CustomSelect({ options, isLoading, ...props }) {
  return (
    <Select
      options={options}
      styles={customStyles}
      isLoading={isLoading} // Pass loading state to the select
      placeholder="Select an option"
      {...props}
    />
  );
}
