import { StyleSheet, View, useColorScheme } from "react-native"
import {
    Text,
    Appbar,
    List,
    ActivityIndicator,
    useTheme
} from 'react-native-paper'
import ListItem from "@/components/ListItem"
import React, { useCallback } from "react"
import GlobalStyles from '@/constants/GlobalStyles'
import { useRouter, useFocusEffect } from "expo-router"
import { getItemAsync } from "expo-secure-store"
import { AllDataProps } from "@/database/schemas/AllDataProps"
import { useSQLiteContext } from "expo-sqlite"

const RegularExpensesPage = () => {

    const db = useSQLiteContext();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const globalStyles = GlobalStyles();
    const theme = useTheme();

    const [expenses, setExpenses] = React.useState<AllDataProps[]>([]);
    const [currency, setCurrency] = React.useState('USD');
    const [isLoading, setIsLoading] = React.useState(false);

    useFocusEffect(
        useCallback(() => {
            (async function fetchData() {
                try {
                    setIsLoading(true);
                    const data = await db.getAllAsync<AllDataProps>(`
                SELECT *
                FROM transactions as t
                INNER JOIN budgets as b ON t.bdgtId = b.bdgtId 
                INNER JOIN categories as c ON t.categId = c.categId 
                WHERE t.transRecurrence <> 'Once-0'`)
                    if (data) {
                        setExpenses(data)
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    setIsLoading(false);
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

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.replace('/settings')} />
                <Appbar.Content title="Regular Expenses" />
            </Appbar.Header>
            <View style={globalStyles["container"]}>
                {
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <List.Section
                            style={{ borderRadius: 16, overflow: 'hidden', gap: 2, marginTop: 0 }}
                        >
                            {
                                expenses.length == 0 ?
                                    <Text>No regular expenses</Text> :
                                    expenses.map((exp, i) => {
                                        return exp.transId ? (
                                            <ListItem
                                                key={exp.transId.toString()}
                                                customkey={i.toString()}
                                                text={exp.categName}
                                                desc={exp.description + ", " + exp.transRecurrence.split('-')[0]}
                                                func={() => router.push({ pathname: '/expenseDetails/[exp]', params: { exp: exp.transId ? exp.transId.toString() : '' } })}
                                                leftComponent={<View style={{ width: 42, height: 42, borderRadius: 100, marginLeft: 20, backgroundColor: (exp.categColor === "#37352f" || exp.categColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : exp.categColor, justifyContent: 'center', alignItems: 'center' }}><List.Icon color={theme.colors.background} icon={exp.categIcon} /></View>}
                                                rightComponent={<Text style={styles.amountLabel}>{(exp.type === "Expense" ? "- " : "+ ") + currency + " " + exp.amount.toString()}</Text>}
                                            />
                                        ) :
                                            null
                                    })
                            }
                        </List.Section>
                    )
                }
            </View>
        </React.Fragment>

    )
}

export default RegularExpensesPage;

const styles = StyleSheet.create({
    amountLabel: { fontWeight: '700', fontSize: 18, alignSelf: 'center' }
})