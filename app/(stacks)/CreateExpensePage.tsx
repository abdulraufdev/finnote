import { View, StyleSheet, TextInput, ScrollView, useColorScheme } from "react-native";
import {
  Appbar,
  List,
  Text,
  Icon,
  useTheme,
  FAB,
  ToggleButton,
  TextInput as PaperTextInput,
  Dialog,
  Button,
  HelperText,
} from "react-native-paper";
import { Collapsible } from '@/components/Collapsible'
import Styles from "@/constants/GlobalStyles";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { router, useFocusEffect } from "expo-router";
import { Category } from "@/database/schemas/Category";
import { Budget } from "@/database/schemas/Budget";
import RecurrenceListItem, { RecurrenceWeekDateProps } from "@/components/RecurrenceListItem";
import DateTimeListItem from "@/components/DateTimeListItem";
import BudgetAccordin from "@/components/BudgetAccordin";
import { useSQLiteContext } from "expo-sqlite";
import { getItemAsync } from "expo-secure-store";
import Animated, { Easing, useSharedValue, withTiming, } from "react-native-reanimated";

const createExpensePage = () => {

  const db = useSQLiteContext();

  const [expOrInc, setExpOrInc] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<Budget>({ bdgtId: 999, bdgtCapacity: 0, bdgtAmount: 0, bdgtName: "", startDate: new Date(), endDate: new Date() });
  const [isChanged, setIsChanged] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceWeekDateProps>({ type: "Once" });
  const [date, setDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState("USD");
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [errDialogVisible, setErrDialogVisible] = useState(false);
  const [errDialogVisible2, setErrDialogVisible2] = useState(false);
  const [errMsg, setErrMsg] = useState<(string | boolean)[]>([false, ""]);

  const overlay = useSharedValue(1);
  const dropdown = useSharedValue(0);

  const [categories, setCategories] = useState<Category[]>([]);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0);
  }, [overlay]);

  useFocusEffect(
    useCallback(() => {
      (async function fetchData() {
        try {
          const categData = await db.getAllAsync<Category>(`SELECT * FROM categories WHERE userId = 1`);
          if (categData) {
            setCategories(categData)
          }

          const bdgtData = await db.getFirstAsync<Budget>(`SELECT * FROM budgets WHERE userId = 1 AND bdgtId= (SELECT bdgtId from budgets WHERE userId=1 AND endDate >= DATE('now') ORDER BY bdgtId DESC LIMIT 1)`);
          console.log(bdgtData);
          if (bdgtData) {
            setSelectedBudget({
              bdgtId: bdgtData.bdgtId,
              bdgtName: bdgtData.bdgtName,
              bdgtAmount: bdgtData.bdgtAmount,
              bdgtCapacity: bdgtData.bdgtCapacity,
              startDate: new Date(bdgtData.startDate.toString().split(" ")[0]),
              endDate: new Date(bdgtData.endDate.toString().split(" ")[0])
            });

          } else setErrDialogVisible2(true);
        } catch (err) {
          console.log(err)
        }
        overlay.value = withTiming(0, { duration: 50, easing: Easing.inOut(Easing.ease) });
      })();

      (async function currency() {
        const mycurrency = await getItemAsync('currency')
        if (mycurrency) {
          setCurrency(mycurrency)
        }
      })()
    }, [])
  );

  const globalStyles = Styles();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  function selectExpOrInc(txt: string) {
    dropdown.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    setExpOrInc(txt);
    setIsChanged(!isChanged);
  }

  function createExp(proceed?: boolean) {
    if (amount === "" || amount === "0" || /^0+$/.test(amount)) {
      setErrMsg([true, "Amount can not be empty"]);
      return;
    }
    if (/[^0-9]/.test(amount)) {
      setErrMsg([true, "Amount must be a number"]);
      return;
    }
    if ((selectedBudget.bdgtAmount - selectedBudget.bdgtCapacity) < parseInt(amount) && !proceed) {
      setErrDialogVisible(true);
      return;
    }

    (async function insertData() {
      try {
        await db.runAsync(
          `
          INSERT INTO transactions (userId, type, amount, description, transDate, transCreatedAt, transRecurrence, categId, bdgtId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [1, expOrInc,
            parseInt(amount),
            description,
            recurrence.type === "Once" ?
              date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0]
              :
              new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split(" ")[0]
            ,
            new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split(" ")[0],
            recurrence.data ?
              typeof recurrence.data === "string" ?
                `Monthly-${recurrence.data}` :
                `Weekly-${recurrence.data.map(d => d.checked ? d.day : null).join("")}`
              : `Once-0`,
            selectedCategory,
            selectedBudget.bdgtId ? selectedBudget.bdgtId : 1,
          ]
        );

        await db.runAsync(
          `
          UPDATE budgets SET bdgtCapacity = ? WHERE bdgtId = ? AND userId = ?
          `,
          [
            expOrInc === "Expense" ? selectedBudget.bdgtCapacity + parseInt(amount) : selectedBudget.bdgtCapacity,
            selectedBudget.bdgtId ? selectedBudget.bdgtId : 1,
            1
          ]
        )
      }
      catch (err) {
        console.log(err)
      }
    })()
    router.replace("/")
  }

  function handleRecurrenceChange(val: RecurrenceWeekDateProps) {
    console.log(val);
    setRecurrence(val);
  }

  function handleDateChange(date: Date | string) {
    if (typeof date === 'string') {
      console.log("Error");
    } else {
      setDate(date);
    }
  }

  function handleBudgetChange(bdgt: Budget) {
    setSelectedBudget(bdgt);
  }

  function firstt(bdgt: Budget) {
    setSelectedBudget(bdgt);
  }

  return (
    <React.Fragment>
      <Appbar.Header >
        <Appbar.Action icon="close" onPress={() => router.back()} />
      </Appbar.Header>
      <Animated.View style={{
        flex: 1,
        position: 'absolute',
        inset: 0,
        backgroundColor: theme.colors.primary,
        zIndex: 10,
        pointerEvents: 'none',
        opacity: overlay,
      }}>
      </Animated.View>
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
              ref={inputRef}
              maxLength={12}
              textAlign="right"
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
              onPress={() => {
                setIsChanged(!isChanged);
                dropdown.value = withTiming(isChanged ? 0 : 1, { duration: 300, easing: Easing.out(Easing.ease) });
              }}
              style={[globalStyles["dropdownWithBg"], { position: 'relative' }]}
              right={(props) => <List.Icon {...props} icon="menu-down" />}
            >
              <Animated.View style={{ position: 'absolute', top: 32, zIndex: 3, opacity: dropdown }}>
                <List.Item
                  title={"Income"}
                  style={globalStyles["dropdown?"].item}
                  onPress={() => {
                    dropdown.value = withTiming(isChanged ? 0 : 1, { duration: 300, easing: Easing.out(Easing.ease) });
                    selectExpOrInc("Income")
                  }}
                />
                <List.Item
                  title={"Expense"}
                  style={globalStyles["dropdown?"].item}
                  onPress={() => {
                    dropdown.value = withTiming(isChanged ? 0 : 1, { duration: 300, easing: Easing.out(Easing.ease) });
                    selectExpOrInc("Expense")
                  }}
                />
              </Animated.View>
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
                  <Button onPress={() => router.push("/CreateCategoryPage")} style={{ borderRadius: 6, paddingHorizontal: 'auto', justifyContent: 'center', flex: 1, minWidth: 96, height: 96 }} mode="contained-tonal" icon={"plus"}>New category</Button>
                </View>
              </ToggleButton.Group>
            )}
          </View>
          <Collapsible title="More options" style={{ marginTop: 12 }}>
            <View style={{ marginBottom: 80, gap: 12 }}>
              <RecurrenceListItem onDataChange={handleRecurrenceChange} />
              <DateTimeListItem onDateChange={handleDateChange} recurrenceData={recurrence} label="Date & Time" />
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
          mode='elevated'
          size='medium'
          icon={'check'}
          style={globalStyles["fab"]}
          color={globalStyles["fab?"].icon.color}
          onPress={() => createExp(false)}
        />
        <Dialog
          visible={errDialogVisible}
          onDismiss={() => setErrDialogVisible(false)}
        >
          <Dialog.Title>Budget limit crossed</Dialog.Title>
          <Dialog.Content><Text>Your amount is larger than your budget's capacity. </Text></Dialog.Content>
          <Dialog.Actions>
            <Button mode='text' onPress={() => setErrDialogVisible(false)}>Cancel</Button>
            <Button mode='text' onPress={() => { setErrDialogVisible(false); createExp(true); }} textColor={theme.colors.error}>Proceed</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={errDialogVisible2}
          onDismiss={() => setErrDialogVisible2(false)}
        >
          <Dialog.Title>Budget not found</Dialog.Title>
          <Dialog.Content><Text>Looks like you have not added your budget. </Text></Dialog.Content>
          <Dialog.Actions>
            <Button mode='text' onPress={() => { setErrDialogVisible2(false); router.back() }}>Go back</Button>
            <Button mode='contained' onPress={() => { setErrDialogVisible2(false); router.push('/BudgetModal') }} >Add budget</Button>
          </Dialog.Actions>
        </Dialog>

      </View>
    </React.Fragment>
  );
};

export default createExpensePage;

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
})
