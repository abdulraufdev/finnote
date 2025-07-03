import { View, useColorScheme } from 'react-native'
import { Text, List,  useTheme } from 'react-native-paper'
import React, { useEffect } from 'react'
import { getItemAsync } from 'expo-secure-store'

type BudgetListItemProps = {
    text: string,
    startDate: Date,
    endDate: Date,
    amount: number,
    capacity: number,
    customkey?: string | number,
    func: () => void,
    leftComponent?: React.ReactNode,
    rightComponent?: React.ReactNode,
    customStyle?: object
}

const BudgetListItem = ({text, amount, capacity, customkey, startDate, endDate, func, leftComponent, rightComponent, customStyle} : BudgetListItemProps) => {
    const theme = useTheme();
    const colorScheme = useColorScheme();

    const [currency, setCurrency] = React.useState('USD')

    useEffect(()=>{
        (async function currency(){
            const mycurrency = await getItemAsync('currency')
            if(mycurrency){
                setCurrency(mycurrency)
            }
        })()
    })  
  return (
    <View key={customkey} >
      <List.Item title={()=>{
        return (
            <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
                <List.Icon  icon='calendar-blank-outline' color={theme.colors.outlineVariant} />
                <Text style={{fontSize: 18, color: theme.colors.outlineVariant, fontWeight: '700'}}>
                    {startDate.toLocaleDateString('en-GB',{
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
                 + " - "+ endDate.toLocaleDateString('en-GB',{
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })}</Text>
            </View>
            <Text style={{fontSize: 22, marginVertical: 8}}>{text}</Text>
            </View>
        )
        }}
        description={()=>{
        return (
            <View style={{gap: 4}}>
            <Text><Text style={{ color: capacity <=  10 ? theme.colors.error : theme.colors.secondary}}>{`${currency} ${capacity} `}</Text>left out of {amount}</Text>
            <View style={{backgroundColor: theme.colors.background, width: '100%', height: 10, borderRadius: 4, overflow: 'hidden'}}>
                <View style={{backgroundColor: capacity <=  10 ? theme.colors.error : theme.colors.primary, width: `${100 - capacity/amount*100}%`,flex: 1}}></View>
            </View>
            </View>
        )
        }}
        onPress={func}
        style={{backgroundColor: colorScheme == 'dark'  ? "#101010" : "#fff", ...customStyle}}
        />
    </View>
  )
}

export default BudgetListItem