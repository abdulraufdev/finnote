import { View, useWindowDimensions, useColorScheme } from 'react-native'
import { useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, interpolate} from 'react-native-reanimated';

import React from 'react'

const Paginator = ({data, scrollX}: {data: {id: number,title: string}[], scrollX: any}) => {
    const {width} = useWindowDimensions();
    const theme = useTheme();
    const colorScheme = useColorScheme();
  return (
    <View style={{flexDirection: 'row', height: 42}}>
      {data.map((_, i) => {
       const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = interpolate(scrollX.value, inputRange, [10, 30, 10], 'clamp');
        const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], 'clamp');

        return {
          width: dotWidth,
          opacity: opacity,
        };
      });
        return (
          <Animated.View key={i.toString()} style={[animatedStyle,{ height: 10, borderRadius: 8, backgroundColor: colorScheme == 'dark' ? theme.colors.inversePrimary :  theme.colors.primary, margin: 4}]}/>
        )
      }
    )}
    </View>
  )
}

export default Paginator