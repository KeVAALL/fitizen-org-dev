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
