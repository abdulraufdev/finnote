import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import GlobalStyles from "@/constants/GlobalStyles";
import { useTheme, Text, Button, Dialog } from "react-native-paper";
import KeyPad from "@/components/KeyPad";
import { setItemAsync, getItemAsync } from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { dropDB } from "@/database/myDBModules";

const Lock = () => {
    const { colors } = useTheme();

    const navigation = useNavigation();
    const router = useRouter();
    const globalStyles = GlobalStyles();

    const [pin, setPin] = useState<(string | null)[]>(Array(4).fill(null));
    const [defPin, setDefPin] = useState<(string | null)[]>(Array(4).fill(null));
    const [disabledKeyPad, setDisabledKeyPad] = useState<boolean>(false);
    const [forgotPinDialogVisible, setForgotPinDialogVisible] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('Enter PIN');

    const [countdown, setCountdown] = useState<number>(60);
    const [errorCount, setErrorCount] = useState<number>(3);
    const [isLocked, setIsLocked] = useState<boolean>(false);

    async function handlePINChange(newPin: (string | null)[]) {
        setPin(newPin);
    }

    async function handleBioAuth() {
        const { success } = await LocalAuthentication.authenticateAsync();
        if (success) {
            router.replace('/');
        }
    }

    async function forgotPin() {
        console.log('forgot pin');
        setDisabledKeyPad(true);
        setForgotPinDialogVisible(true);

    }

    useEffect(() => {
        console.log(pin, defPin);
        pin[3] != null && defPin[3] != null && handlePinSubmit();
    }, [pin]);

    useEffect(() => {
        if (errorCount == 0) {
            setIsLocked(true);
            const interval = setInterval(() => {
                setCountdown(countdown - 1);
                if (countdown == 1) {
                    setErrorCount(3);
                    setCountdown(60);
                    clearInterval(interval);
                    setIsLocked(false);
                    setDisabledKeyPad(false);
                    setTitle('Enter PIN');
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [countdown, errorCount]);

    async function handlePinSubmit() {
        if (pin.join('') == defPin.join('')) {
            setErrorCount(3);
            console.log('PIN matched');
            setTitle('PIN matched');
            router.replace('/')
        } else {
            setErrorCount(errorCount - 1);
            console.log(errorCount)
            setPin(Array(4).fill(null));
            // Check if the user has any more attempts left
            if (errorCount > 1) {
                setTitle('Incorrect PIN, try again');
            }
            // If the user has no more attempts left, lock the keypad and start the countdown timer
            if (errorCount == 1) {
                setTitle('You have no more attempts left');
                setDisabledKeyPad(true);
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
    }


    // Effect
    useEffect(() => {
        const listener = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === "GO_BACK") {
                e.preventDefault();
                console.log('onback');
            }
            // Do your stuff here
        });

        return () => {
            navigation.removeListener('beforeRemove', listener);
        };
    }, [navigation]);

    useEffect(() => {
        (async function fetchPIN() {
            const pincode = await getItemAsync('securityPin');
            if (pincode) {
                setDefPin(pincode.split(""))
            } else {
                setDisabledKeyPad(true);
                handleBioAuth();
            }
        })()
    }, [])

    const handleDeleteData = async () => {
        dropDB();
        await setItemAsync('securityPin', '');
        await setItemAsync('bioActive', 'false');
        setForgotPinDialogVisible(false);
        router.replace('/');
    }

    return (
        <View style={globalStyles['container']}>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Text>{title}</Text>
                {errorCount < 3 && errorCount >= 1 && (
                    <Text style={{ color: colors.onBackground, marginTop: 8 }}>
                        You have {errorCount} attempts left.
                    </Text>
                )}
                {errorCount == 0 && (
                    <Text style={{ color: colors.onBackground, marginTop: 8 }}>Try again in {countdown} seconds</Text>
                )}
                <KeyPad onPINChange={handlePINChange} onBioAuth={handleBioAuth} keysDisabled={disabledKeyPad} keysLocked={isLocked} />
                {!disabledKeyPad ? <Button style={{ position: 'absolute', bottom: 24 }} mode="text" onPress={forgotPin}>Forgot your PIN?</Button> : null}
            </View>
            <Dialog visible={forgotPinDialogVisible} onDismiss={() => setForgotPinDialogVisible(false)}>
                <Dialog.Title>Forgot your password?</Dialog.Title>
                <Dialog.Content>
                    <Text>To remove the lock, you have to delete all of your expenses from this app.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button mode="text" onPress={() => setForgotPinDialogVisible(false)}>Cancel</Button>
                    <Button mode="contained" buttonColor={"rgb(189, 16, 27)"} textColor={'rgb(254, 251, 255)'} onPress={handleDeleteData}>Delete all expenses</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}

export default Lock;