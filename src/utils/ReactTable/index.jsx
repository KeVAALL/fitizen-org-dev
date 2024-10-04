import PropTypes from "prop-types";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  // Select,
  Stack,
  Tooltip,
  Typography,
  Pagination as MuiPagination,
  InputAdornment,
  IconButton,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import { Select as MUISelect } from "@mui/material";
import { Autocomplete, TextField, Checkbox, Chip } from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { BootstrapInput } from "../Input/textfield";
import { matchSorter } from "match-sorter";
import { customFilterStyles, CustomSelect } from "../Input/reactSelect";
import Select, { components } from "react-select";

// third-party
// import { CSVLink } from "react-csv";
// import { BootstrapInput } from "../Input/textfield";
// import { matchSorter } from "match-sorter";

// assets
export function GlobalFilter({ globalFilter, setGlobalFilter, ...props }) {
  return (
    // <FormControl variant="standard" fullWidth>
    //   <InputLabel
    //     shrink
    //     htmlFor="global"
    //     className="input-label"
    //     sx={{ display: "flex", alignItems: "center" }}
    //   >
    //     <Typography variant="body1" className="input-label">
    //       Search Records
    //     </Typography>
    //     <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
    //   </InputLabel>
    <BootstrapInput
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder="Search"
      id="global"
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            style={{ color: "#f05736" }}
          >
            <SearchOutlinedIcon fontSize="small" color="text.greyLight" />
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
    // <div class="form-control">
    //   <input
    //     value={globalFilter || ""}
    //     onChange={(e) => setGlobalFilter(e.target.value || undefined)}
    //     type="text"
    //     class="form-control"
    //     placeholder="Search"
    //     id="global"
    //     name="bibvenue"
    //     {...props}
    //   />
    // </div>
    // </FormControl>
  );
}

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
};

