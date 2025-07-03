import React, { useEffect } from "react";
import { View } from "react-native";
import { Card, Text, useTheme, IconButton } from "react-native-paper";
import GlobalStyles from "@/constants/GlobalStyles";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { RecurrenceWeekDateProps } from "./RecurrenceListItem";
import { useNavigationState } from "@react-navigation/native";

type AndroidMode = "date" | "time";

const daysOfWeek =
  new Date().getDay() === new Date().getUTCDay()
    ? [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]
    : [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
const DateTimeListItem = ({
  recurrenceData,
  onDateChange,
  label,
  oldDate
}: {
  recurrenceData?: RecurrenceWeekDateProps;
  onDateChange: (date: Date | string) => string | void;
  label: string;
  oldDate?: Date;
}) => {
  const theme = useTheme();
  const globalStyles = GlobalStyles();
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  const [date, setDate] = React.useState(new Date());
  const [dayTitle, setDayTitle] = React.useState<string>("Today");


  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      if (currentRoute === "BudgetModal") {
        if (selectedDate.toISOString().split("T")[0] >= new Date().toISOString().split("T")[0]) {
          setDate(selectedDate);
          const dateerror = onDateChange(selectedDate);
          if (typeof dateerror === "string") {
            return;
          }
          if (selectedDate.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]) {
            setDayTitle("Today");
          } else if (selectedDate.getFullYear().toString() + "-" + selectedDate.getMonth().toString() + "-" + selectedDate.getDate().toString() === new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + (new Date().getDate() + 1).toString()) {
            setDayTitle("Tomorrow");
          } else {
            setDayTitle(
              daysOfWeek[selectedDate.getDay()] +
              ", " +
              selectedDate.toLocaleDateString()
            );
          }
        } else {
          onDateChange("Invalid date")
        }
      }
      else if (currentRoute === "CreateExpensePage" || currentRoute === "expenseDetails/[exp]") {
        setDate(selectedDate);
        onDateChange(selectedDate);
        if (selectedDate.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]) {
          setDayTitle("Today");
        } else if (selectedDate.getFullYear().toString() + "-" + selectedDate.getMonth().toString() + "-" + selectedDate.getDate().toString() === new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + (new Date().getDate() + 1).toString()) {
          setDayTitle("Tomorrow");
        } else {
          setDayTitle(
            daysOfWeek[selectedDate.getDay()] +
            ", " +
            selectedDate.toLocaleDateString()
          );
        }
      } else {
        onDateChange("Invalid Date");
      }
    }
  };

  const showDatePicker = (val: AndroidMode | undefined) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: val,
      is24Hour: false
    });
  };



  useEffect(() => {
    let myTitle: string | string[] = [];
    let unchecked = 0;
    if (recurrenceData?.type === "Once") {
      if (date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]) {
        setDayTitle("Today");
      } else if (date.getFullYear().toString() + "-" + date.getMonth().toString() + "-" + date.getDate().toString() === new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + (new Date().getDate() + 1).toString()) {
        setDayTitle("Tomorrow");
      } else {
        setDayTitle(
          daysOfWeek[date.getDay()] +
          ", " +
          date.toLocaleDateString()
        );
      }
      return;
    }
    if (recurrenceData && recurrenceData.data) {
      if (typeof recurrenceData.data === 'string') {
        myTitle = recurrenceData.data + " day of each month";
      } else {
        myTitle = recurrenceData.data.map((day) => {
          if (day.checked) {
            return day.value;
          } else {
            unchecked++;
            return "";
          }
        });

        myTitle = myTitle.filter((day) => day !== "");
        if (myTitle.length > 1) {
          myTitle = myTitle.join(", ");
        } else {
          myTitle = "Every " + myTitle[0];
        }

        if (unchecked === 0) {
          myTitle = "Every day";
        } else if (unchecked === recurrenceData.data.length) {
          myTitle = "No day selected";
        }
      }
      setDayTitle(myTitle);
    }
  }, [recurrenceData, date, oldDate])

  useEffect(() => {
    if (oldDate) {
      if (currentRoute === "BudgetModal") {
        setDate(oldDate)
        setDayTitle("Tomorrow")
        return;
      }
    }
  }, [])

  useEffect(() => {
    if (oldDate && (currentRoute === "budgetDetails/[bdgt]" || currentRoute === "expenseDetails/[exp]")) {
      setDate(oldDate);
      setDayTitle(
        daysOfWeek[oldDate.getDay()] +
        ", " +
        oldDate.toLocaleDateString()
      );
    }
  }, [oldDate])


  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 18 }}>{label}</Text>
      <Card onPress={() => (currentRoute !== "budgetDetails/[bdgt]") ? (recurrenceData?.type === "Once") ? showDatePicker("date") : {} : {}}>
        <Card.Title
          title={dayTitle}
          left={() => currentRoute === "BudgetModal" ? (
            <IconButton
              size={26}
              icon={"calendar-blank-outline"}
              onPress={() => showDatePicker("date")}
            />
          ) : currentRoute === "budgetDetails/[bdgt]" ? null : recurrenceData?.type === "Once" ? (
            <IconButton
              size={26}
              icon={"calendar-blank-outline"}
              onPress={() => showDatePicker("date")}
            />
          ) : null
          }
          style={[
            globalStyles["cardWithBg"],
            { paddingRight: 10, paddingLeft: 0, gap: 4 },
          ]}
          titleStyle={{
            fontSize: 18, fontWeight: "700", paddingLeft: currentRoute !== "BudgetModal" ? recurrenceData?.type === "Once" ? 0 : 18 : 0, color: currentRoute !== "BudgetModal" ? recurrenceData?.type === "Once" ? theme.colors.onBackground : theme.colors.outlineVariant : theme.colors.onBackground
          }}
          leftStyle={{ width: 26, marginBottom: 6 }}
        />
      </Card>
    </View>
  );
};

export default DateTimeListItem;
