import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";

export const dateFormat = (dateStr) => {
  // Original date string

  // Parse the date string into a Date object
  const date = new Date(dateStr);

  // Define month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract day, month, and year
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Format the date string as "24 October, 2024"
  const formattedDate = `${day} ${month}, ${year}`;

  return formattedDate;
};

export const inrCurrency = (currencyValue) => {
  // Convert the number to a string
  let numStr = currencyValue.toString();

  // Split the string into integral and fractional parts (if any)
  let [integerPart, fractionalPart] = numStr.split(".");

  // Apply regex to format the integral part with commas
  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);

  // Format the other numbers with commas
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let formattedValue =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  // If there's a fractional part, add it back
  if (fractionalPart) {
    formattedValue += "." + fractionalPart;
  }

  // return '₹' + formattedValue;
  return "₹ " + formattedValue;
};

export const removeSpace = (string) => {
  return string?.split(" ").join("-");
};

export const verifyToken = (authToken) => {
  if (!authToken) {
    return false;
  }
  const decoded = jwtDecode(authToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

export const downloadExcel = (data, sheetName, fileName) => {
  if (data?.length > 0) {
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Create the Excel file and trigger the download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  } else {
    console.warn("No data available for download.");
  }
};

export const timePlaceholder = {
  fieldHoursPlaceholder: () => "--",
  fieldMinutesPlaceholder: () => "--",
  fieldMeridiemPlaceholder: () => "",
};
