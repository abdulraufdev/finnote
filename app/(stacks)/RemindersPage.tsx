import { View } from 'react-native'
import { Appbar, List, Switch } from 'react-native-paper'
import GlobalStyles from '@/constants/GlobalStyles'
import ListItem from '@/components/ListItem'
import React, { useEffect } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import * as Notifications from 'expo-notifications';
import { getItemAsync, setItemAsync } from 'expo-secure-store'

async function scheduleDailyNotification() {
  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reminder',
    content: {
      title: 'Daily Reminder',
      body: 'It\'s time for adding what you spent today!',
      attachments: [{
        identifier: 'daily-reminder-img',
        url: '@/assets/images/favicon.png',
        type: 'image/png',
      }],
      data: { customData: 'daily' }, // Optional custom data
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 59,
    },
  });
}

const RemindersPage = () => {

  const router = useRouter();
  const globalStyles = GlobalStyles();

  const [dailyReminder, setDailyReminder] = React.useState<boolean>(false);

  async function toggleDailyReminder() {
    setDailyReminder(!dailyReminder);
    await setItemAsync('dailyreminder', (!dailyReminder).toString());
    if (dailyReminder === false) {
      await scheduleDailyNotification();
    } else {
      await Notifications.cancelScheduledNotificationAsync('daily-reminder');
    }
  }

  useEffect(() => {
    (async function fetchData() {
      const key = await getItemAsync('dailyreminder');
      if (key) {
        setDailyReminder(key == 'true' ? true : false);
      }
    })()
  }, []);

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.replace('/settings')} />
        <Appbar.Content title="Reminders" />
      </Appbar.Header>
      <View style={globalStyles["container"]}>
        <List.Section style={globalStyles["section"]}>
          <ListItem text='Daily reminder' desc='Notifies you daily night at 9:00 PM'
            func={toggleDailyReminder}
            rightComponent={<Switch value={dailyReminder} onValueChange={() => toggleDailyReminder()} />}
          />
        </List.Section>
      </View>
    </React.Fragment>
  )
}

export default RemindersPage;