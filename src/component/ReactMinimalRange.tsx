import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { cx, isValidDate, isValidDates } from "./utils";
import LOCALE from "./locale";
import Calendar from "./Calendar";
import RangeDate from "./RangeDate";
import RangeTime from "./RangeTime";
import "./react-minimal-datetime-range.css";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Popover,
} from "@mui/material";
import CalenderIcon from "./CalenderIcon";
import CloseIcon from "./icons/CloseIcon";
import dayjs from "dayjs";
const DEFAULT_LACALE = "en-us";
interface IObjectKeysAny {
  [key: string]: any;
}
export interface CalendarPickerProps {
  show?: boolean;
  locale?: string;
  allowPageClickToClose?: boolean;
  defaultDate?: string;
  style?: React.CSSProperties;
  defaultTimes?: Array<string>;
  enableTimeSelection?: boolean;
  markedDates?: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  onClose?: () => void;
  onYearPicked?: (res: object) => void;
  onMonthPicked?: (res: object) => void;
  onDatePicked?: (res: object) => void;
  onResetDate?: (res: object) => void;
  onResetDefaultDate?: (res: object) => void;
  handleChooseHourPick?: (res: Array<string>) => void;
  handleChooseMinutePick?: (res: Array<string>) => void;
}
export const CalendarPicker: React.FC<CalendarPickerProps> = memo(
  ({
    show = false,
    locale = DEFAULT_LACALE,
    allowPageClickToClose = true,
    defaultDate = "",
    style = {},
    defaultTimes = ["", ""],
    enableTimeSelection = false,
    markedDates = [],
    supportDateRange = [],
    duration = 0,
    onClose = () => {},
    onYearPicked = () => {},
    onMonthPicked = () => {},
    onDatePicked = () => {},
    onResetDate = () => {},
    onResetDefaultDate = () => {},
    handleChooseHourPick = () => {},
    handleChooseMinutePick = () => {},
  }) => {
    const [internalShow, setInternalShow] = useState(show);
    const handleOnClose = useCallback(() => {
      setInternalShow(false);
      onClose && onClose();
    }, []);
    const handleOnYearPicked = useCallback((yearObj) => {
      onYearPicked && onYearPicked(yearObj);
    }, []);
    const handleOnMonthPicked = useCallback((monthObj) => {
      onMonthPicked && onMonthPicked(monthObj);
    }, []);
    const handleOnDatePicked = useCallback((dateObj) => {
      onDatePicked && onDatePicked(dateObj);
    }, []);
    const handleOnResetDate = useCallback((dateObj) => {
      onResetDate && onResetDate(dateObj);
    }, []);
    const handleOnResetDefaultDate = useCallback((dateObj) => {
      onResetDefaultDate && onResetDefaultDate(dateObj);
    }, []);
    useEffect(() => {
      setInternalShow(show);
    }, [show]);
    const $elWrapper = useRef(null);
    useEffect(() => {
      if (typeof window !== "undefined") {
        window.addEventListener("mousedown", pageClick);
        window.addEventListener("touchstart", pageClick);
        return () => {
          window.removeEventListener("mousedown", pageClick);
          window.removeEventListener("touchstart", pageClick);
        };
      }
    }, []);
    const pageClick = useCallback(
      (e) => {
        if (!allowPageClickToClose) {
          return;
        }
        if ($elWrapper.current.contains(e.target)) {
          return;
        }
        handleOnClose();
      },
      [allowPageClickToClose],
    );
    return (
      <div style={style} ref={$elWrapper}>
        {internalShow && (
          <CalendarPickerComponent
            show={internalShow}
            defaultDate={defaultDate}
            locale={locale}
            onClose={handleOnClose}
            handleOnYearPicked={handleOnYearPicked}
            handleOnMonthPicked={handleOnMonthPicked}
            handleOnDatePicked={handleOnDatePicked}
            handleOnResetDate={handleOnResetDate}
            handleOnResetDefaultDate={handleOnResetDefaultDate}
            enableTimeSelection={enableTimeSelection}
            defaultTimes={defaultTimes}
            handleChooseHourPick={handleChooseHourPick}
            handleChooseMinutePick={handleChooseMinutePick}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
          />
        )}
      </div>
    );
  },
);
interface CalendarPickerComponentProps {
  show?: boolean;
  locale?: string;
  allowPageClickToClose?: boolean;
  defaultDate?: string;
  defaultTimes?: Array<string>;
  enableTimeSelection?: boolean;
  markedDates?: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  onClose?: () => void;
  handleOnYearPicked?: (res: object) => void;
  handleOnMonthPicked?: (res: object) => void;
  handleOnDatePicked?: (res: object) => void;
  handleOnResetDate?: (res: object) => void;
  handleOnResetDefaultDate?: (res: object) => void;
  handleChooseHourPick?: (res: Array<string>) => void;
  handleChooseMinutePick?: (res: Array<string>) => void;
}
const CalendarPickerComponent: React.FC<CalendarPickerComponentProps> = memo(
  ({
    show,
    defaultDate,
    locale,
    defaultTimes,
    markedDates,
    supportDateRange,
    enableTimeSelection,
    onClose,
    handleOnYearPicked,
    handleOnMonthPicked,
    handleOnDatePicked,
    handleOnResetDate,
    handleOnResetDefaultDate,
    handleChooseHourPick,
    handleChooseMinutePick,
  }) => {
    const isDefaultDatesValid = isValidDate(defaultDate);
    const [internalShow, setInternalShow] = useState(false);
    const [type, setType] = useState(TYPES[0]);
    const [startDatePickedArray, setStartDatePickedArray] = useState(
      defaultDate ? defaultDate.split("-") : [],
    );
    const [startTimePickedArray, setStartTimePickedArray] = useState([
      defaultTimes[0].split(":")[0],
      defaultTimes[0].split(":")[1] || "",
    ]);
    const [selected, setSelected] = useState(
      isDefaultDatesValid ? true : false,
    );
    const handleChooseStartTimeHour = useCallback(
      (res) => {
        setStartTimePickedArray([res, startTimePickedArray[1]]);
        handleChooseHourPick(res);
      },
      [startTimePickedArray],
    );
    const handleChooseStartTimeMinute = useCallback(
      (res) => {
        setStartTimePickedArray([startTimePickedArray[0], res]);
        handleChooseMinutePick(res);
      },
      [startTimePickedArray],
    );
    const handleOnClose = useCallback(() => {
      setInternalShow(false);
      onClose && onClose();
    }, []);
    useEffect(() => {
      if (show) {
        setTimeout(() => {
          setInternalShow(true);
        }, 0);
      }
    }, [show]);
    const handleOnChangeType = useCallback(() => {
      if (type === TYPES[0]) {
        setType(TYPES[1]);
      } else {
        setType(TYPES[0]);
      }
    }, [type]);
    const componentClass = useMemo(
      () => cx("react-minimal-datetime-range", internalShow && "visible"),
      [internalShow],
    );
    const LOCALE_DATA: IObjectKeysAny = useMemo(
      () => (LOCALE[locale] ? LOCALE[locale] : LOCALE["en-us"]),
      [locale],
    );
    return (
      <div className={componentClass}>
        <svg
          className="react-minimal-datetime-range__close"
          viewBox="0 0 20 20"
          width="15"
          height="15"
          onClick={handleOnClose}
        >
          <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z" />
        </svg>
        <div className={`react-minimal-datetime-date-piker`}>
          <div className={`react-minimal-datetime-range__calendar`}>
            <Calendar
              defaultDate={defaultDate}
              locale={locale}
              onYearPicked={handleOnYearPicked}
              onMonthPicked={handleOnMonthPicked}
              onDatePicked={handleOnDatePicked}
              onResetDate={handleOnResetDate}
              onResetDefaultDate={handleOnResetDefaultDate}
              markedDates={markedDates}
              supportDateRange={supportDateRange}
            />
          </div>
          {type === TYPES[1] && (
            <div
              className="react-minimal-datetime-range__time-piker"
              style={{ marginTop: "10px" }}
            >
              {/* <RangeTime
                startDatePickedArray={startDatePickedArray}
                handleChooseStartTimeHour={handleChooseStartTimeHour}
                handleChooseStartTimeMinute={handleChooseStartTimeMinute}
                startTimePickedArray={startTimePickedArray}
                showOnlyTime={true}
                LOCALE_DATA={LOCALE_DATA}
                singleMode={true}
              /> */}
            </div>
          )}
        </div>
        {enableTimeSelection && (
          <div
            className={cx(
              "react-minimal-datetime-range__button",
              "react-minimal-datetime-range__button--type",
              !selected && "disabled",
            )}
            onClick={selected ? handleOnChangeType : () => {}}
            style={{ padding: "0", marginTop: "10px" }}
          >
            {type === TYPES[0] ? LOCALE_DATA[TYPES[1]] : LOCALE_DATA[TYPES[0]]}
          </div>
        )}
      </div>
    );
  },
);

