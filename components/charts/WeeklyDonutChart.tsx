import React from 'react'
import { View, useColorScheme } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { PieChart } from 'react-native-gifted-charts'
import { AllDataProps } from '@/database/schemas/AllDataProps'


const renderDot = (color: string) => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 8,
      }}
    />
  );
}


const renderLegendComponent = (data: AllDataProps[]) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 16,
          gap: 16,
          flexWrap: 'wrap'
        }}>
        {
          data.map((item, i) => {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center' }} key={i.toString()}>
                {renderDot(item.categColor)}
                <Text>{item.categName}</Text>
              </View>
            )
          })
        }
      </View>
    </>
  );
}

export const WeeklyDonutChart = ({ data, label }: { data: AllDataProps[], label: string }) => {

  const theme = useTheme();
  const colorScheme = useColorScheme();



  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          display: label === "" ? "none" : "flex",
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 16
        }}>
        {label}
      </Text>
      <PieChart
        data={
          data.map((item) => {
            return {
              value: item.amount,
              color: (item.categColor === "#37352f" || item.categColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : item.categColor,
              text: item.categName,
            }
          })
        }
        donut
        radius={100}
        strokeColor={theme.colors.background}
        strokeWidth={4}
        innerCircleColor={theme.colors.background}
        innerRadius={90}
      />
      {renderLegendComponent(data)}
    </View>
  )
}