import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import GlobalStyles from "@/constants/GlobalStyles";
import { useRouter } from "expo-router";
import { Illustration } from "../(tabs)/budget";

const CreateBudget = () => {

    const router = useRouter();
    const globalStyles = GlobalStyles();
    const theme = useTheme();

    return (
        <View style={[globalStyles["container"], { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 8,
                textAlign: 'center'
            }}>Turn your goals into reality.</Text>
            <Illustration color={theme.colors.onBackground} />
            <Button mode='contained' onPress={() => router.replace('/BudgetModal')} style={globalStyles["btn"]} labelStyle={globalStyles["btn?"].label}>Add a new budget</Button>
        </View>
    )
}

export default CreateBudget;