export function DefaultColumnFilter({
  column: { filterValue, Header, setFilter },
}) {
  return (
    <BootstrapInput
      fullWidth
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      // endAdornment={
      //   <InputAdornment position="end">
      //     <IconButton
      //       aria-label="toggle password visibility"
      //       edge="end"
      //       style={{ color: "#f05736" }}
      //     >
      //       <SearchOutlinedIcon fontSize="small" color="text.greyLight" />
      //     </IconButton>
      //   </InputAdornment>
      // }
      placeholder={Header}
      size="small"
    />
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  Header: PropTypes.string,
  filterValue: PropTypes.object,
  setFilter: PropTypes.func,
};

const Option = (props) => {
  return (
    <div
      style={{
        display: "flex", // Use flexbox to align checkbox and label
        alignItems: "center", // Vertically center the checkbox and label
        padding: "8px", // Adjust padding to match other options
      }}
    >
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected} // Check if the option is selected
          onChange={() => null} // No need for onChange as react-select handles it
          style={{
            marginRight: "8px", // Add some space between checkbox and label
            width: "15%",
          }}
        />
        <label>{props.label}</label> {/* Display the option label */}
      </components.Option>
    </div>
  );
};

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // const options = useMemo(() => {
  //   const uniqueOptions = new Set();
  //   preFilteredRows.forEach((row) => {
  //     uniqueOptions.add(row.values[id]); // Extract the value for the filter
  //   });
  //   return [...uniqueOptions].map((option) => ({
  //     label: option, // label to show in react-select
  //     value: option, // value to filter by
  //   }));
  // }, [id, preFilteredRows]);
  // const options = useMemo(() => {
  //   const uniqueOptions = new Set();
  //   preFilteredRows.forEach((row) => {
  //     uniqueOptions.add(row.values[id]); // Extract the value for the filter
  //   });
  //   return [...uniqueOptions].map((option) => ({
  //     label: option, // Label to show in react-select
  //     value: option, // Value to filter by
  //   }));
  // }, [id, preFilteredRows]);
  // Generate unique options for the filter
  const options = useMemo(() => {
    const uniqueOptions = new Set();
    preFilteredRows.forEach((row) => {
      uniqueOptions.add(row.values[id]);
    });
    return [...uniqueOptions].map((option) => ({
      label: option,
      value: option,
    }));
  }, [id, preFilteredRows]);

  const handleChange = (event, selectedOptions) => {
    // Map selected options to their values and set the filter
    const values = selectedOptions.map((opt) => opt.value);
    setFilter(values.length ? values : undefined); // Set the filter
  };

  const selectedOptions = filterValue
    ? options.filter((opt) => filterValue.includes(opt.value))
    : [];

  return (
    <Autocomplete
      // open={true}
      multiple
      disableClearable
      disableCloseOnSelect
      disableListWrap
      options={options}
      getOptionLabel={(option) => option.label}
      value={selectedOptions} // Bind selected options to the filter state
      onChange={handleChange}
      renderOption={(props, option, { selected }) => (
        <li
          {...props}
          key={option.value}
          style={{ backgroundColor: selected ? "white" : "transparent" }}
        >
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBox fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
            // Set checkbox color to primary color when selected
            // color={selected ? "orange" : "default"}
            sx={{
              color: selected ? "#f05736" : undefined, // Checkbox color when selected
              "&.Mui-checked": {
                color: "#f05736", // Checkbox color when selected
              },
            }}
          />
          {option.label}
        </li>
      )}
      renderTags={(tagValue) => {
        const numSelected = selectedOptions.length;
        return (
          <Chip
            label={numSelected > 0 ? `${numSelected} Selected` : "Filter"}
            size="small"
          />
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          disabled
          className="multi-select-field"
          variant="outlined"
          // label
          // placeholder
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "12px",
              left: "-5px",
              top: "-5px",
              // lineHeight: "38px", // Ensure label aligns properly with height
            },
          }}
          sx={{
            "& .MuiInputLabel-root": {
              fontSize: "14px", // Adjust font size
              color: "gray", // Adjust color
            },
          }}
          inputProps={{
            ...params.inputProps,
            readOnly: true, // Disable typing
          }}
          InputProps={{
            ...params.InputProps,
            sx: {
              height: "38px", // Custom height for the TextField
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />
      )}
      ListboxProps={{
        sx: {
          // Adjust dropdown height and padding
          // maxHeight: "200px",
          // padding: "10px",
          fontSize: "12px",
          "& .MuiAutocomplete-option": {
            paddingLeft: "0px",
          },
        },
      }}
      // ListboxProps={{
      //   style: {
      //     maxHeight: "150px", // Set the max height for the dropdown options
      //   },
      // }}
    />
  );
}

SelectColumnFilter.propTypes = {
  column: PropTypes.object,
};
// styles={customFilterStyles}
// value={options.find((opt) => opt.value === filterValue) || null} // Handle the selected filter value
// onChange={(selectedOption) => {
//   setFilter(selectedOption ? selectedOption.value : undefined); // Set filter or clear it
// }}
// options={[{ label: "All", value: "" }, ...options]} // Include 'All' option
// isClearable
// placeholder="All"
// components={{
//   Option,
// }}
// menuIsOpen
// ==============================|| SORT HEADER ||============================== //

