import React, { useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { useTheme, Appbar, List, Switch } from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";
import GlobalStyles from "@/constants/GlobalStyles";
import ListItem from "@/components/ListItem";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import * as LocalAuthentication from 'expo-local-authentication';

const SecurityPage = () => {

  const router = useRouter();
  const globalStyles = GlobalStyles();

  const [bioActive, setBioActive] = useState(false);
  const [pinActive, setPinActive] = useState(false);

  async function toggleBioActive() {
    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      setBioActive(!bioActive);
      await setItemAsync('bioActive', JSON.stringify(!bioActive));
    }
  }

  useFocusEffect(
    useCallback(() => {
      (async function checkValues() {
        const bioAuth = await getItemAsync('bioActive');
        const pin = await getItemAsync('securityPin');
        if (pin) {
          setPinActive(true);
        }
        if (bioAuth) {
          setBioActive(bioAuth === 'true');
        }
      })()
    }, [])
  )

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => router.back()}
        />
        <Appbar.Content title="Security" />
      </Appbar.Header>
      <ScrollView style={globalStyles["container"]}>
        <List.Section style={globalStyles['section']}>
          <ListItem text="Biometric unlock" func={() => { }} desc="Will ask for biometric authentication when enabled" rightComponent={<Switch value={bioActive} onValueChange={toggleBioActive} />} />
          <ListItem text="PIN code" func={() => router.push('/PINCodeSetup')} desc={pinActive ? "Enabled" : "Not enabled"} />
        </List.Section>
      </ScrollView>
    </React.Fragment>
  )
}

export default SecurityPage;