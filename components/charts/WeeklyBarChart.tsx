import { Transaction } from '@/database/schemas/Transaction';
import React from 'react'
import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper';
import { BarChart, yAxisSides } from 'react-native-gifted-charts'

export const WeeklyBarChart = ({ transactions, label }: { transactions: Transaction[], label: string }) => {

  const theme = useTheme();

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 16
        }}>
        {label}
      </Text>
      <BarChart
        data={

          [
            {
              spacing: 20,
              label: 'M',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 1) === 'M')?.amount || 0,
            },
            {
              spacing: 20,
              label: 'T',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 3) === 'Tue')?.amount || 0,
            },
            {
              spacing: 20,
              label: 'W',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 1) === 'W')?.amount || 0,
            },
            {
              spacing: 20,
              label: 'T',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 3) === 'Thu')?.amount || 0,
            },
            {
              spacing: 20,
              label: 'F',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 1) === 'F')?.amount || 0,
            },
            {
              spacing: 20,
              label: 'S',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 3) === 'Sat')?.amount || 0,
            },
            {
              spacing: 20,
              label: 'S',
              frontColor: theme.colors.secondary,
              value: transactions.find((item) => new Date(item.transDate.toString().split(' ')[0]).toDateString().slice(0, 3) === 'Sun')?.amount || 0,
            }
          ]
        }
        barBorderRadius={3}
        barWidth={24}
        yAxisThickness={0}
        spacing={10}
        noOfSections={transactions.length % 2 == 0 ? 3 : 2} isAnimated xAxisColor={'lightgray'} yAxisTextStyle={{ color: 'lightgray' }} xAxisLabelTextStyle={{ color: 'lightgray' }} yAxisSide={yAxisSides.RIGHT}
        maxValue={Math.max(...transactions.map((item) => item.amount)) + Math.min(...transactions.map((item) => item.amount))}
      />
    </View>
  )
}