export const HeaderSort = ({ column }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: "max-content" }}>{column.render("Header")}</Box>
      {!column.disableSortBy && (
        <Stack
          direction="row"
          alignItems="center"
          {...column.getHeaderProps(column.getSortByToggleProps())}
        >
          <NorthOutlinedIcon
            style={{
              color:
                column.isSorted && !column.isSortedDesc
                  ? "inherit"
                  : "darkgrey",
              fontSize: "1rem",
              // color: column.isSorted && !column.isSortedDesc ? 'black' : 'black'
            }}
          />
          <SouthOutlinedIcon
            style={{
              color: column.isSortedDesc ? "inherit" : "darkgrey",
              fontSize: "1rem",
              // color: column.isSortedDesc ? 'black' : 'black'
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

HeaderSort.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool,
};

export const TablePagination = ({
  gotoPage,
  rows,
  setPageSize,
  pageSize,
  pageIndex,
  viewOptions = [5, 10],
}) => {
  const [open, setOpen] = useState(false);

  const handleChangePagination = (event, value) => {
    gotoPage(value - 1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Grid item>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ gap: { md: "16px", xs: "11px" } }}
        >
          <Typography variant="caption" color="text.primary">
            Show
          </Typography>
          <FormControl size="small">
            <MUISelect
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              value={pageSize}
              onChange={handlePageSizeChange}
              sx={{ fontSize: "14px" }}
            >
              {viewOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </MUISelect>
          </FormControl>
          <Typography variant="caption" color="text.primary">
            Go to page
          </Typography>
          <TextField
            size="small"
            type="number"
            value={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 0;
              gotoPage(page - 1);
            }}
            inputProps={{
              min: 1,
              style: { padding: "0.5rem", fontSize: "14px" },
            }}
            sx={{ width: 50, fontSize: "13px" }}
          />
        </Stack>
      </Grid>
      <Grid item>
        <MuiPagination
          count={Math.ceil(rows.length / pageSize)}
          page={pageIndex + 1}
          onChange={handleChangePagination}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: "14px",
              color: "#CECECE",
              border: "1px solid #EAEAEA !important",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#f05736",
              color: "#fff",
            },
            // Target SVG icons of previous, next, first, and last buttons
            "& .MuiPaginationItem-root svg": {
              color: "#f05736",
            },
            // // Handle border-radius for first and last items
            // "& .MuiPaginationItem-firstLast:first-of-type": {
            //   borderTopLeftRadius: "8px !important",
            //   borderBottomLeftRadius: "8px !important",
            // },
            // "& .MuiPaginationItem-firstLast:last-of-type": {
            //   borderTopRightRadius: "8px !important",
            //   borderBottomRightRadius: "8px !important",
            // },
            "& .MuiPaginationItem-root:hover svg": {
              color: "#d0452d", // Darker on hover
            },
            // Styles for disabled buttons, keeping SVG grey
            "& .MuiPaginationItem-root.Mui-disabled svg": {
              color: "#bdbdbd",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

TablePagination.propTypes = {
  gotoPage: PropTypes.func,
  setPageSize: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  initialPageSize: PropTypes.number,
  rows: PropTypes.array,
  viewOptions: PropTypes.any,
};

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};
export const HidingSelect = ({
  hiddenColumns,
  setHiddenColumns,
  allColumns,
}) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setHiddenColumns(typeof value === "string" ? value.split(",") : value);
  };

  let visible = allColumns.filter((c) => !hiddenColumns.includes(c.id)).length;

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        id="column-hiding"
        className="column-hiding"
        multiple
        displayEmpty
        value={hiddenColumns}
        onChange={handleChange}
        input={
          // <BootstrapInput
          //   sx={{ borderRadius: 0.6 }}
          //   id="select-column-hiding"
          //   placeholder="select column"
          // />
          <input type="text" />
        }
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <Typography variant="subtitle1">All columns visible</Typography>
            );
          }

          if (selected.length > 0 && selected.length === allColumns.length) {
            return (
              <Typography variant="subtitle1">All columns visible</Typography>
            );
          }

          return (
            <Typography variant="subtitle1">
              {visible} column(s) visible
            </Typography>
          );
        }}
        MenuProps={MenuProps}
        size="small"
      >
        {allColumns.map((column) => {
          let ToggleChecked =
            column.id === "#"
              ? true
              : hiddenColumns.indexOf(column.id) > -1
              ? false
              : true;
          return (
            <MenuItem
              key={column.id}
              value={column.id}
              sx={{ "&.Mui-selected": { bgcolor: "background.paper" } }}
            >
              <Checkbox checked={ToggleChecked} color="primary" />
              <ListItemText
                primary={
                  typeof column.Header === "string"
                    ? column.Header
                    : column?.title
                }
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

HidingSelect.propTypes = {
  setHiddenColumns: PropTypes.func,
  hiddenColumns: PropTypes.array,
  allColumns: PropTypes.array,
};

// Fuzzy text filter function
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

// Multi-select filter function
// function multiSelectFilterFn(rows, id, filterValue) {
//   // If no filter is applied, show all rows
//   if (!filterValue || filterValue.length === 0) {
//     return rows;
//   }
//   // Filter rows based on whether the value includes any of the selected options
//   return rows.filter((row) => filterValue.includes(row.values[id]));
// }
function multiSelectFilterFn(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    // If filterValue is an array, check if the row value is included in the filter values
    return filterValue.includes(rowValue);
  });
}

// Filter types object
export const renderFilterTypes = {
  fuzzyText: fuzzyTextFilterFn,
  text: (rows, id, filterValue) => {
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
        : true;
    });
  },
  multiSelect: multiSelectFilterFn, // Add your multi-select filter here
};

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    return (
      <Checkbox
        className="int-checkbox"
        sx={{
          "&.Mui-checked": {
            color: "#f05736",
          },
          "&.MuiCheckbox-indeterminate": {
            color: "#f05736", // Color when indeterminate (with " - " sign)
          },
          "&.MuiSvgIcon-root": {
            fontSize: "1.2rem",
          },
        }}
        indeterminate={indeterminate}
        ref={resolvedRef}
        {...rest}
      />
    );
  }
);

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
};

