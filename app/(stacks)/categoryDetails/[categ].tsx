import { View, StyleSheet, useColorScheme } from 'react-native'
import { Appbar, Text, TextInput, useTheme, Icon, Button, FAB } from 'react-native-paper'
import React, { useCallback, useEffect } from 'react'
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router'
import GlobalStyles from '@/constants/GlobalStyles'
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store'
import { useSQLiteContext } from 'expo-sqlite'
import { Category } from '@/database/schemas/Category'

const CategDetails = () => {

  const { categ } = useLocalSearchParams();

  const db = useSQLiteContext();
  const colorScheme = useColorScheme();
  const globalStyles = GlobalStyles();
  const theme = useTheme();

  const [categName, setCategName] = React.useState<string>('');
  const [selectedIcon, setSelectedIcon] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');


  useEffect(() => {
    (async function fetchData() {
      try {
        const data = await db.getFirstAsync<Category>(`SELECT * FROM categories WHERE categId = ${categ} AND userId = 1`);
        if (data) {
          setCategName(data.categName)
          setSelectedIcon(data.categIcon)
          setSelectedColor(data.categColor)
          await setItemAsync('icon', data.categIcon)
          await setItemAsync('color', data.categColor)
        }
      } catch (err) {
        console.log(err)
      }
    })();
  }, []);

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
      })();
    }, [])
  )

  async function updateCateg() {
    try {
      await db.runAsync(`
        UPDATE categories SET categName = ?, categColor = ?, categIcon = ? WHERE categId = ? AND userId = ?
        `,
        [
          categName,
          selectedColor,
          selectedIcon,
          Number(categ),
          1
        ]);
    } catch (err) {
      console.log(err)
    }
    await deleteItemAsync('icon')
    await deleteItemAsync('color')
    router.replace('/CategoriesPage')
  }

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Action icon={"close"} onPress={() => router.back()} />
        <Appbar.Content title="" />
      </Appbar.Header>
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
              <Icon source={selectedIcon} size={30} color={(selectedColor === "#37352f" || selectedColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : selectedColor} />
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
          onPress={updateCateg}
        />
        
      </View>
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

export default CategDetails;