import { View, useColorScheme } from 'react-native'
import { List, useTheme } from 'react-native-paper'
import React from 'react'

type ListItemProps = {
  text: string,
  desc?: string,
  customkey?: string | number,
  func: () => void,
  leftComponent?: React.ReactNode,
  rightComponent?: React.ReactNode,
  customStyle?: object
}

const ListItem = ({ text, desc, customkey, func, leftComponent, rightComponent, customStyle }: ListItemProps) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  return (
    <View key={customkey}>
      <List.Item
        title={text} onPress={func}
        description={desc ? desc : null}
        left={props => leftComponent ? leftComponent : null}
        right={props => rightComponent ? rightComponent : null}
        style={{ backgroundColor: colorScheme == 'dark' ? "#101010" : "#fff", ...customStyle }}
      />
    </View>
  )
}

export default ListItem