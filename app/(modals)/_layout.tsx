import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'react-native-paper'

const ModalLayout = () => {
  const theme = useTheme()
  return (
    <Stack screenOptions={{
      headerStyle: {backgroundColor : theme.colors.background},
      headerTintColor: theme.colors.onBackground,
      headerTitleAlign: 'center'
    }}>
            <Stack.Screen name='IconsModal' options={{
                presentation: 'modal',
                title: 'Choose an icon',
                }}/>
            <Stack.Screen name='ColorsModal' options={{
                presentation: 'modal',
                title: 'Choose a color'
                }}/>
            <Stack.Screen name='BudgetModal' options={{
                presentation: 'modal',
                title: 'Add a new budget',
                }}/>
            <Stack.Screen name='lock' options={{
              headerShown: false,
              presentation: 'fullScreenModal'
            }}/>
            <Stack.Screen name='PINCodeSetup' options={{
              presentation: 'modal',
              title: 'Security',
            }}/>
            <Stack.Screen name='ExportModal' options={{
              presentation: 'modal',
              title: 'Export data',
            }}/>
        </Stack>
  )
}

export default ModalLayout