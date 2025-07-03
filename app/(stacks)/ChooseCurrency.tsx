import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, useColorScheme } from "react-native";
import { RadioButton, Appbar, useTheme, List, Button } from "react-native-paper";
import GlobalStyles from '@/constants/GlobalStyles';
import DefaultCurrencies from '@/constants/DefaultCurrencies';
import { setItemAsync } from "expo-secure-store";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOTTOM_APPBAR_HEIGHT = 80;

const getCurrencySymbol = (locale: undefined | string, currency: string) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();

const ChooseCurrency = () => {
  const [selectedCurrency, setselectedCurrency] = useState('USD');

  const globalStyles = GlobalStyles();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get('window');

  async function handleDefaultCurrency(currency: string) {
    await setItemAsync('currency', currency)
    setselectedCurrency(currency)
  }

  async function start() {
    await setItemAsync('usersuccessfullystarted', 'true');
    router.replace("/CreateBudget")
  }


  return (
    <React.Fragment>
      <ScrollView >
        <Appbar.Header mode='medium' style={{ height: 144 }}>
          <Appbar.Content title={`Choose your currency`} titleStyle={{ fontWeight: '700', lineHeight: 24 }} />
        </Appbar.Header>
        <View style={[globalStyles["container"], { minHeight: height - 144 - BOTTOM_APPBAR_HEIGHT - bottom }]}>
          <RadioButton.Group onValueChange={value => handleDefaultCurrency(value)} value={selectedCurrency}>
            <List.Section style={globalStyles["section"]}>
              {
                DefaultCurrencies.map((currency) => {
                  return <RadioButton.Item label={currency.name + " (" + getCurrencySymbol(undefined, currency.name) + ")"} style={{ backgroundColor: colorScheme == 'dark' ? "#101010" : "#fff" }} key={currency.id.toString()} value={currency.name} />
                })
              }
            </List.Section>
          </RadioButton.Group>

        </View>
      </ScrollView>
      <Appbar safeAreaInsets={{ bottom }} style={[
        styles.bottom,
        {
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          paddingHorizontal: 30,
          justifyContent: 'flex-end'
        }
      ]}
      >
        <Button mode="text" compact={true} labelStyle={{ fontSize: 20 }} onPress={start}>Next</Button>
      </Appbar>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  bottom: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  fab: {
    position: 'fixed',
    right: 16,
  },
});


export default ChooseCurrency;