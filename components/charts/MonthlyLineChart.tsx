import React from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { Transaction } from '@/database/schemas/Transaction';
import { useTheme, Text } from 'react-native-paper';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getChartData(transactions: any[], year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  // Initialize all days to 0
  const dailyTotals = Array(daysInMonth).fill(0);

  transactions.forEach((t) => {
    if (t.type === 'Expense') {
      const date = new Date(t.transDate);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const day = date.getDate(); // 1-based
        dailyTotals[day - 1] += Number(t.amount);
      }
    }
  });

  // Prepare chart data
  return dailyTotals.map((value, idx) => ({
    value,
    label: String(idx + 1),
  }));
}


const MonthlyLineChart = ({ transactions, label }: { transactions: Transaction[], label: string }) => {

  const { colors } = useTheme();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based

  const data = getChartData(transactions, year, month);
  console.log('Monthly Line Chart Data:', data);


  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>{label}</Text>
      <LineChart
        data={data}
        width={320}
        height={200}
        color={colors.secondary}
        thickness={4}
        hideDataPoints={true}
        dataPointsRadius={30}
        yAxisTextStyle={{ color: 'lightgray' }}
        xAxisLabelTextStyle={{ color: 'lightgray' }}
        noOfSections={transactions.length % 2 == 0 ? 4 : 3}
        yAxisTextNumberOfLines={1}
        maxValue={Math.max(...transactions.map((item) => item.amount)) + Math.min(...transactions.map((item) => item.amount))}
        yAxisLabelWidth={40}
      />
    </View>
  );
};

export default MonthlyLineChart;
