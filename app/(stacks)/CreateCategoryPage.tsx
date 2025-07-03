import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Appbar, Text, TextInput, useTheme, Icon, Button, FAB } from 'react-native-paper'
import React, { useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'
import GlobalStyles from '@/constants/GlobalStyles'
import { deleteItemAsync, getItemAsync } from 'expo-secure-store'
import { useSQLiteContext } from 'expo-sqlite'
import { useNavigationState } from '@react-navigation/native'

const CreateCategoryPage = () => {

  const db = useSQLiteContext();
  const globalStyles = GlobalStyles();
  const theme = useTheme();

  const previousRoute = useNavigationState((state) => state.routes[state.index - 1]?.name);

  const [categName, setCategName] = React.useState<string>('');
  const [selectedIcon, setSelectedIcon] = React.useState<string>("record");
  const [selectedColor, setSelectedColor] = React.useState<string>("#787774");

  useFocusEffect(
    useCallback(() => {
      (async function () {
        var icon = await getItemAsync('icon')
        var color = await getItemAsync('color')
        if (icon) {
          setSelectedIcon(icon)
        }
        if (color) {
          setSelectedColor(color)
        }
      })()
    }, [])
  );


  async function createCateg() {
    if (categName == '') {
      return;
    }
    try {
      await db.runAsync('INSERT INTO categories (userId, categName, categColor, categIcon) VALUES(?, ?, ?, ?)',
        [1, categName, selectedColor, selectedIcon]
      );
      await deleteItemAsync('icon')
      await deleteItemAsync('color')
    } catch (err) {
      console.log(err)
    }
    if (previousRoute == "CreateExpensePage") {
      router.back()
    } else {
      router.replace('/CategoriesPage')
    }
  }

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Action icon={"close"} onPress={() => router.back()} />
      </Appbar.Header>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={globalStyles["container"]}>
          <TextInput
            placeholder="Category name"
            label="Category name"
            mode="outlined"
            style={{ marginBottom: 10 }}
            value={categName}
            onChangeText={(val) => setCategName(val)}
          />
          <View style={styles.section}>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Icon</Text>
                <Icon source={selectedIcon} size={30} color={selectedColor} />
              </View>
              <Button mode="contained-tonal" style={globalStyles.btn} onPress={() => router.push('/IconsModal')}>Change icon</Button>
            </View>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Color</Text>
                <Icon source="record" size={30} color={selectedColor} />
              </View>
              <Button mode="contained-tonal" style={globalStyles.btn} onPress={() => router.push('/ColorsModal')}>Change color</Button>
            </View>
          </View>

          <FAB
            size='medium'
            mode='elevated'
            style={globalStyles.fab}
            color={theme.colors.onPrimary}
            icon="check"
            onPress={createCateg}
          />
        </View>
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  }
})

export default CreateCategoryPage;