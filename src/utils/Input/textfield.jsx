import { InputBase, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";

export const BootstrapInput = styled(InputBase)(
  ({ theme, endAdornment, startAdornment }) => ({
    "label + &": {
      marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
      borderRadius: 8,
      position: "relative",
      backgroundColor: "#fff !important",
      border: "1px solid",
      borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
      fontSize: 12,
      padding: "9.6px 12px",
      paddingRight: endAdornment ? "40px" : "12px", // For end adornment
      paddingLeft: startAdornment ? "40px" : "12px", // For start adornment
      transition: theme.transitions.create([
        "border-color",
        "background-color",
        "box-shadow",
      ]),
      fontFamily: '"Poppins", sans-serif',
      "&:focus": {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`,
        // borderColor: theme.palette.primary.main,
      },
      "&.Mui-disabled": {
        backgroundColor: "#f3f3f3 !important", // Custom background color for disabled state
        color: "#a0a0a0", // Optional: Change text color for disabled state
        opacity: 1, // Ensures the custom color is not affected by default opacity
      },
    },
    "& .MuiInputAdornment-root": {
      position: "absolute",
      color: theme.palette.grey[400],
      top: "50%", // Align with the input vertically
      transform: "translateY(-50%)",
    },
    "& .MuiInputAdornment-positionStart": {
      left: 12, // Adjust position as required
    },
    "& .MuiInputAdornment-positionEnd": {
      right: 12, // Adjust position as required
    },
    "& .MuiInputBase-input:-webkit-autofill": {
      // backgroundColor: "#F3F6F9 !important",
      // color: "#000 !important",
    },
  })
);

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 14,
    // padding: "8px 12px !important",
    // height: "37px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fontFamily: '"Poppins", sans-serif',
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  // "& .MuiInputBase-input": {
  //   padding: "8px 12px", // Adjust the padding to match the BootstrapInput
  //   // height: "auto", // Ensure height matches the input height
  //   height: "37px",
  // },
  "& .MuiInputAdornment-root": {
    position: "absolute",
    color: theme.palette.grey[400],
    top: 18,
    right: 15,
  },
  "& .MuiInputBase-input:-webkit-autofill": {
    backgroundColor: "#F3F6F9 !important",
    color: "#000 !important",
  },
}));

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const StyledDatePicker = (props) => {
  return (
    <DatePicker
      {...props}
      renderInput={(params) => (
        <StyledTextField
          InputLabelProps={{
            shrink: true,
          }}
          {...params}
        />
      )}
    />
  );
};
