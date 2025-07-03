import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Text, TouchableRipple, useTheme, IconButton } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useNavigationState } from '@react-navigation/native';
import { getItemAsync } from 'expo-secure-store';


const KeyPad = ({ onPINChange, onBioAuth, keysDisabled, keysLocked }: { onPINChange: (newPIN: any[]) => void, onBioAuth?: () => void, keysDisabled?: boolean, keysLocked?: boolean }) => {

  const [pin, setPin] = useState<(string | null)[]>(Array(4).fill(null));
  const [isLocked, setIsLocked] = useState<boolean>(keysLocked || false);
  const [bioActive, setBioActive] = useState<boolean>(false);
  const { colors } = useTheme();

  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  useEffect(() => {
    (async function chckBioActive() {
      const bio = await getItemAsync('bioActive');
      if (bio) {
        setBioActive(bio == 'true');
      }
    })()
  }, [])
  // Handle everytime when user enters a 4 digit pin
  useEffect(() => {
    if (pin[3] != null) {
      handlePinSubmit();
    }
    onPINChange(pin);
  }, [pin]);

  // Data for the keypad buttons - Numbers from 0 to 9 and a clear button
  const keypadData: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '',
    '0',
    'x',
  ];

  // Handle the key press event
  const handleKeyPress = (key: string) => {
    for (let i: number = 0; i < 4; i++) {
      if (pin[i] == null) {
        setPin([...pin.slice(0, i), key, ...pin.slice(i + 1)]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }
    }
  };

  // Handle the pin submit event - Check if the pin is correct or not
  const handlePinSubmit = () => {
    setPin(Array(4).fill(null));

  }

  // Handle the clear button press event
  const handleClear = () => {
    let tempPin: (string | null)[] = [...pin];
    for (let i = 3; i >= 0; i--) {
      if (tempPin[i] !== null) {
        tempPin[i] = null;
        setPin(tempPin);
        onPINChange(tempPin);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      }
    }
  };

  // Render the keypad buttons
  const renderItem = ({ item }: { item: string }) =>
    item == 'x' ? (
      <View style={{ borderRadius: 1000, overflow: 'hidden' }}>
        <TouchableRipple borderless={true} style={styles.clearKey} onPress={() => handleClear()}>
          <ClearButton />
        </TouchableRipple>
      </View>
    ) : currentRoute === "lock" && item === '' && bioActive ?
      (
        <View style={styles.key}>
          <IconButton icon={'face-recognition'} iconColor={colors.onBackground} onPress={onBioAuth} />
        </View>
      )
      : (
        <View style={{ borderRadius: 1000, overflow: 'hidden' }}>
          <TouchableRipple
            borderless={true}
            style={item == '' || keysDisabled ? styles.disabledKey : [styles.key, { backgroundColor: colors.elevation.level1 }]}
            disabled={item == '' || isLocked}
            onPress={() => handleKeyPress(item)}>
            <Text style={[styles.keyText, { color: colors.onBackground }]}>{item}</Text>
          </TouchableRipple>
        </View>
      );

  return (
    <View style={styles.container}>
      <View style={styles.flexItem}>
        <View style={styles.pinContainer}>
          {pin.map((item, index) => (
            <View
              style={[styles.pinItem, { backgroundColor: colors.tertiaryContainer }, item == null ? null : { backgroundColor: colors.primary }]}
              key={index}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={keypadData}
        numColumns={3}
        keyExtractor={item => item}
        renderItem={renderItem}
        contentContainerStyle={{
          justifyContent: 'center', // Center the items
          alignItems: 'center', // Align items horizontally
        }}
        style={{
          flexGrow: 0, // Prevent the FlatList from growing and taking extra space
        }}
      />
    </View>
  );
};

// Clear button SVG
const ClearButton = () => {

  return (
    <Svg
      fill="#5A7FD6"
      width={80}
      height={30}
      viewBox="0 0 640 640"
      stroke="#5A7FD6">
      <Path
        d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z"
        fill="#5A7FD6"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20
  },
  flexItem: {
    alignItems: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 70,
    padding: 10,
    width: 70,
    height: 70,
  },
  disabledKey: {
    margin: 10,
    padding: 10,
    width: 70,
    height: 70,
    opacity: 0,
  },
  clearKey: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingLeft: 10,
    width: 70,
    height: 70,
  },
  keyText: {
    fontSize: 30
  },
  pinItem: {
    width: 15,
    height: 15,
    borderRadius: 30,
    marginHorizontal: 12,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    position: 'absolute',
    fontSize: 14,
    top: -40,
  },
});

export default KeyPad;