const TYPES = ["date", "time"];

export interface RangePickerProps {
  label?: string;
  format?: string;
  show?: boolean;
  ampm?: boolean;
  disabled?: boolean;
  locale?: string;
  allowPageClickToClose?: boolean;
  showOnlyTime?: boolean;
  defaultDate?: string;
  placeholder?: Array<string>;
  defaultDates?: Array<string>;
  defaultTimes?: Array<string>;
  initialDates?: Array<string>;
  initialTimes?: Array<string>;
  enableTimeSelection?: boolean;
  markedDates?: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  style?: React.CSSProperties;
  onConfirm?: (res: Array<string>) => void;
  onClear?: () => void;
  onClose?: () => void;
  onChooseDate?: (res: object) => void;
}
export const RangePicker: React.FC<RangePickerProps> = memo(
  ({
    label = "",
    ampm = false,
    format = "DD-MM-YYYY HH:mm",
    show = false,
    disabled = false,
    locale = DEFAULT_LACALE,
    allowPageClickToClose = true,
    showOnlyTime = false,
    placeholder = ["", ""],
    defaultDates = ["", ""],
    defaultTimes = ["", ""],
    initialDates = ["", ""],
    initialTimes = ["", ""],
    markedDates = [],
    supportDateRange = [],
    duration = 0,
    style = {},
    onChooseDate = () => {},
    onConfirm = () => {},
    onClear = () => {},
    onClose = () => {},
  }) => {
    // ['YYYY-MM-DD', 'YYYY-MM-DD'] // ['hh:mm', 'hh:mm']
    const inputContainerRef = useRef(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isDefaultDatesValid = isValidDates(defaultDates);
    const isInitialDatesValid = isValidDates(initialDates);
    const [selected, setSelected] = useState(
      isDefaultDatesValid ? true : false,
    );
    const [start, setStart] = useState(
      defaultDates[0]
        ? `${defaultDates[0]} ${defaultTimes[0] ? defaultTimes[0] : ""}`
        : "",
    );
    const [end, setEnd] = useState(
      defaultDates[1]
        ? `${defaultDates[1]} ${defaultTimes[1] ? defaultTimes[1] : ""}`
        : "",
    );
    const [type, setType] = useState(TYPES[0]);
    const [internalShow, setInternalShow] = useState(show);
    const [startDatePickedArray, setStartDatePickedArray] = useState(
      defaultDates[0] ? defaultDates[0].split("-") : [],
    );
    const [endDatePickedArray, setEndDatePickedArray] = useState(
      defaultDates[1] ? defaultDates[1].split("-") : [],
    );
    const [currentDateObjStart, setCurrentDateObjStart] = useState({});
    const [currentDateObjEnd, setCurrentDateObjEnd] = useState({});
    const [startTimePickedArray, setStartTimePickedArray] = useState([
      defaultTimes[0].split(":")[0],
      defaultTimes[0].split(":")[1] || "",
    ]);
    const [endTimePickedArray, setEndTimePickedArray] = useState([
      defaultTimes[1].split(":")[0],
      defaultTimes[1].split(":")[1] || "",
    ]);
    const [dates, setDates] = useState(defaultDates);
    const [times, setTimes] = useState(defaultTimes);
    const handleChooseStartDate = useCallback(
      ({ name, month, year, value }) => {
        setDates([value, dates[1]]);
        setStartDatePickedArray(value === "" ? [] : [year, month, name]);
      },
      [dates],
    );
    const handleChooseEndDate = useCallback(
      ({ name, month, year, value }) => {
        setDates([dates[0], value]);
        setEndDatePickedArray(value === "" ? [] : [year, month, name]);
      },
      [dates],
    );
    const handleChooseStartTimeHour = useCallback(
      (res) => {
        setStartTimePickedArray([res, startTimePickedArray[1]]);
      },
      [startTimePickedArray],
    );
    const handleChooseStartTimeMinute = useCallback(
      (res) => {
        setStartTimePickedArray([startTimePickedArray[0], res]);
      },
      [startTimePickedArray],
    );
    const handleChooseEndTimeHour = useCallback(
      (res) => {
        setEndTimePickedArray([res, endTimePickedArray[1]]);
      },
      [endTimePickedArray],
    );
    const handleChooseEndTimeMinute = useCallback(
      (res) => {
        setEndTimePickedArray([endTimePickedArray[0], res]);
      },
      [endTimePickedArray],
    );
    const handleOnChangeType = useCallback(() => {
      if (type === TYPES[0]) {
        setType(TYPES[1]);
      } else {
        setType(TYPES[0]);
      }
    }, [type]);
    const handleOnConfirm = useCallback(
      (sd = null, ed = null, st = null, et = null) => {
        if (!sd) {
          sd = startDatePickedArray;
        }
        if (!ed) {
          ed = endDatePickedArray;
        }
        if (!st) {
          st = startTimePickedArray;
        }
        if (!et) {
          et = endTimePickedArray;
        }
        const a = new Date(sd.join("-"));
        const b = new Date(ed.join("-"));
        const starts = a < b ? sd : ed;
        const ends = a > b ? sd : ed;
        const startStr = `${starts.join("-")} ${
          st[0] && st[1] ? st.join(":") : ""
        }`;
        const endStr = `${ends.join("-")} ${
          et[0] && et[1] ? et.join(":") : ""
        }`;
        setStart(startStr);
        setEnd(endStr);
        setStartDatePickedArray(starts);
        setEndDatePickedArray(ends);
        setStartTimePickedArray(st);
        setEndTimePickedArray(et);
        setDates([starts.join("-"), ends.join("-")]);
        setInternalShow(false);
        setAnchorEl(null);
        onConfirm && onConfirm([startStr, endStr]);
      },
      [
        startDatePickedArray,
        endDatePickedArray,
        startTimePickedArray,
        endTimePickedArray,
      ],
    );

    const handleOnClear = useCallback(
      (e) => {
        if (disabled) {
          return;
        }
        e.stopPropagation();
        if (isInitialDatesValid) {
          handleOnConfirm(
            initialDates[0].split("-"),
            initialDates[1].split("-"),
            initialTimes[0].split(":"),
            initialTimes[1].split(":"),
          );
          return;
        }
        setSelected(false);
        setInternalShow(false);
        setStart("");
        setEnd("");
        setStartDatePickedArray([]);
        setEndDatePickedArray([]);
        setDates(["", ""]);
        setTimes(["", ""]);
        setStartTimePickedArray(["00", "00"]);
        setEndTimePickedArray(["00", "00"]);
        onClear && onClear();
      },
      [disabled, initialDates, initialTimes],
    );
    useEffect(() => {
      setType(TYPES[0]);
    }, [internalShow]);
    useEffect(() => {
      if (!internalShow) {
        onClose && onClose();
      }
    }, [internalShow]);
    useEffect(() => {
      setStart(
        defaultDates[0]
          ? `${defaultDates[0]} ${defaultTimes[0] ? defaultTimes[0] : ""}`
          : "",
      );
      setEnd(
        defaultDates[1]
          ? `${defaultDates[1]} ${defaultTimes[1] ? defaultTimes[1] : ""}`
          : "",
      );
    }, [defaultDates]);
    const isInitial = useMemo(
      () =>
        start === `${initialDates[0]} ${initialTimes[0]}` &&
        end === `${initialDates[1]} ${initialTimes[1]}`,
      [initialDates, initialTimes, start, end],
    );
    const isEmpty = useMemo(() => !start && !end, [start, end]);
    const valueStart = useMemo(
      () => (showOnlyTime ? start.split(" ")[1] : start),
      [showOnlyTime, start],
    );
    const valueEnd = useMemo(
      () => (showOnlyTime ? end.split(" ")[1] : end),
      [showOnlyTime, end],
    );
    const handleOnConfirmClick = useCallback(() => {
      handleOnConfirm();
    }, [
      startDatePickedArray,
      endDatePickedArray,
      startTimePickedArray,
      endTimePickedArray,
    ]);
    // onClick={() => !disabled && setInternalShow(!internalShow)}
    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled) {
        setInternalShow(true);
        setAnchorEl(inputContainerRef.current);
      }
    };

    const open = Boolean(anchorEl);
    const id = open ? "range-picker-popover" : undefined;

    console.log(valueStart, valueEnd);
    return (
      <FormControl fullWidth disabled={disabled}>
        {label && <FormLabel>{"jfbgkjb"}</FormLabel>}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            mt: 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <Box
            ref={inputContainerRef}
            display="flex"
            alignItems="center"
            gap={1}
            sx={(theme) => ({
              border: "1px solid",
              borderColor: open
                ? theme.palette.primary.main
                : theme.palette.grey[400],
              borderRadius: 1,
              padding: "3px 14px",
              cursor: disabled ? "not-allowed" : "text",
              backgroundColor: disabled
                ? theme.palette.action.disabledBackground
                : "inherit",
              transition: "border-color 0.2s",
              "&:hover": {
                borderColor: !disabled && theme.palette.text.primary,
              },
            })}
          >
            <DateTimePicker
              disabled={disabled}
              ampm={ampm}
              value={dayjs(valueStart)}
              onChange={(newValue) => {
                const date = dayjs(newValue);
                if (date.isValid()) {
                  const formatted = date.format("YYYY-MM-DD HH:mm");
                  console.log("Formatted:", formatted);
                  setStart(formatted);
                }
              }}
              format={format}
              label=""
              slots={{
                openPickerIcon: () => null, // Remove calendar icon
              }}
              slotProps={{
                textField: {
                  placeholder: "Enter date/time", // Or leave it empty
                  variant: "standard",
                  InputLabelProps: { shrink: false }, // Prevent label animation
                  InputProps: {
                    disableUnderline: true,
                    sx: {
                      width: "auto",
                      p: 0,
                      m: 0,
                      border: 0,
                      fontSize: "inherit",
                      height: 30, // consistent height
                      lineHeight: "30px", // match height
                      "& .MuiInputAdornment-root": {
                        display: "none",
                      },
                      "& .MuiPickersSectionList-root": {
                        width: "auto !important",
                        opacity: 1,
                      },
                    },
                    inputProps: {
                      style: {
                        padding: 0,
                        margin: 0,
                        height: "100%",
                        lineHeight: "30px",
                        width: "auto",
                      },
                    },
                  },
                  sx: {
                    p: 0,
                    m: 0,
                  },
                },
              }}
              sx={{
                p: 0,
                m: 0,
                "& .MuiInputBase-root": {
                  p: 0,
                  m: 0,
                  height: 30,
                },
                "& .MuiInputBase-input": {
                  p: 0,
                  m: 0,
                  height: "100%",
                  lineHeight: "30px",
                },
              }}
            />

            <span>~</span>
            <DateTimePicker
              disabled={disabled}
              value={dayjs(valueEnd)}
              onChange={(newValue) => {
                const date = dayjs(newValue);
                if (date.isValid()) {
                  const formatted = date.format("YYYY-MM-DD HH:mm");
                  console.log("Formatted:", formatted);
                  setEnd(formatted);
                }
              }}
              ampm={ampm}
              format={format}
              label=""
              slots={{
                openPickerIcon: () => null, // Remove calendar icon
              }}
              slotProps={{
                textField: {
                  placeholder: "", // No label or placeholder
                  variant: "standard",
                  InputLabelProps: { shrink: false }, // No label animation
                  InputProps: {
                    disableUnderline: true, // No underline
                    sx: {
                      p: 0,
                      m: 0,
                      border: 0,
                      fontSize: "inherit",
                      "& .MuiInputAdornment-root": {
                        display: "none", // Hide the adornment container
                      },
                      "& .MuiPickersSectionList-root": {
                        width: "auto !important",
                        opacity: 1,
                      },
                    },
                  },
                  sx: {
                    p: 0,
                    m: 0,
                  },
                },
              }}
              sx={{
                p: 0,
                m: 0,
                "& .MuiInputBase-root": {
                  p: 0,
                  m: 0,
                },
                "& .MuiInputBase-input": {
                  p: 0,
                  m: 0,
                },
              }}
            />

            {!isInitial && !isEmpty ? (
              <IconButton onClick={handleOnClear} sx={{ p: 0 }}>
                <CloseIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handleOpen} sx={{ p: 0 }}>
                <CalenderIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <RangePickerComponent
            show={internalShow}
            selected={selected}
            setSelected={setSelected}
            handleChooseStartDate={handleChooseStartDate}
            handleChooseEndDate={handleChooseEndDate}
            dates={dates}
            times={times}
            locale={locale}
            startDatePickedArray={startDatePickedArray}
            endDatePickedArray={endDatePickedArray}
            type={type}
            handleOnChangeType={handleOnChangeType}
            handleOnConfirmClick={handleOnConfirmClick}
            startTimePickedArray={startTimePickedArray}
            endTimePickedArray={endTimePickedArray}
            handleChooseStartTimeHour={handleChooseStartTimeHour}
            handleChooseStartTimeMinute={handleChooseStartTimeMinute}
            handleChooseEndTimeHour={handleChooseEndTimeHour}
            handleChooseEndTimeMinute={handleChooseEndTimeMinute}
            currentDateObjStart={currentDateObjStart}
            setCurrentDateObjStart={setCurrentDateObjStart}
            currentDateObjEnd={currentDateObjEnd}
            setCurrentDateObjEnd={setCurrentDateObjEnd}
            showOnlyTime={showOnlyTime}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
            onChooseDate={onChooseDate}
          />
        </Popover>
      </FormControl>
    );
  },
);

