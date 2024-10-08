export const selectCustomStyle = {
  // Style the container (e.g., remove border and box shadow)
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    padding: "3.6px",
    // border: state.isFocused ? "1px solid #AFBACA" : provided.border,
    border: state.isFocused ? "1px solid #EE5636" : "1px solid #dfe3e7",
    // boxShadow: state.isFocused ? "0 0 0 1px #21B546" : provided.boxShadow,
    borderRadius: "10px",
    boxShadow: "none",
    "&:hover": {
      // borderColor: provided.borderColor,
      borderColor: state.isFocused ? "#EE5636" : provided.borderColor,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
    backgroundColor: state.isSelected ? "#EE5636" : "white",
    color: state.isSelected ? "white" : "#111111",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: state.isSelected ? "#EE5636" : "#F9FAFB",
      color: state.isSelected && "#fff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#111111",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
  }),
  input: (provided) => ({
    ...provided,
    color: "#111111",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#111111",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
    // color: "#D7DFE9",
    // height: "16px",
    // marginTop: "10px",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    ":hover": {
      color: "#EE5636", // Change this to the desired color
      cursor: "pointer",
    },
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    // color: state.isFocused ? "#EE5636" : provided.color,
    color: "#EE5636",
    cursor: "pointer",
    "&:hover": {
      color: "#EE5636",
    },
  }),
};

export const customRoundedStyles = {
  // Style the container (e.g., remove border and box shadow)
  container: (provided) => ({
    ...provided,
    width: "100%",
    height: "40px",
  }),
  // Style the control (the main wrapper)
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #eb6400" : "1px solid #BEBEBE",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(235, 100, 0, 0.25)" : "none",
    borderRadius: "24px",
    paddingLeft: "4px",
    paddingRight: "4px",
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
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
    // color: "#D7DFE9",
    // height: "16px",
    // marginTop: "10px",
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
export const disabledCustomStyle = {
  control: (provided, state) => ({
    ...provided,
    padding: "3.6px",
    backgroundColor: state.isDisabled ? "#3353d10d" : provided.backgroundColor,
    color: state.isDisabled ? "#a0a0a0" : provided.color,
    cursor: state.isDisabled ? "not-allowed" : provided.cursor,
    borderRadius: "10px",
    boxShadow: "none",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#111111" : provided.color,
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
  }),
  input: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#a0a0a0" : provided.color,
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#111111" : provided.color,
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#a0a0a0" : provided.color,
  }),
};

export const selectCustomStyle2 = {
  control: (provided, state) => ({
    ...provided,
    padding: "2px",
    border: "1px solid #AFBACA",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "#AFBACA" : provided.borderColor,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#21B546" : "white",
    color: state.isSelected ? "white" : provided.color,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: state.isSelected ? "#21B546" : "#F9FAFB",
      color: state.isSelected && "#fff",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1B1B1B", // This sets the text color of the selected value
    fontWeight: 600,
    lineHeight: "24px",
    fontSize: "14px",
    letterSpacing: "-0.2px",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
    color: "#D7DFE9",
    height: "16px",
    marginTop: "10px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...selectCustomStyle.dropdownIndicator,
    ...provided,
    cursor: "pointer",
    color: "#5E718D",
    "&:hover": {
      color: "#5E718D",
    },
  }),
};
