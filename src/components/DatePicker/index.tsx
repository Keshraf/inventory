import { DatePickerInput as MantineDatePicker } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { setDate } from "@/store/date";

type Props = {
  onChange?: () => void;
};

const Datepicker = ({ onChange }: Props) => {
  const matches = useMediaQuery("(min-width: 640px)");
  const date = useAppSelector((state) => new Date(JSON.parse(state.date)));
  const dispatch = useAppDispatch();

  console.log("date", date);

  return (
    <MantineDatePicker
      value={date}
      onChange={(v) => {
        dispatch(setDate(v ? v : new Date()));
        onChange && onChange();
      }}
      placeholder="Pick date"
      valueFormat="MMMM D, YYYY"
      size="md"
      clearable={false}
      className="font-sans"
      styles={() => ({
        root: {
          fontFamily: "Inter",
        },
        dropdown: {
          background: "#fff",
        },
        wrapper: {
          height: "50px",
          fontFamily: "Inter",
        },
        input: {
          borderRadius: matches ? "8px" : "0px",
          width: matches ? "150px" : "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
          border: "1px solid rgb(209 213 219)",
          color: "#000",
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 500,
          backgroundColor: "#ffffff !important",
        },
      })}
      renderDay={(date) => {
        const day = date.getDate();
        const month = date.getMonth();
        return (
          <Indicator
            size={6}
            color="red"
            offset={0}
            disabled={
              day !== new Date().getDate() || month !== new Date().getMonth()
            }
          >
            <div>{day}</div>
          </Indicator>
        );
      }}
    />
  );
};

export default Datepicker;
