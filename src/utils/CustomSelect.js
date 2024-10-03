import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncCreatableSelect from "react-select/async-creatable";
import Select, { components } from "react-select";

import "./util.css";
import DivLoader from "./DivLoader";

const CustomOption = (props) => {
  const { data, innerProps, isSelected, isFocused } = props;
  const [isHovered, setIsHovered] = useState(false);
  const isFirstOption = data.id === 0;
  console.log(data);

  const firstOptionStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
    padding: "12px 12px",
    backgroundColor: isHovered || isFocused ? "#FEEFEC" : "transparent",
  };
  const OptionStyles = {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.02em",
    padding: "12px 12px",
    cursor: "pointer",
    // backgroundColor: isSelected
    //   ? "#FEEFEC"
    //   : isHovered
    //   ? "#FEEFEC"
    //     : "transparent",
    backgroundColor: isHovered || isFocused ? "#FEEFEC" : "transparent",
  };

  return isFirstOption ? (
    <div {...innerProps} style={firstOptionStyle}>
      <div
        style={{
          background: "#FEEFEC",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "6px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <i className="fas fa-map-marker-alt text-primary text-20"></i>
      </div>
      <span className="label pl-15">{data.label}</span>
    </div>
  ) : (
    <div
      {...innerProps}
      style={OptionStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* {data.label} */}
      <div
        style={{
          background: "#FEEFEC",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "6px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <i className="fas fa-map-marker-alt text-primary text-20"></i>
      </div>
      <span className="label pl-15">{data.label}</span>
    </div>
  );
};

const CustomDropdownIndicator = (props) => {
  const { innerProps, selected } = props;
  let navigate = useNavigate();

  return (
    <div
      {...innerProps}
      className="absolute d-flex items-center justify-center h-full single-field bg-primary text-white input-btn"
      style={{ cursor: "pointer" }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <i
        className="fas fa-search text-14 px-15"
        onClick={() => {
          console.log(selected);
          const searchData = { search: selected?.label ?? "" };
          navigate("/event/list", { state: searchData });
        }}
      ></i>
    </div>
  );
};
// Custom Loading Indicator
const CustomLoadingIndicator = (props) => {
  const { innerProps } = props;
  return (
    <components.LoadingIndicator {...props}>
      <div class="ring-preloader-3">
        <div class="spinner-ring-3"></div>
      </div>
    </components.LoadingIndicator>
  );
};
// Custom clear indicator component
const CustomClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <i className="fas fa-plus" style={{ transform: "rotate(45deg)" }}></i>
    </components.ClearIndicator>
  );
};

const CustomSelect = ({ options, ...rest }) => {
  const [selected, setSelected] = useState(null);
  const [inputFieldValue, setInputFieldValue] = useState("");
  const selectRef = useRef(null);
  const navigate = useNavigate();

  const handleFocus = (e) => {
    console.log(e);
    console.log(selectRef?.current?.props?.value?.label?.length);
    if (selectRef.current) {
      console.log(selectRef.current.inputRef);
      const input = selectRef.current.inputRef;
      const inputLength = selectRef?.current?.props?.value?.label?.length;
      input.setSelectionRange(inputLength, inputLength); // Set cursor position to start
    }
  };
  const filterColors = (inputValue) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const fetchOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      position: "relative",
      width: "370px",
      // height: '37px',
      borderRadius: "32px",
      paddingLeft: "12px",
      fontSize: "15px",
      letterSpacing: "0.02em",
      transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
      fontWeight: 500,
      color: "#111111",
      //   border: "2px solid",
      borderColor: state.isFocused ? "black" : provided.borderColor,
      boxShadow: state.isFocused ? null : provided.boxShadow,
      "&:hover": {
        borderColor: "black",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid #ccc",
      color: state.isSelected ? "#fff" : "#000",
      padding: "10px",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: "0.02em",
      backgroundColor: state.isFocused ? "#f0f0f0" : "transparent", // Example: Change background on focus
      cursor: "pointer",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: "#111111",
      //   color: state.selectProps.menuIsOpen ? "transparent" : base.color,
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: "0.02em",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0px",
      borderRadius: "8px",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      position: "absolute",
      color: state.isDisabled ? "#111111" : "#BBBBB7",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: "0.02em",
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      position: "absolute",
      right: "45px",
      cursor: "pointer",
      color: provided.color,
      fontWeight: 500,
      "&:hover": {
        color: "#f05736",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }), // Hide the separator
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: 0,
      cursor: "pointer",
    }),
  };
  return (
    <AsyncCreatableSelect
      {...rest}
      ref={selectRef}
      loadOptions={fetchOptions}
      // cacheOptions
      // defaultOptions
      components={{
        Option: (props) => <CustomOption {...props} />,
        DropdownIndicator: (props) => (
          <CustomDropdownIndicator selected={selected} {...props} />
        ),
        LoadingIndicator: CustomLoadingIndicator,
        ClearIndicator: (props) => <CustomClearIndicator {...props} />,
      }}
      formatCreateLabel={(inputValue) => `Search '${inputValue}'`}
      styles={customStyles}
      noOptionsMessage={() => (inputFieldValue ? "No options" : null)}
      value={selected}
      isSearchable
      onChange={(e) => {
        setSelected(e);
        const searchData = { search: e?.label ?? "" };
        navigate("/event/list", { state: searchData });
        // setInputValue(e?.label);
      }}
      onFocus={(e) => {
        // setInputFieldValue(selectRef?.current?.props?.value?.label);
        handleFocus(e);
      }}
      // menuIsOpen
      inputValue={inputFieldValue}
      onInputChange={(newValue) => {
        console.log(newValue);
        setInputFieldValue(newValue);
      }}
    />
    // <Select
    //   {...rest}
    //   ref={selectRef}
    //   options={options}
    //   components={{
    //     Option: (props) => <CustomOption {...props} />,
    //     DropdownIndicator: (props) => (
    //       <CustomDropdownIndicator selected={selected} {...props} />
    //     ),
    //     ClearIndicator: (props) => <CustomClearIndicator {...props} />,
    //   }}
    //   styles={customStyles}
    //   value={selected}
    //   isSearchable
    //   isClearable
    //   onChange={(e) => {
    //     console.log(e);
    //     setSelected(e);
    //   }}
    //   onFocus={handleFocus}
    //   menuIsOpen
    //   //   classNamePrefix="react-select"
    // />
  );
};

export default CustomSelect;

// option: (provided, state) => ({
//     ...provided,
//     borderBottom: "1px solid #ccc",
//     color: state.isSelected ? "#fff" : "#000",
//     padding: "10px",
//     fontSize: "13px",
//     fontWeight: 500,
//     letterSpacing: "0.02em",
//       ":first-of-type": {
//         backgroundColor: "#f0f0f0", // Style for the first option
//       },
//       ".custom-first-option": {
//         display: "flex",
//         alignItems: "center",
//         padding: "10px",
//       },
//       ".icon": {
//         // Styles for the icon
//       },
//       ".label": {
//         // Styles for the label
//       },
//   }),
