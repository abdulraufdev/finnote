import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useTheme } from 'react-native-paper'
import Data from '../../database/onboarding'
import Onboarding from '../../components/Onboarding';
import Paginator from '../../components/Paginator';
import { useRef, useState } from 'react';

export default function OnboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const [currenti, setCurrenti] = useState(0);
  const scrollX = useRef(useSharedValue(0)).current;
  const dataRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
    setCurrenti(viewableItems[0]?.index)
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x; // Update shared value with scroll position
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}
    >
      <View style={{
        flex: 3,
      }}>
        <Animated.FlatList
          data={Data}
          renderItem={({ item }) => {
            return <Onboarding id={item.id} title={item.title} />
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={dataRef}
        />
      </View>
      <Paginator data={Data} scrollX={scrollX} />
      <StatusBar style="auto" />
    </View>
  );
}
