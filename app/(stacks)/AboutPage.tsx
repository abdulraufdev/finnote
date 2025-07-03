import { useRouter } from "expo-router";
import { Appbar, Text, Card, Icon, TouchableRipple } from "react-native-paper";
import { ScrollView, View } from "react-native";
import GlobalStyles from "@/constants/GlobalStyles";
import React from "react";
import * as Linking from 'expo-linking';

const AboutPage = () => {
  const router = useRouter();
  const globalStyles = GlobalStyles();

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => router.back()}
        />
        <Appbar.Content title="About" />
      </Appbar.Header>
      <ScrollView style={globalStyles["container"]}>
        <Text variant="displayLarge">Finnote</Text>
        <Text>
          Finnote is a comprehensive budget tracking app designed to simplify personal finance management on mobile devices. With a user-friendly interface and innovative features, Finnote helps you keep track of your expenses and income effortlessly. Whether you're looking to monitor daily spending or plan for long-term financial goals, Finnote offers the tools you need to stay on top of your finances.
        </Text>
        <Text variant="titleMedium" style={{ marginTop: 16 }}>Features</Text>
        <View style={{ flexDirection: 'column', gap: 8, marginTop: 8, marginBottom: 16 }}>
          <Text>📈 Expense and Income Tracking: Easily add new transactions with options to type notes or record your voice, all while enjoying romantic background music.</Text>
          <Text>💵 Financial Insights: Access quick summaries and comparisons between your expenses and income to understand your financial habits better.</Text>
          <Text>🔠 Spending Categories: Identify top spending categories weekly and monthly to make informed budgeting decisions.</Text>
          <Text>⌚ Time Hierarchy: Trace transactions from the year to the day, allowing you to identify patterns and adjust your spending accordingly.</Text>

        </View>
        <TouchableRipple onPress={() => Linking.openURL('https://github.com/abdulraufdev/finnote')}>
          <Card contentStyle={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Card.Title title="GitHub" subtitle="Source code." left={() => <Icon source="github" size={32} />} right={() => <Icon source="arrow-top-right" size={32} />} />

          </Card>
        </TouchableRipple>
      </ScrollView>
    </React.Fragment>
  );
};

export default AboutPage;