// function fuzzyTextFilterFn(rows, id, filterValue) {
//   return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
// }

// fuzzyTextFilterFn.autoRemove = (val) => !val;

// export const renderFilterTypes = () => ({
//   fuzzyText: fuzzyTextFilterFn,
//   text: (rows, id, filterValue) => {
//     rows.filter((row) => {
//       const rowValue = row.values[id];
//       return rowValue !== undefined
//         ? String(rowValue)
//             .toLowerCase()
//             .startsWith(String(filterValue).toLowerCase())
//         : true;
//     });
//   },
// });

export function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val) => typeof val !== "number";

export function useControlledState(state) {
  return useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      };
    }
    return state;
  }, [state]);
}

export function roundedMedian(leafValues) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

// ==============================|| CSV EXPORT ||============================== //

// export const CSVExport = ({ data, filename, headers }) => {
//   return (
//     <Box>
//       <CSVLink data={data} filename={filename} headers={headers}>
//         <Tooltip title="CSV Export">
//           <CloudDownloadOutlinedIcon
//             size={38}
//             style={{
//               color: "gray",
//               marginTop: 6,
//               padding: 6,
//               border: "1px solid #BEC8D0",
//               borderRadius: 5,
//             }}
//           />
//         </Tooltip>
//       </CSVLink>
//     </Box>
//   );
// };

// CSVExport.propTypes = {
//   data: PropTypes.array,
//   headers: PropTypes.any,
//   filename: PropTypes.string,
// };

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FFFBEE",
    color: "#f05736",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '"Inter", sans-serif',
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "2px solid #BEBEBE",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: '"Inter", sans-serif',
    color: "#535B62",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid #BEBEBE",
  },
}));

// position: "absolute",
// left: "-5px",
// top: "-5px",
// "&.Mui-focused": {
//   top: "0px",
//   left: 0,
// },
// <Select
//   styles={customFilterStyles} // Custom styles
//   // value={options.filter((opt) => filterValue?.includes(opt.value))} // Filter by selected values
//   value={options.filter(
//     (opt) => filterValue && filterValue.includes(opt.value)
//   )}
//   // onChange={(selectedOptions) => {
//   //   const values = selectedOptions
//   //     ? selectedOptions.map((opt) => opt.value)
//   //     : [];
//   //   setFilter(values.length ? values : undefined); // Set filter or clear it
//   // }}
//   onChange={(selectedOptions) => {
//     setFilter(
//       selectedOptions ? selectedOptions.map((opt) => opt.value) : undefined
//     );
//   }}
//   // options={options} // List of options
//   options={[{ label: "All", value: "" }, ...options]} // Include 'All' option
//   isMulti // Enable multi-select
//   placeholder="All"
//   components={{ Option }} // Custom option component
//   isClearable={false} // Allow clearing the selection

// />
// <Select
//   value={filterValue}
//   onChange={(e) => {
//     setFilter(e.target.value || undefined);
//   }}
//   displayEmpty
//   size="small"
// >
//   <MenuItem value="">All</MenuItem>
//   {options.map((option, i) => (
//     <MenuItem key={i} value={option}>
//       {option}
//     </MenuItem>
//   ))}
// </Select>
