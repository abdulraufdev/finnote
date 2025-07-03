import { useRouter } from "expo-router";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

const LOCK_TIMEOUT = 60000;

const UserInactivityProvider = ({children} : any)=>{
    const appState  = useRef(AppState.currentState);
    const router = useRouter();

    useEffect(()=>{
        const subscription = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            subscription.remove();
        };
    },[])

    const handleAppStateChange = async (nextAppState: any) => {
        console.log('AppState', appState.current, nextAppState);

        const pincode = await getItemAsync('securityPin');
        const bioAuth = await getItemAsync('bioActive');

        if(pincode || bioAuth == "true"){
            const now = await getItemAsync('time');
            if(nextAppState === 'background'){
                recordTime();
            } else if(nextAppState === 'active' && appState.current.match(/background/)){
                if(new Date().getTime() - parseInt(now || "1000") >= LOCK_TIMEOUT){
                    router.push('/lock');
                }
            }
        }
        appState.current = nextAppState;

    }

    async function recordTime(){
        await setItemAsync('time', new Date().getTime().toString())
    }

    return children;
}

export { UserInactivityProvider };