import { View, StyleSheet, TextInput, ScrollView, useColorScheme } from "react-native";
import {
  Appbar,
  List,
  Icon,
  Button,
  useTheme,
  FAB,
  ToggleButton,
  Text,
  TextInput as PaperTextInput,
  Dialog,
  HelperText,
} from "react-native-paper";
import { Collapsible } from "@/components/Collapsible";
import Styles from "@/constants/GlobalStyles";
import React, { useCallback, useState } from "react";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Category } from "@/database/schemas/Category";
import RecurrenceListItem, { RecurrenceWeekDateProps } from "@/components/RecurrenceListItem";
import DateTimeListItem from "@/components/DateTimeListItem";
import BudgetAccordin from "@/components/BudgetAccordin";
import { Budget } from "@/database/schemas/Budget";
import { useSQLiteContext } from "expo-sqlite";
import { getItemAsync } from "expo-secure-store";
import { AllDataProps } from "@/database/schemas/AllDataProps";

const ExpDetails = () => {

  const { exp } = useLocalSearchParams();

  const db = useSQLiteContext();
  const globalStyles = Styles();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const [expOrInc, setExpOrInc] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceWeekDateProps>({ type: "Once" });
  const [date, setDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState("USD");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errDialogVisible, setErrDialogVisible] = useState(false);
  const [errMsg, setErrMsg] = useState<(string | boolean)[]>([false, ""]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<Budget>({ bdgtId: 1, bdgtCapacity: 0, bdgtAmount: 0, bdgtName: "", startDate: new Date(), endDate: new Date() });
  const [categories, setCategories] = useState<Category[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async function fetchData() {
        try {
          const data = await db.getFirstAsync<AllDataProps>(`SELECT * FROM transactions INNER JOIN budgets ON transactions.bdgtId = budgets.bdgtId WHERE transId = ${exp}`)
          if (data) {
            setExpOrInc(data.type)
            setAmount(data.amount.toString())
            setDescription(data.description)
            setRecurrence({ type: data.transRecurrence.split("-")[0], data: data.transRecurrence.split("-")[1] });
            setSelectedCategory(data.categId)
            setSelectedBudget({ bdgtId: data.bdgtId, bdgtCapacity: data.bdgtCapacity, bdgtAmount: data.bdgtAmount, bdgtName: data.bdgtName, startDate: new Date(data.startDate.toString().split(" ")[0]), endDate: new Date(data.endDate.toString().split(" ")[0]) })
            setDate(new Date(data.transDate))
          }

          const categData = await db.getAllAsync<Category>(`SELECT * FROM categories WHERE userId = 1`);
          if (categData) {
            setCategories(categData)
          }
        } catch (err) {
          console.log(err)
        }
      })();

      (async function currency() {
        const mycurrency = await getItemAsync('currency')
        if (mycurrency) {
          setCurrency(mycurrency)
        }
      })()
    }, []));

  function selectExpOrInc(txt: string) {
    setExpOrInc(txt);
    setIsChanged(!isChanged);
  }

  function handleRecurrenceChange(val: RecurrenceWeekDateProps) {
    setRecurrence(val);
  }

  function handleDateChange(date: Date | string) {
    if (typeof date === 'string') {
      console.log("Error");
    } else {
      setDate(date);
    }
  }

  function updateExp(proceed?: boolean) {
    if (amount === "") {
      setErrMsg([true, "Amount cannot be empty"]);
      return;
    }

    if ((selectedBudget?.bdgtAmount - selectedBudget?.bdgtCapacity) < parseInt(amount) && !proceed) {
      setErrDialogVisible(true);
      return;
    }
    (async function updateData() {
      try {
        await db.runAsync(`
          UPDATE transactions SET type = ?, amount = ?, description = ?, transDate = ?, transRecurrence = ?, categId = ? WHERE transId = ? AND userId = 1
          `,
          [expOrInc,
            Number(amount),
            description,
            date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(" ")[0],
            recurrence.data ?
              typeof recurrence.data === "string" ?
                `Monthly-${recurrence.data}` :
                `Weekly-${recurrence.data.map(d => d.checked ? d.day : null).join("")}`
              : `Once-0`,
            selectedCategory,
            Number(exp)]
        );

        await db.runAsync(
          `
          UPDATE budgets SET bdgtCapacity = ?, startDate = ?, endDate = ? WHERE bdgtId = ? AND userId = ?
          `,
          [
            expOrInc === "Expense" ? selectedBudget.bdgtCapacity + parseInt(amount) : selectedBudget.bdgtCapacity,
            selectedBudget.bdgtId ? selectedBudget.bdgtId : 1,
            1
          ]
        );
      } catch (err) {
        console.log(err);
      }
    })();
    router.replace('/');
  }

  async function handleDeleteExp(id: number) {
    try {
      await db.runAsync(`DELETE FROM transactions WHERE transId = ${id} AND userId = 1`);

      await db.runAsync(
        `
          UPDATE budgets SET bdgtCapacity = ? WHERE bdgtId = ? AND userId = ?
          `,
        [
          expOrInc === "Expense" ? selectedBudget.bdgtCapacity - parseInt(amount) : selectedBudget.bdgtCapacity,
          selectedBudget.bdgtId ? selectedBudget.bdgtId : 1,
          1
        ]
      );
    } catch (err) {
      console.log(err);
    }
    router.replace('/');
  }


  function handleBudgetChange(bdgt: Budget) {
    setSelectedBudget(bdgt);
  }
  function firstt(bdgt: Budget) {
    setSelectedBudget(bdgt);
  }


  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={() => router.back()} />
        <Appbar.Content title="" />
        <Appbar.Action icon="trash-can" onPress={() => setDialogVisible(true)} iconColor={theme.colors.error} isLeading={false} />
      </Appbar.Header>
      <View style={globalStyles["container"]}>
        <ScrollView>
          <BudgetAccordin onBudgetChange={handleBudgetChange} firstFirst={firstt} />
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <TextInput
              placeholder="00"
              secureTextEntry={true}
              maxLength={12}
              style={{ fontSize: 72, flex: 4, color: theme.colors.onBackground }}
              placeholderTextColor={theme.colors.elevation.level5}
              keyboardType="phone-pad"
              value={amount.toString()}
              onChangeText={(val) => setAmount(val)}
            />
            <Text style={{ flex: 0.3 }}>{currency}</Text>
          </View>
          <HelperText type="error" visible={typeof errMsg[0] === 'boolean' ? errMsg[0] : false}><Icon source={"information-outline"} size={12} color={theme.colors.error} /> {errMsg[1]}</HelperText>
          <View style={{ width: 144, alignSelf: 'flex-end' }}>
            <List.Accordion
              title={expOrInc}
              expanded={isChanged}
              onPress={() => selectExpOrInc(expOrInc)}
              style={[globalStyles["dropdownWithBg"], { position: 'relative' }]}
              right={(props) => <List.Icon {...props} icon="menu-down" />}
            >
              <View style={{ position: 'absolute', top: 32, zIndex: 3 }}>
                <List.Item
                  title={"Income"}
                  style={globalStyles["dropdown?"].item}
                  onPress={() => selectExpOrInc("Income")}
                />
                <List.Item
                  title={"Expense"}
                  style={globalStyles["dropdown?"].item}
                  onPress={() => selectExpOrInc("Expense")}
                />
              </View>
            </List.Accordion>
          </View>
          <View>
            {categories.length == 0 ? (
              <View>
                <Text>No categories found</Text>
              </View>
            ) : (
              <ToggleButton.Group onValueChange={(val) => setSelectedCategory(Number(val))} value={selectedCategory.toString()}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categGrid}>
                  {categories.map((category: Category, index: number) => {
                    return (
                      <ToggleButton
                        icon={() => (
                          <View style={{ alignItems: 'center', gap: 4 }}>
                            <Icon source={category.categIcon} color={(category.categColor === "#37352f" || category.categColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : category.categColor} size={32} />
                            <Text style={{ fontSize: 18 }}>{category.categName}</Text>
                          </View>
                        )}
                        value={category.categId?.toString()}
                        key={index.toString()}
                        style={{ borderRadius: 6, paddingHorizontal: 'auto', flex: 1, minWidth: 96, height: 96, backgroundColor: selectedCategory === category.categId ? `${(category.categColor === "#37352f" || category.categColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : category.categColor}33` : colorScheme === 'dark' ? "#212121" : "#f4f5f7" }}

                      />
                    );
                  })}
                </View>
              </ToggleButton.Group>
            )}
          </View>
          <Collapsible title="More options" style={{ marginTop: 12 }}>
            <View style={{ marginBottom: 80, gap: 12 }}>
              <RecurrenceListItem onDataChange={handleRecurrenceChange} oldRecurrence={recurrence.type + "-" + recurrence.data} />
              <DateTimeListItem onDateChange={handleDateChange} recurrenceData={recurrence} label="Date & Time" oldDate={date} />
              <Text style={styles.label}>Description</Text>
              <PaperTextInput
                mode='outlined'
                style={[{ marginVertical: 10 }, { height: 144 }]}
                value={description}
                onChangeText={(val) => setDescription(val)}
                placeholder='Enter Description'
                textContentType='fullStreetAddress'
                multiline={true}
              />

            </View>
          </Collapsible>
        </ScrollView>
        <FAB
          size='medium'
          mode='elevated'
          style={globalStyles.fab}
          color={theme.colors.onPrimary}
          icon="check"
          onPress={() => updateExp(false)}
        />
        <Dialog
          visible={errDialogVisible}
          onDismiss={() => setErrDialogVisible(false)}
        >
          <Dialog.Title>Budget limit crossed</Dialog.Title>
          <Dialog.Content><Text>Your amount is larger than your budget's capacity. </Text></Dialog.Content>
          <Dialog.Actions>
            <Button mode='text' onPress={() => setErrDialogVisible(false)}>Cancel</Button>
            <Button mode='text' onPress={() => { setErrDialogVisible(false); updateExp(true); }} textColor={theme.colors.error}>Proceed</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Delete this {expOrInc}</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this {expOrInc}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => handleDeleteExp(Number(exp))}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </React.Fragment>
  );
};

function calcCapacity(num: number | undefined, amount: number) {
  if (num) {
    if (num < 0) return (num + amount)
    else return (num - amount)
  } else {
    return 0;
  }
}

const styles = StyleSheet.create({
  categGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
  }
});

export default ExpDetails;
