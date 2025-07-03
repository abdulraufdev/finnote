import { View, ScrollView, useColorScheme } from 'react-native'
import { Appbar, Text, List, IconButton, FAB, Menu, ActivityIndicator, useTheme, Dialog, Button } from 'react-native-paper'
import GlobalStyles from '@/constants/GlobalStyles'
import ListItem from '@/components/ListItem'
import React from 'react'
import { router, useFocusEffect } from 'expo-router'
import { Category } from '@/database/schemas/Category'
import { useSQLiteContext } from 'expo-sqlite'

const CategoriesPage = () => {

  const db = useSQLiteContext();

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const [undoCategory, setUndoCategory] = React.useState<Category | null>(null);

  const colorScheme = useColorScheme();
  const globalStyles = GlobalStyles();
  const theme = useTheme();

  const [visible, setVisible] = React.useState<string>("categ1");
  function hideMenu(name: string) {
    setVisible("")
  }

  function showMenu(name: string) {
    setVisible(name)
  }

  useFocusEffect(
    React.useCallback(() => {
      (async function fetchData() {
        setIsLoading(true);
        try {
          const data = await db.getAllAsync<Category>('SELECT * FROM categories WHERE userId = 1');
          if (data) {
            setCategories(data);
          }
        } catch (err) {
          console.log(err)
        } finally {
          setIsLoading(false);
        }
      })()
    }, [])
  );

  async function deleteCategory(id: number) {

    if (!id) return;
    setUndoCategory(categories.find(ctg => ctg.categId === id) || null);

    setDialogVisible(true);
    try {
      await db.runAsync(`
          DELETE FROM categories WHERE categId = ? AND userId = ?
          `,
        [
          id,
          1
        ]);

      const newCategories = await db.getAllAsync<Category>('SELECT * FROM categories WHERE userId = 1');
      if (newCategories) {
        setCategories(newCategories);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function undoDeleteCategory() {
    if (!undoCategory) return;

    setDialogVisible(false);
    try {
      await db.runAsync(`
        INSERT INTO categories (categId, categName, categIcon, categColor, userId)
        VALUES (?, ?, ?, ?, ?)
      `, [
        undoCategory.categId!,
        undoCategory.categName,
        undoCategory.categIcon,
        undoCategory.categColor,
        1
      ]);

      const newCategories = await db.getAllAsync<Category>('SELECT * FROM categories WHERE userId = 1');
      if (newCategories) {
        setCategories(newCategories);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.replace('/settings')} />
        <Appbar.Content title="Categories" />
      </Appbar.Header>
      <View style={globalStyles["container"]}>
        <ScrollView>
          {
            isLoading ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={theme.colors.primary} /></View>
              :
              <List.Section
                style={globalStyles["section"]}
              >
                {
                  categories.length == 0 ?
                    <Text>No categories</Text> :
                    categories.map((ctg, i) => {
                      return (
                        <ListItem
                          key={ctg.categId?.toString()}
                          customkey={i.toString()}
                          text={ctg.categName}
                          func={() => { }}
                          leftComponent={<List.Icon color={(ctg.categColor === "#37352f" || ctg.categColor === "#f3f5f7") ? colorScheme === 'dark' ? "#f3f5f7" : "#37352f" : ctg.categColor} style={{ marginLeft: 20 }} icon={ctg.categIcon} />}
                          rightComponent={
                            <Menu
                              key={i.toString()}
                              contentStyle={{ backgroundColor: theme.colors.background, borderRadius: 4, position: 'relative' }}
                              visible={visible === ctg.categName + i.toString()}
                              onDismiss={() => hideMenu(ctg.categName + i.toString())}
                              anchor={<IconButton icon="dots-vertical" onPress={() => showMenu(ctg.categName + i.toString())} />}>
                              <Menu.Item onPress={() => { router.push({ pathname: '/categoryDetails/[categ]', params: { categ: ctg.categId! } }); hideMenu(ctg.categName + i.toString()) }} leadingIcon="pencil" title="Edit" />
                              <Menu.Item onPress={() => { deleteCategory(Number(ctg.categId)); hideMenu(ctg.categName + i.toString()) }} leadingIcon="trash-can-outline" title="Delete" />
                            </Menu>}
                        />
                      )
                    })
                }
              </List.Section>

          }
        </ScrollView>
        <FAB
          mode='elevated'
          size='medium'
          icon={'plus'}
          style={globalStyles["fab"]}
          color={globalStyles["fab?"].icon.color}
          onPress={() => router.push('/CreateCategoryPage')}
        />
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Content>
            <Text>You have just deleted a category, you can not access any expense associated with that category.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <View style={{ flexDirection: 'column', columnGap: 0, rowGap: 8, alignItems: 'center', width: '100%' }}>
              <Button onPress={() => undoDeleteCategory()} mode='contained' style={[globalStyles['btn'], { width: '100%' }]}>Undo</Button>
              <Button onPress={() => setDialogVisible(false)} mode='contained-tonal' style={[globalStyles['btn'], { width: '100%' }]}>Ok</Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </View>
    </React.Fragment>
  )
}

export default CategoriesPage