import { DatePickerInput as MantineDatePicker } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "@mantine/hooks";

const Datepicker = ({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}) => {
  const matches = useMediaQuery("(min-width: 640px)");

  return (
    <MantineDatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick date"
      valueFormat="MMMM D, YYYY"
      size="md"
      clearable={false}
      styles={() => ({
        dropdown: {
          background: "#fff",
        },
        wrapper: {
          height: "50px",
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
