import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import GlobalStyles from "@/constants/GlobalStyles";
import { Text, Button } from "react-native-paper";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import KeyPad from "@/components/KeyPad";
import * as Haptics from 'expo-haptics';

const PINCodeSetup = () => {
    const router = useRouter();
    const globalStyles = GlobalStyles();

    const [title, setTitle] = useState('Create a new PIN');
    const [hasOldPin, setHasOldPin] = useState(false);
    const [pin, setPin] = useState<(string | null)[]>(Array(4).fill(null));
    const [confirmPin, setConfirmPin] = useState<(string | null)[]>(Array(4).fill(null));
    const [btnVisible, setBtnVisible] = useState(false);

    function handlePINChange(newPin: (string | null)[]) {
        if(pin[3] != null){
            if(confirmPin[3] != null){
                return;
            }
            else {
                setConfirmPin(newPin);
            }
        } else setPin(newPin);
    }

    useEffect(() => {
        console.log(pin, confirmPin);
        if(hasOldPin){
            confirmPin[3] != null && handlePinSubmit();
        } else {
            pin[3] != null && confirmPin[3] != null && handlePinSubmit();
            if(confirmPin[3] != null){
                return;
            }
            if(pin[3] != null){
                setTitle("Confirm your PIN");
                //emptyPin();
            }
        }
    }, [pin, confirmPin]);

    const handlePinSubmit = async () => {
          // Check if the pin is correct
        if (pin.join('') == confirmPin.join('')) {
            if(hasOldPin){
                console.log("PIN matched");
                setTitle("Create a new PIN");
                setPin(Array(4).fill(null));
                setConfirmPin(Array(4).fill(null));
                setHasOldPin(false);
                setBtnVisible(true);
            } else {
                setPin(Array(4).fill(null));
                console.log('PIN set successfully: ', pin.join(''));
                setTitle("PIN set successfully");
                await setItemAsync('securityPin', pin.join(''));
                router.replace('/SecurityPage');
            }
        } else {
            if(hasOldPin){
                setConfirmPin(Array(4).fill(null));
                console.log('incorrect PIN');
                setTitle("Incorrect PIN, try again");
            } else {
                setPin(Array(4).fill(null));
                setConfirmPin(Array(4).fill(null));
                console.log('PIN does not match');
                setTitle("PIN does not match, try again");
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
    };
    
    useEffect(()=>{
        (async function fetchPIN(){
            const oldPin = await getItemAsync('securityPin');
            if(oldPin){
                console.log('Old PIN found: ', oldPin);
                setTitle("Enter your old PIN");
                setPin(oldPin.split(''));
                setHasOldPin(true);
            } else {
                console.log('No old PIN found');
            }
        })()
    },[]);

    async function removePin(){
        await deleteItemAsync('securityPin');
        setTitle("PIN removed successfully");
        setPin(Array(4).fill(null));
        setConfirmPin(Array(4).fill(null));
        router.replace('/SecurityPage');
    }

    return (
        <View style={globalStyles['container']}>
         <View style={[{flex:1 ,justifyContent: 'center', alignItems: 'center'}]}>
            <Text>{title}</Text>
            <KeyPad onPINChange={handlePINChange} onBioAuth={()=>{}}/>
                {btnVisible ? <Button style={{position: 'absolute', bottom: 24}} mode="text" onPress={removePin}>Remove PIN</Button> : null}
        </View>
        </View>
    )
}

export default PINCodeSetup;