import { DatePickerInput as MantineDatePicker } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

const Datepicker = ({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}) => {
  return (
    <MantineDatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick date"
      valueFormat="MMMM D, YYYY"
      size="md"
      radius="md"
      clearable={false}
      styles={() => ({
        dropdown: {
          background: "#fff",
        },
        wrapper: {
          height: "50px",
        },
        input: {
          height: "50px",
          border: "2px solid #F4F8F9",
          color: "#494A4B",
          fontFamily: "Inter",
          fontSize: "14px",
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
