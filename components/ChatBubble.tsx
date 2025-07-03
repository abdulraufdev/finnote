import { View, ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { StyleProp } from "react-native";
import React from "react";

const ChatBubble = ({ message, contentStyle, pinStyle }: { message: string, contentStyle: StyleProp<ViewStyle>, pinStyle: StyleProp<ViewStyle> }) => {

    const theme = useTheme();

    return (
        <View style={[{ width: 144, backgroundColor: theme.colors.tertiaryContainer, borderRadius: 4, marginBottom: 8, padding: 8 }, contentStyle]}>
            <Text>{message}</Text>
            <View style={[{
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderLeftWidth: 5,
                borderRightWidth: 5,
                borderTopWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: theme.colors.tertiaryContainer,
                position: 'absolute',
                bottom: -6
            }, pinStyle]}></View>
        </View>
    )
}

export default ChatBubble;