import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function Collapsible({ children, title, style }: PropsWithChildren & { title: string, style?: object }) {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggleCollapse = () => {
    setIsOpen((value) => !value);
    rotation.value = withTiming(isOpen ? 0 : 90, { duration: 300 }); // Animate rotation
  };

  return (
    <ThemedView style={style}>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggleCollapse}
        activeOpacity={0.8}>
        <Animated.View style={[animatedStyle]}>
          <Icon
            source="chevron-right"
            size={20}
            color={isOpen ? theme.colors.primary : theme.colors.onBackground}
          />
        </Animated.View>

        <Text style={{ color: isOpen ? theme.colors.primary : theme.colors.onBackground, fontSize: 18, fontWeight: 600 }}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6
  },
});