interface RangePickerComponentProps {
  show: boolean;
  locale: string;
  selected: boolean;
  setSelected: (res: boolean) => void;
  dates: Array<string>;
  times: Array<string>;
  type: string;
  startDatePickedArray: Array<string>;
  endDatePickedArray: Array<string>;
  startTimePickedArray: Array<string>;
  endTimePickedArray: Array<string>;
  currentDateObjStart: object;
  setCurrentDateObjStart: (res: object) => void;
  currentDateObjEnd: object;
  setCurrentDateObjEnd: (res: object) => void;
  showOnlyTime: boolean;
  markedDates: Array<string>;
  supportDateRange?: Array<string>;
  duration?: number;
  handleOnChangeType: () => void;
  onChooseDate: (res: object) => void;
  handleOnConfirmClick: () => void;
  handleChooseStartTimeHour: (res: string) => void;
  handleChooseStartTimeMinute: (res: string) => void;
  handleChooseEndTimeHour: (res: string) => void;
  handleChooseEndTimeMinute: (res: string) => void;
  handleChooseStartDate: (res: object) => void;
  handleChooseEndDate: (res: object) => void;
}
const RangePickerComponent: React.FC<RangePickerComponentProps> = memo(
  ({
    show,
    locale,
    selected,
    setSelected,
    dates,
    type,
    startDatePickedArray,
    endDatePickedArray,
    startTimePickedArray,
    endTimePickedArray,
    handleChooseStartDate,
    handleChooseEndDate,
    currentDateObjStart,
    setCurrentDateObjStart,
    currentDateObjEnd,
    setCurrentDateObjEnd,
    showOnlyTime,
    markedDates,
    supportDateRange,
    duration,
    onChooseDate,
    handleOnChangeType,
    handleOnConfirmClick,
    handleChooseStartTimeHour,
    handleChooseStartTimeMinute,
    handleChooseEndTimeHour,
    handleChooseEndTimeMinute,
  }) => {
    const [internalShow, setInternalShow] = useState(false);
    useEffect(() => {
      if (show) {
        setTimeout(() => {
          setInternalShow(true);
        }, 0);
      }
    }, [show]);
    const componentClass = useMemo(
      () => cx("react-minimal-datetime-range", internalShow && "visible"),
      [internalShow],
    );
    const LOCALE_DATA: IObjectKeysAny = useMemo(
      () => (LOCALE[locale] ? LOCALE[locale] : LOCALE["en-us"]),
      [locale],
    );
    return (
      <div className={componentClass}>
        <div className="react-minimal-datetime-date-piker">
          <RangeDate
            selected={selected}
            setSelected={setSelected}
            handleChooseStartDate={handleChooseStartDate}
            handleChooseEndDate={handleChooseEndDate}
            rangeDirection="start"
            defaultDateStart={dates[0]}
            defaultDateEnd={dates[1]}
            locale={locale}
            startDatePickedArray={startDatePickedArray}
            endDatePickedArray={endDatePickedArray}
            currentDateObjStart={currentDateObjStart}
            setCurrentDateObjStart={setCurrentDateObjStart}
            currentDateObjEnd={currentDateObjEnd}
            setCurrentDateObjEnd={setCurrentDateObjEnd}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
            onChooseDate={onChooseDate}
          />
          <div className="react-minimal-datetime-date-piker__divider" />
          <RangeDate
            selected={selected}
            setSelected={setSelected}
            handleChooseStartDate={handleChooseStartDate}
            handleChooseEndDate={handleChooseEndDate}
            rangeDirection="end"
            defaultDateStart={dates[0]}
            defaultDateEnd={dates[1]}
            locale={locale}
            startDatePickedArray={startDatePickedArray}
            endDatePickedArray={endDatePickedArray}
            currentDateObjStart={currentDateObjStart}
            setCurrentDateObjStart={setCurrentDateObjStart}
            currentDateObjEnd={currentDateObjEnd}
            setCurrentDateObjEnd={setCurrentDateObjEnd}
            markedDates={markedDates}
            supportDateRange={supportDateRange}
            duration={duration}
            onChooseDate={onChooseDate}
          />
          {(showOnlyTime || type === TYPES[1]) && (
            <div className="react-minimal-datetime-range__time-piker">
              <RangeTime
                startDatePickedArray={startDatePickedArray}
                endDatePickedArray={endDatePickedArray}
                handleChooseStartTimeHour={handleChooseStartTimeHour}
                handleChooseStartTimeMinute={handleChooseStartTimeMinute}
                handleChooseEndTimeHour={handleChooseEndTimeHour}
                handleChooseEndTimeMinute={handleChooseEndTimeMinute}
                startTimePickedArray={startTimePickedArray}
                endTimePickedArray={endTimePickedArray}
                showOnlyTime={showOnlyTime}
                LOCALE_DATA={LOCALE_DATA}
              />
            </div>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          {!showOnlyTime && (
            <Button
              disabled={!selected}
              onClick={selected ? handleOnChangeType : () => {}}
            >
              {type === TYPES[0]
                ? LOCALE_DATA[TYPES[1]]
                : LOCALE_DATA[TYPES[0]]}
            </Button>
          )}
          <Button
            disabled={!selected}
            onClick={selected ? handleOnConfirmClick : () => {}}
          >
            {LOCALE_DATA["confirm"]}
          </Button>
        </Box>
      </div>
    );
  },
);
