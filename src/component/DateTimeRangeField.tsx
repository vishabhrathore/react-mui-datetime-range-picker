import React, { useState } from "react";
import {
  Box,
  TextField,
  Paper,
  Typography,
  Stack,
  Button,
  InputAdornment,
  Popover,
  SvgIcon,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

// SVG path for calendar icon
const DateRangeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
  </SvgIcon>
);

const DateTimeRangePickerSimple = ({ onChange }) => {
  // States for date-time range
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  // Popover control
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Format display value
  const getDisplayValue = () => {
    if (!startDateTime || !endDateTime) {
      return "Select date and time range";
    }

    const formattedStart = format(startDateTime, "MMM dd, yyyy h:mm a");
    const formattedEnd = format(endDateTime, "MMM dd, yyyy h:mm a");

    return `${formattedStart} - ${formattedEnd}`;
  };

  // Handle apply button click
  const handleApply = () => {
    if (startDateTime && endDateTime && onChange) {
      onChange([startDateTime, endDateTime]);
    }
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          value={getDisplayValue()}
          onClick={handleClick}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <DateRangeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Paper sx={{ p: 3, width: "500px" }}>
            <Stack spacing={3}>
              <Typography variant="h6">Select Date & Time Range</Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Start</Typography>
                  <DateTimePicker
                    value={startDateTime}
                    onChange={setStartDateTime}
                    renderInput={(params) => (
                      <TextField size="small" fullWidth {...params} />
                    )}
                  />
                </Stack>

                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">End</Typography>
                  <DateTimePicker
                    value={endDateTime}
                    onChange={setEndDateTime}
                    renderInput={(params) => (
                      <TextField size="small" fullWidth {...params} />
                    )}
                  />
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleApply}
                  disabled={!startDateTime || !endDateTime}
                >
                  Apply
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimeRangePickerSimple;

// Usage example:
// function App() {
//   const handleDateTimeRangeChange = (range) => {
//     console.log('Start:', range[0]);
//     console.log('End:', range[1]);
//   };
//
//   return (
//     <div style={{ width: '500px', margin: '40px auto' }}>
//       <DateTimeRangePickerSimple onChange={handleDateTimeRangeChange} />
//     </div>
//   );
// }
