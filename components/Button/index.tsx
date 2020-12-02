import React, { useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../App';
import { styles } from './style';

const Button = ({title, style, textStyle, onPress, icon, iconName, size = "medium", type = 'primary', iconSize = 14, iconColor}: ButtonProps) => {
    const theme = useContext(ThemeContext)

    const parseSize = (size: string) => {
        let sizeStyle = styles.mediumButton
        if (size === "small") {
            sizeStyle = styles.smallButton
        } else if (size === "large") {
            sizeStyle = styles.largeButton
        }
        return sizeStyle
    }
    
    const parseType = (type: string) => {
        let typeStyle = {...styles.primaryButton,...{backgroundColor: theme.primaryColor}}
        let textTypeStyle = {...styles.primaryButtonText,...{ color: theme.primaryTextColor }}
        if (type === "secondary") {
            typeStyle = styles.secondaryButton
            textTypeStyle = styles.secondaryButtonText
        } else if (type === "outline") {
            typeStyle = {...styles.outlineButton,...{ borderColor: theme.outlineBorderColor }}
            textTypeStyle = {...styles.outlineButtonText,...{ color: theme.outlineTextColor }}
        } else if (type === "ghost") {
            typeStyle = {...styles.ghostButton, ...{ backgroundColor: theme.ghostColor }}
            textTypeStyle = {...styles.ghostButtonText, ...{ color: theme.ghostTextColor }}
        } else if (type === "link") {
            typeStyle = styles.linkButton
            textTypeStyle = {...styles.linkButtonText, ...{ color: theme.linkTextColor }}
        }
    
        return {typeStyle, textTypeStyle}
    }

    const renderIcon = () => {
        if (icon) return icon
        if (iconName) {
            let _iconColor = '#FFFFFF'
            switch (type) {
                case "secondary":
                    _iconColor= '#AD182A'
                    break;
                case "outline":
                    _iconColor= '#000000'
                    break;
                case "ghost":
                    _iconColor= '#364766'
                    break;
                default:
                    break;
            }
            if (textStyle && textStyle.color) _iconColor = textStyle.color
            if (iconColor) _iconColor = iconColor
            return <Icon style={styles.icon} name={iconName} color={_iconColor} size={iconSize} />
        }
        return null
    }

    const {typeStyle, textTypeStyle} = parseType(type)

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, parseSize(size), typeStyle, style, type === "link" ? {padding: 0, minWidth: 0} : null]}
        >
            {
                renderIcon()
            }
            {/* <Icon name={iconName} size={size} color={color} style={{marginRight:8}}/> */}
            <Text style={[styles.title, textTypeStyle, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button
