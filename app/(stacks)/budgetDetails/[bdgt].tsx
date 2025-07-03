import React, { useCallback } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Appbar, Text, TextInput as PaperTextInput, useTheme, Button, FAB, Dialog, HelperText, Icon } from "react-native-paper";
import DateTimeListItem from "@/components/DateTimeListItem";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import GlobalStyles from "@/constants/GlobalStyles";
import { getItemAsync } from "expo-secure-store";
import { useSQLiteContext } from "expo-sqlite";
import { Budget } from "@/database/schemas/Budget";

const BudgetDetails = () => {

  const { bdgt } = useLocalSearchParams();

  const db = useSQLiteContext();

  const globalStyles = GlobalStyles();
  const theme = useTheme();
  const router = useRouter();

  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const [errDialogVisible, setErrDialogVisible] = React.useState<boolean>(false);
  const [errDialogVisible2, setErrDialogVisible2] = React.useState<boolean>(false);
  const [errMsg, setErrMsg] = React.useState("");

  const [budgetName, setBudgetName] = React.useState<string>('');
  const [capacity, setCapacity] = React.useState<number>(0);
  const [oldAmount, setOldAmount] = React.useState<string>('');
  const [newAmount, setNewAmount] = React.useState<string>('');
  const [currency, setCurrency] = React.useState<string>('USD');
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  useFocusEffect(
    useCallback(() => {
      (async function fetchData() {
        try {
          const data = await db.getFirstAsync<Budget>(`SELECT * FROM budgets WHERE bdgtId = ${bdgt} AND userId = 1`);
          if (data) {
            setBudgetName(data.bdgtName)
            setCapacity(data.bdgtCapacity)
            setOldAmount(data.bdgtAmount.toString())
            setNewAmount(data.bdgtAmount.toString())
            setStartDate(new Date(data.startDate.toString().split(' ')[0]))
            setEndDate(new Date(data.endDate.toString().split(' ')[0]))
          }
        } catch (error) {
          console.log(error)
        }
      })();

      (async function currency() {
        const mycurrency = await getItemAsync('currency')
        if (mycurrency) {
          setCurrency(mycurrency)
        }
      })()
    }, [])
  )

  async function updateBud() {
    if (budgetName == '') {
      setErrMsg("Budget");
      return;
    }
    if (newAmount === "" || newAmount === "0" || /^0+$/.test(newAmount)) {
      setErrMsg("Amount");
      return;
    }
    if (parseInt(newAmount) < capacity) {
      setErrDialogVisible2(true)
      return;
    }
    try {
      await db.runAsync(`
        UPDATE budgets SET bdgtName = ?, bdgtAmount = ? WHERE bdgtId = ? AND userId = ?
        `,
        [
          budgetName,
          newAmount,
          Number(bdgt),
          1
        ])
    } catch (err) {
      console.log(err)
    }
    router.replace('/budget')
  }

  async function deleteBudget(id: number) {
    try {
      await db.runAsync(`
        DELETE FROM budgets WHERE bdgtId = ? AND userId = ?
        `,
        [
          id,
          1
        ]);
    } catch (error) {
      console.log(error)
    }
    router.replace('/budget')
  }

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Action icon={"close"} onPress={() => router.back()} />
        <Appbar.Content title="" />
        <Appbar.Action icon="trash-can" onPress={() => setDialogVisible(true)} iconColor={theme.colors.error} isLeading={false} />
      </Appbar.Header>
      <View style={globalStyles["container"]}>
        <Text style={styles.label}>Budget name</Text>
        <PaperTextInput
          placeholder="Enter name"
          mode="outlined"
          style={{ marginVertical: 10 }}
          value={budgetName}
          onChangeText={(val) => setBudgetName(val)}
          dense={true}
        />
        <HelperText type="error" style={{ paddingVertical: 0, paddingHorizontal: 0 }} visible={errMsg === "Budget"}>Budget name must not be empty.</HelperText>
        <Text style={styles.label}>Amount</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <TextInput
            placeholder="00"
            secureTextEntry={true}
            maxLength={20}
            style={{ fontSize: 72, color: theme.colors.onBackground }}
            placeholderTextColor={theme.colors.elevation.level5}
            keyboardType="phone-pad"
            value={newAmount}
            onChangeText={(val) => setNewAmount(val)}
          />
          <Text>{currency}</Text>
        </View>
        <HelperText type="error" visible={errMsg === "Amount"}><Icon source={"information-outline"} size={12} color={theme.colors.error} />Amount must not be empty.</HelperText>
        <View style={{ gap: 8, marginTop: 8 }}>
          <DateTimeListItem onDateChange={() => { }} label="Start date" oldDate={startDate} />
          <DateTimeListItem onDateChange={() => { }} label="End date" oldDate={endDate} />
        </View>

        <FAB
          size='medium'
          mode='elevated'
          style={globalStyles.fab}
          color={theme.colors.onPrimary}
          icon="check"
          onPress={updateBud}
        />
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Delete budget</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this budget?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteBudget(Number(bdgt))}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
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
          <Dialog.Content><Text>Budget amount is lower than budget's capacity. Increase your budget amount.</Text></Dialog.Content>
          <Dialog.Actions>
            <Button mode='text' onPress={() => setErrDialogVisible2(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </React.Fragment>
  )
}

export default BudgetDetails;

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginTop: 10,
  }
})