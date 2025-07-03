import { useTheme } from "react-native-paper";
import { StyleSheet } from 'react-native'

function Styles(){
    const theme = useTheme();

    const baseStyles = StyleSheet.create({
        "container": {
            backgroundColor: theme.colors.background,
            flex:1,
            padding: 14
        },
        "btn": {
            borderRadius: 4,
            paddingVertical: 4,
        },
        "dropdown":{
            paddingVertical: 0
        },
        "dropdownWithBg":{
            backgroundColor: theme.colors.elevation.level1,
            borderRadius: 40,
            paddingVertical: 0,
        },
        "listItemWithDropdown":{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 14,
            fontSize: 20
        },
        "cardWithBg": {
            backgroundColor: theme.colors.elevation.level2,
            borderRadius: 6
        },
        "fab":{
            position: 'absolute',
            right: 18,
            bottom: 18,
            backgroundColor: theme.colors.primary
        },
        "section": {borderRadius: 16, overflow: 'hidden', gap: 2, marginTop: 0}
    });
    const customStyles = {
        "btn?": {
            "label": {
                fontSize: 16
            }
        },
        "dropdown?":{
            "item": {
                boxShadow: '1 10 10 0 rgba(114, 114, 114, 0.1)',
                elevation : 1,
                backgroundColor: theme.colors.elevation.level1,
                borderRadius: 4,
            }
        },
        "fab?": {
            "icon": {
                color: theme.colors.elevation.level1
        }
        }
    }

    return {
        ...baseStyles,
        ...customStyles
    }
}

export default Styles;