import { View, useColorScheme } from 'react-native'
import { IconButton } from 'react-native-paper'
import React from 'react'
import GlobalStyles from '@/constants/GlobalStyles'
import { useRouter } from 'expo-router'
import { setItemAsync } from 'expo-secure-store'

const colors = [
  "#787774",
  "#9f6b53",
  "#d9730d",
  "#cb912f",
  "#448361",
  "#d44c47",
  "#c14c8a",
  "#9065b0",
  "#337ea9",
  "#37352f"
]

const ColorsModal = () => {

  const router = useRouter();
  const colorScheme = useColorScheme();
  const globalStyles = GlobalStyles();


  async function handleColorPass(color: string){
    await setItemAsync('color', color);
    router.back();
  }
    
  return (
    <View style={[globalStyles["container"], {flexDirection: 'row', flexWrap: 'wrap', gap: 10}]}>
        {colors.map((color, index) => {
          return <IconButton key={index} icon="record" containerColor={color === "#37352f" ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : color} iconColor={color === "#37352f" ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : color} style={{margin: 10}} size={30} onPress={()=>handleColorPass(color === "#37352f" ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : color)} />
        })}
    </View>
  )
}

export default ColorsModal;