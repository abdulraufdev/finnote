import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '@/components/TabBar'
import {MaterialCommunityIcons, Octicons, MaterialIcons} from '@expo/vector-icons'
import { useTheme } from 'react-native-paper'

export default function TabsLayout(){
  const theme = useTheme();
  return (
    <Tabs
      tabBar={props=><TabBar {...props} />}
      screenOptions={{headerShown: false}}
      
    >
      <Tabs.Screen name="index" options={
        {
          title: 'Home',
          tabBarIcon: ({focused,color})=> {
            return <MaterialCommunityIcons name="home" size={24} color={focused ? theme.colors.primary : color}/>
          }
        }
      } />
      <Tabs.Screen name="reports" options={
        {
          title: 'Reports',
          tabBarIcon: ({focused, color})=> {
            return <MaterialIcons name="analytics" size={24} color={focused ? theme.colors.primary : color}/>
          }
        }
      }/>
      <Tabs.Screen name="budget" options={
        {
          title: 'Budget',
          tabBarIcon: ({focused, color})=> {
            return <Octicons name="credit-card" size={24} color={focused ? theme.colors.primary : color}/>
          }
        }
      }/>
      <Tabs.Screen name="settings" options={
        {
          title: 'Settings',
          tabBarIcon: ({focused, color})=> {
            return <MaterialCommunityIcons name="cog" size={24} color={focused ? theme.colors.primary : color}/>
          }
        }
      }/>
    </Tabs>
  )
}