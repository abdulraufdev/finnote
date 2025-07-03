import { Transaction } from '@/database/schemas/Transaction';
import React from 'react'
import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native'
import {
  Appbar, useTheme,
  List,
  Divider,
  Text
} from 'react-native-paper';
import GlobalStyles from '@/constants/GlobalStyles';
import { WeeklyDonutChart } from '@/components/charts/WeeklyDonutChart';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getItemAsync } from 'expo-secure-store';
import { AllDataProps } from '@/database/schemas/AllDataProps';

const WeeklyDonutChartDetails = () => {

  const { chartdata } = useLocalSearchParams();

  const db = useSQLiteContext();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [transByCateg, setTransByCateg] = React.useState<AllDataProps[]>([]);
  const [currency, setCurrency] = React.useState('USD');

  const theme = useTheme();
  const colorScheme = useColorScheme();
  const globalStyles = GlobalStyles();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      if (chartdata === "Weekly") {
        (async function fetchData() {
          try {
            const data = await db.getAllAsync<Transaction>(`SELECT * FROM transactions WHERE userId=1 AND transDate BETWEEN DATE('now', 'weekday 0', '-6 days') AND DATE('now', 'weekday 0')`);
            if (data) {
              setTransactions(data);
            }
            const transData = await db.getAllAsync<AllDataProps>(`SELECT t.categId, count(t.amount) as amount, count(t.transId) as transId, c.categName as categName, c.categColor as categColor, c.categIcon as categIcon FROM transactions as t INNER JOIN categories as c ON t.categId=c.categId WHERE transDate BETWEEN DATE('now', 'weekday 0', '-6 days') AND DATE('now', 'weekday 0') GROUP BY t.categId HAVING t.userId = 1`)
            if (transData) {
              setTransByCateg(transData);
            }
          } catch (err) {
            console.log(err)
          }
        })();
      } else {
        (async function fetchData() {
          try {
            const transdata = await db.getAllAsync<Transaction>(`SELECT *
                  FROM transactions 
                  WHERE userId = 1 
                  AND transDate BETWEEN DATE('now', 'start of month') AND date('now', 'start of month', '+1 month', '-1 day')`);
            if (transdata) {
              setTransactions(transdata);
            }

            const totalAmount = await db.getAllAsync<AllDataProps>(`SELECT t.categId, count(t.amount) as amount, count(t.transId) as transId, c.categName as categName, c.categColor as categColor, c.categIcon as categIcon FROM transactions as t INNER JOIN categories as c ON t.categId=c.categId WHERE transDate BETWEEN DATE('now', 'start of month') AND date('now', 'start of month', '+1 month', '-1 day') GROUP BY t.categId HAVING t.userId = 1`)
            if (totalAmount) {
              setTransByCateg(totalAmount)
            }
          } catch (err) {
            console.log(err)
          }

        }
        )();
      }

      (async function currency() {
        const mycurrency = await getItemAsync('currency')
        if (mycurrency) {
          setCurrency(mycurrency)
        }
      })()
    }, [])
  );

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Categories" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={globalStyles["container"]}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <WeeklyDonutChart data={transByCateg} label="Overview" />
          </View>
          <Divider />
          <List.Section title={"Categories"}>
            {
              transByCateg.map((item, i) => {
                return (
                  <List.Accordion
                    title={item.categName}
                    left={props => <List.Icon {...props} color={theme.colors.background} style={{ backgroundColor: (item.categColor === "#37352f" || item.categColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : item.categColor, width: 42, height: 42, borderRadius: 100 }} icon={item.categIcon} />}
                    right={props => <Text {...props}>{item.transId}</Text>}
                    key={item.categId.toString()}
                  >
                    {
                      transactions.map((tr, i) => {
                        if (tr.categId === item.categId) {
                          return (
                            <List.Item style={{
                              borderLeftWidth: 2, borderLeftColor: theme.colors.elevation.level3, marginLeft: 20
                            }} title={tr.description || "(No description)"} description={new Date(tr.transDate.toString().split(" ")[0]).toLocaleDateString()} key={tr.transId?.toString()!} right={() => <Text>{currency + " " + tr.amount}</Text>} />
                          )
                        }
                      })
                    }
                  </List.Accordion>
                )
              })
            }
          </List.Section>
        </View>
      </ScrollView>
    </React.Fragment>
  )
}


export default WeeklyDonutChartDetails;