import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native'
import { useTheme, Appbar, List, Text, Dialog, RadioButton } from 'react-native-paper'
import ListItem from '@/components/ListItem'
import GlobalStyles from '@/constants/GlobalStyles'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import DefaultCurrencies from '@/constants/DefaultCurrencies'
import * as Linking from 'expo-linking';

const getCurrencySymbol = (locale: undefined | string, currency: string) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();

const settings = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCurrency, setselectedCurrency] = useState('USD');


  const theme = useTheme();
  const colorScheme = useColorScheme();
  const globalStyles = GlobalStyles();

  useEffect(() => {
    (async function () {
      var currentCurrency = await getItemAsync('currency')
      console.log(currentCurrency)
      if (currentCurrency) {
        setselectedCurrency(currentCurrency)
      }
    })()
  })

  async function handleDefaultCurrency(currency: string) {
    await setItemAsync('currency', currency)
    setselectedCurrency(currency)
    setDialogVisible(false)
  }

  return (
    <React.Fragment>
      <ScrollView>
        <Appbar.Header mode='medium' style={{ height: 144 }}>
          <Appbar.Content title="Settings" titleStyle={{ fontWeight: '700', fontSize: 48, lineHeight: 56 }} />
        </Appbar.Header>
        <View style={[globalStyles["container"], { backgroundColor: colorScheme == 'dark' ? theme.colors.background : "#f4f5f7" }]}>
          <List.Section >
            <List.Subheader style={[styles.subhead, { color: theme.colors.primary }]}>Appearence</List.Subheader>
            <List.Section style={globalStyles["section"]}>
              <ListItem text="Default currency" func={() => setDialogVisible(true)} rightComponent={<Text>{selectedCurrency}</Text>} />
              <ListItem text="Theme" desc="Uses system's default theme" func={() => { }} />
            </List.Section>
          </List.Section>
          <List.Section>
            <List.Subheader style={[styles.subhead, { color: theme.colors.primary }]}>Manage</List.Subheader>
            <List.Section style={globalStyles["section"]}>
              <ListItem text="Reminders" func={() => router.push("/RemindersPage")} />
              <ListItem text="Regular expenses and income" func={() => router.push("/RegularExpensesPage")} />
              <ListItem text="Categories" func={() => router.push("/CategoriesPage")} />
              <ListItem text="Security" func={() => router.push('/SecurityPage')} />
            </List.Section>
          </List.Section>
          <List.Section >
            <List.Subheader style={[styles.subhead, { color: theme.colors.primary }]}>Backup & Restore</List.Subheader>
            <List.Section style={globalStyles["section"]}>
              <ListItem text="Import data" desc='Import from a Spreadsheet' func={() => router.push('/ImportModal')} />
              <ListItem text="Export to XLSX" desc='Export your expenses to a Spreadsheet' func={() => router.push('/ExportModal')} />
            </List.Section>
          </List.Section>
          <List.Section>
            <List.Subheader style={[styles.subhead, { color: theme.colors.primary }]}>Others</List.Subheader>
            <List.Section style={globalStyles["section"]}>
              <ListItem text="Version" desc='1.0.0' func={() => { }} />
              <ListItem text="About" func={() => router.push("/AboutPage")} />
              <ListItem text="Report a bug" func={() => Linking.openURL("https://github.com/abdulraufdev/finnote/issues")} />
            </List.Section>
          </List.Section>
        </View>
      </ScrollView>
      <Dialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        style={{ borderRadius: 16, backgroundColor: theme.colors.surface, alignItems: 'flex-start' }}
      >
        <Dialog.Title>Choose your default currency</Dialog.Title>
        <Dialog.Actions>
          <RadioButton.Group onValueChange={value => handleDefaultCurrency(value)} value={selectedCurrency}>
            {
              DefaultCurrencies.map((currency, index) => {
                return <RadioButton.Item label={currency.name + " (" + getCurrencySymbol(undefined, currency.name) + ")"} position='leading' labelStyle={{ textAlign: 'left' }} key={currency.id.toString()} value={currency.name} />
              })
            }
          </RadioButton.Group>
        </Dialog.Actions>
      </Dialog>
      <StatusBar style="auto" />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  subhead: { fontWeight: '700' },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  status: {
    marginTop: 15,
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 10,
  }
})

export default settings;