import React from 'react'
import { View } from 'react-native'
import { List, Text, useTheme, ToggleButton, TextInput, RadioButton } from 'react-native-paper'
import GlobalStyles from '@/constants/GlobalStyles'

export type RecurrenceWeekDateProps = { type: string, data?: { day: number, value: string, checked: boolean }[] | string };

export var daysOfTheWeek = [
    {
        day: 1,
        value: "Monday",
        checked: false
    },
    {
        day: 2,
        value: "Tuesday",
        checked: false
    },
    {
        day: 3,
        value: "Wednesday",
        checked: false
    },
    {
        day: 4,
        value: "Thursday",
        checked: false
    },
    {
        day: 5,
        value: "Friday",
        checked: false
    },
    {
        day: 6,
        value: "Saturday",
        checked: false
    },
    {
        day: 0,
        value: "Sunday",
        checked: false
    }
]

const RecurrenceListItem = ({ onDataChange, oldRecurrence }: { onDataChange: (val: RecurrenceWeekDateProps) => void, oldRecurrence?: string }) => {
    const [recurrence, setRecurrence] = React.useState("Once");
    const [isChanged, setIsChanged] = React.useState(false);
    const [selectedDays, setSelectedDays] = React.useState(daysOfTheWeek);
    const [selectedDayOfMonth, setSelectedDayOfMonth] = React.useState("1");
    const [customDay, setCustomDay] = React.useState("1");

    const theme = useTheme();
    const globalStyles = GlobalStyles();

    function selectRecurrence(txt: string) {
        setRecurrence(txt);
        setIsChanged(!isChanged);
    }

    function handleWeekChecks(i: number) {
        setSelectedDays(
            [...selectedDays.slice(0, i), { ...selectedDays[i], checked: !selectedDays[i].checked }, ...selectedDays.slice(i + 1)]
        );

    }

    function handleMonthChange(val: string) {
        setSelectedDayOfMonth(val);

    }

    React.useEffect(() => {
        onDataChange({ type: recurrence, data: recurrence === "Weekly" ? selectedDays : recurrence === "Monthly" ? /^[1-4]$/.test(selectedDayOfMonth) ? selectedDayOfMonth : customDay : undefined });
    }, [selectedDays, selectedDayOfMonth, recurrence, customDay])

    React.useEffect(() => {
        if (oldRecurrence) {
            const [recType, recData] = oldRecurrence.split("-");
            setRecurrence(recType);
            if (recType === "Weekly") {
                const days = daysOfTheWeek.map((day, i) => {
                    return {
                        day: day.day,
                        value: day.value,
                        checked: recData.includes(day.day.toString())
                    }
                });
                setSelectedDays(days);
            } else if (recType === "Monthly") {
                if (parseInt(recData) > 4 && recData !== "last") {
                    setSelectedDayOfMonth(`custom-${recData}`);
                    setCustomDay(recData);
                } else {
                    setSelectedDayOfMonth(recData);
                }
            } else {
                setRecurrence("Once");
            }
        }
    }, []);

    return (
        <React.Fragment>
            <View style={globalStyles["listItemWithDropdown"]}>
                <Text style={{ fontSize: 18 }}>Recurrence</Text>
                <View style={{ width: 144, position: "relative" }}>
                    <List.Accordion title={recurrence} expanded={isChanged} onPress={() => selectRecurrence(recurrence)} style={globalStyles["dropdown"]} right={(props) => <List.Icon {...props} icon="menu-down" />}>
                        <View style={{ position: "absolute", top: 36, zIndex: 100, backgroundColor: theme.colors.elevation.level1, borderRadius: 4 }}>
                            <List.Item title="Once" onPress={() => selectRecurrence("Once")} />
                            <List.Item title="Weekly" onPress={() => selectRecurrence("Weekly")} />
                            <List.Item title="Monthly" onPress={() => selectRecurrence("Monthly")} />
                        </View>
                    </List.Accordion>
                </View>
            </View>
            {recurrence === "Weekly" ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                    {
                        selectedDays.map((day, i) => {
                            return (
                                <ToggleButton
                                    key={i.toString()}
                                    icon={(props) => <Text style={{ fontSize: 18, fontWeight: '700' }}>{day.value[0]}</Text>}
                                    value={day.value}
                                    status={day.checked ? 'checked' : 'unchecked'}
                                    onPress={() => handleWeekChecks(i)}
                                    style={{ borderColor: theme.colors.inversePrimary, borderWidth: 1, borderRadius: 100, backgroundColor: day.checked ? theme.colors.inversePrimary : 'transparent' }}
                                />
                            )
                        })
                    }
                </View> :
                recurrence === "Monthly" ?
                    <View style={{ padding: 10, backgroundColor: theme.colors.elevation.level2, borderRadius: 6 }}>
                        <RadioButton.Group onValueChange={(val) => handleMonthChange(val)} value={selectedDayOfMonth}>
                            <RadioButton.Item label="First day of month" value="1" />
                            <RadioButton.Item label="Second day of month" value="2" />
                            <RadioButton.Item label="Third day of month" value="3" />
                            <RadioButton.Item label="Fourth day of month" value="4" />
                            <RadioButton.Item label="Last day of month" value="last" />
                            <RadioButton.Item label="Custom" value={`custom-${customDay}`} />
                            <TextInput
                                disabled={!/^custom-\d+$/.test(selectedDayOfMonth)}
                                keyboardType='numeric'
                                mode='flat'
                                value={customDay}
                                onChangeText={(val) => setCustomDay((val))}
                                label="Day of the month"
                                placeholder='Enter a day'
                                maxLength={2}
                                dense={true}
                                style={{ backgroundColor: 'transparent', width: 144, marginBottom: 24 }}
                            />
                        </RadioButton.Group>


                    </View> :
                    null
            }
        </React.Fragment>
    )
}

export default RecurrenceListItem;