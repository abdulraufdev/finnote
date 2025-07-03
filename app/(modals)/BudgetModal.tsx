import React from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView } from "react-native";
import {
    Text,
    TextInput as PaperTextInput,
    HelperText,
    Dialog,
    Button,
    FAB,
    Icon,
    useTheme,
} from "react-native-paper";
import GlobalStyles from "@/constants/GlobalStyles";
import { getItemAsync } from "expo-secure-store";
import { useRouter } from "expo-router";
import DateTimeListItem from "@/components/DateTimeListItem";
import { useSQLiteContext } from "expo-sqlite";

const BudgetModal = () => {

    const db = useSQLiteContext();
    const theme = useTheme();
    const globalStyles = GlobalStyles();
    const router = useRouter();

    const [budgetName, setBudgetName] = React.useState('')
    const [errMsg, setErrMsg] = React.useState<string>("")
    const [amount, setAmount] = React.useState("")
    const [currency, setCurrency] = React.useState('USD')
    const [startDate, setStartDate] = React.useState<Date>(new Date())
    const [endDate, setEndDate] = React.useState<Date>(new Date(startDate.toISOString().slice(0, 8) + (startDate.getDate() + 1)))
    const [errDialogVisible, setErrDialogVisible] = React.useState(false)
    const [errDialogVisible2, setErrDialogVisible2] = React.useState(false)

    React.useEffect(() => {
        (async function currency() {
            const mycurrency = await getItemAsync('currency')
            if (mycurrency) {
                setCurrency(mycurrency)
            }
        })()
    }, [])

    function createBud() {
        if (budgetName == '') {
            setErrMsg("Budget");
            return;
        }
        if (amount === "" || amount === "0" || /^0+$/.test(amount)) {
            setErrMsg("Amount");
            return;
        }
        if (/[^0-9]/.test(amount)) {
            setErrMsg("Non-num");
            return;
        }
        (async function insertData() {
            try {
                await db.runAsync(
                    `
                INSERT INTO budgets (bdgtName, userId, bdgtAmount, bdgtCapacity, startDate, endDate) VALUES(?, ?, ?, ?, ?, ?)
                `,
                    [
                        budgetName,
                        1,
                        amount,
                        0,
                        startDate.toISOString().split("T")[0] + " " + startDate.toTimeString().split(" ")[0],
                        endDate.toISOString().split("T")[0] + " " + endDate.toTimeString().split(" ")[0]
                    ]
                )
            }
            catch (err) {
                console.log(err)
            }
        })()
        router.replace("/budget")
    }

    function handleStartDateChange(date: Date | string) {
        if (typeof date === 'string') {
            setErrDialogVisible(true)
        } else
            if (date >= endDate) {
                setErrDialogVisible2(true)
                return "startdate";
            } else {
                setStartDate(date)
            }
    }
    function handleEndDateChange(date: Date | string) {
        if (typeof date === 'string') {
            setErrDialogVisible(true)
        } else if (date <= startDate) {
            setErrDialogVisible2(true)
            return "enddate";
        } else {
            setEndDate(date)
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={globalStyles["container"]}>
                    <Text style={styles.label}>Budget name</Text>
                    <PaperTextInput
                        placeholder="Enter name"
                        mode="outlined"
                        style={{ marginVertical: 10 }}
                        value={budgetName}
                        onChangeText={(val) => setBudgetName(val)}
                        error={errMsg === "Budget"}
                        dense={true}
                    />
                    <HelperText type="error" style={{ paddingVertical: 0, paddingHorizontal: 0 }} visible={errMsg === "Budget"}>Budget name must not be empty.</HelperText>
                    <Text style={styles.label}>Amount</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            placeholder="00"
                            secureTextEntry={true}
                            maxLength={20}
                            style={{ fontSize: 72, color: theme.colors.onBackground }}
                            placeholderTextColor={theme.colors.elevation.level5}
                            keyboardType="phone-pad"
                            value={amount}
                            onChangeText={(val) => setAmount(val)}
                        />
                    </View>
                    <Text>{currency}</Text>
                    <HelperText type="error" visible={errMsg === "Amount" ? true : false}><Icon source={"information-outline"} size={12} color={theme.colors.error} />Amount must not be empty.</HelperText>
                    <HelperText type="error" visible={errMsg === "Non-num" ? true : false}><Icon source={"information-outline"} size={12} color={theme.colors.error} />Amount must be a number.</HelperText>
                    <View style={{ gap: 8, marginTop: 8 }}>
                        <DateTimeListItem onDateChange={handleStartDateChange} label="Start date" />
                        <DateTimeListItem onDateChange={handleEndDateChange} label="End date" oldDate={endDate} />
                    </View>
                    <FAB
                        mode='elevated'
                        size='medium'
                        icon={'check'}
                        style={globalStyles["fab"]}
                        color={globalStyles["fab?"].icon.color}
                        onPress={createBud}
                    />
                    <Dialog
                        visible={errDialogVisible}
                        onDismiss={() => setErrDialogVisible(false)}
                    >
                        <Dialog.Content><Text>The date must be in future. Please enter again.</Text></Dialog.Content>
                        <Dialog.Actions>
                            <Button mode='text' onPress={() => setErrDialogVisible(false)}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={errDialogVisible2}
                        onDismiss={() => setErrDialogVisible2(false)}
                    >
                        <Dialog.Content><Text>The ending date can not be older than the starting date.</Text></Dialog.Content>
                        <Dialog.Actions>
                            <Button mode='text' onPress={() => setErrDialogVisible2(false)}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default BudgetModal;

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        marginTop: 10,
    }
})