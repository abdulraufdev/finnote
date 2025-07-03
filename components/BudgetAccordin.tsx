import React from "react";
import { View, StyleSheet } from "react-native";
import { List, useTheme } from "react-native-paper";
import { Budget } from "@/database/schemas/Budget";
import { useSQLiteContext } from "expo-sqlite";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const BudgetAccordin = ({onBudgetChange, firstFirst} : {onBudgetChange : (bdgt: Budget)=>void, firstFirst : (bdgt: Budget)=>void}) => {

    const db = useSQLiteContext();

    const [budgets, setBudgets] = React.useState<Budget[]>([]);
    const [budget, setBudget] = React.useState<Budget>();
    const [isChanged, setIsChanged] = React.useState(false);
    
    const theme = useTheme();
    const dropdown = useSharedValue(0);

    function selectBudget(bdget: Budget) {
        setBudget(bdget);
        setIsChanged(!isChanged);
        onBudgetChange({bdgtId: bdget.bdgtId, bdgtCapacity: bdget.bdgtCapacity, bdgtAmount: bdget.bdgtAmount, bdgtName: bdget.bdgtName, startDate: new Date(bdget.startDate.toString().split(" ")[0]), endDate: new Date(bdget.endDate.toString().split(" ")[0])});
        dropdown.value = withTiming(isChanged ? 100 : 0, {duration: 100});
    }
    
    React.useEffect(()=>{
        (async function fetchData(){
            try{
                const data = await db.getAllAsync<Budget>(`SELECT * FROM budgets WHERE userId = 1 ORDER BY bdgtId DESC LIMIT 1`);
                if(data){
                    setBudgets(data);
                    setBudget(data[0])
                    firstFirst({bdgtId: data[0].bdgtId, bdgtCapacity: data[0].bdgtCapacity, bdgtAmount: data[0].bdgtAmount, bdgtName: data[0].bdgtName, startDate: new Date(data[0].startDate.toString().split(" ")[0]), endDate: new Date(data[0].endDate.toString().split(" ")[0])})
                }
            } catch(err){
                console.log(err)
            }
        })();
    },[])

    
    return (
        <View style={styles.accordin}>
            <List.Accordion
            title={budget?.bdgtName}
            left={props => <List.Icon {...props} icon="credit-card" />}
            expanded={isChanged}
            onPress={() => setIsChanged(!isChanged)}
            style={{
                borderColor: theme.colors.backdrop,
                borderWidth: 1,
                borderRadius: 4,
                paddingVertical: 2
            }}
            >
                <Animated.View style={{height: dropdown}}>
                {
                    budgets.map((bdget,i)=>{
                        return (
                            <List.Item
                                title={bdget.bdgtName}
                                onPress={() => selectBudget(bdget)}
                                key={i.toString()}
                            />

                        )
                    })
                }
                </Animated.View>
            </List.Accordion>
        </View>
    )
}

const styles = StyleSheet.create({
    accordin: {
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 4,
    },
})

export default BudgetAccordin;