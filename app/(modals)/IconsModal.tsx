import { View } from 'react-native'
import { IconButton } from 'react-native-paper'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import GlobalStyles from '@/constants/GlobalStyles'
import { useRouter } from 'expo-router'
import { setItemAsync } from 'expo-secure-store'

const materialcommIcons = [
  "account",
  "airballoon",
  "alarm",
  "airplane",
  "alert-box",
  "android-messages",
  "apple-safari",
  "archive",
  "arrow-all",
  "baby-carriage",
  "bandage",
  "bank",
  "bed",
  "bell",
  "bicycle",
  "binoculars",
  "bridge",
  "briefcase",
  "bus",
  "cake",
  "camera",
  "car",
  "cards-heart",
  "cart",
  "cash",
  "cellphone",
  "city",
  "clock",
  "cloud",
  "coffee",
  "cookie",
  "credit-card",
  "cricket",
  "eight-track",
  "email",
  "emoticon",
  "eye",
  "flash",
  "food",
  "forest",
  "gas-station",
  "gift",
  "hand-heart",
  "home-variant",
  "hospital-box",
  "inbox",
  "key",
  "laptop",
  "library",
  "lock",
  "map-marker",
  "microphone",
  "mosque",
  "movie-open",
  "music-box",
  "package-variant-closed",
  "party-popper",
  "run",
  "school",
  "shopping",
  "star-four-points",
  "store",
  "trophy-variant",
  "watch-variant",
  "moon-waning-crescent",
  "telescope",
  "rocket",
]
const IconsModal = () => {

  const router = useRouter();

  const globalStyles = GlobalStyles();

  async function handleIconPass(icon: string) {
    await setItemAsync('icon', icon);
    router.back();
  }

  return (
    <View style={globalStyles["container"]}>
      <FlashList
        data={materialcommIcons}
        estimatedItemSize={30}
        keyExtractor={(item) => item.toString()}
        numColumns={5}
        contentContainerStyle={{ padding: 15 }}

        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 'auto', marginVertical: 20 }}>
            <IconButton icon={item}
              size={30}
              onPress={() => handleIconPass(item)}
            />
          </View>
        )}
      />
    </View>
  )
}

export default IconsModal;