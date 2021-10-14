import * as React from 'react';
import { StyleSheet, Text, View, ToastAndroid, Dimensions} from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { Provider, Switch } from 'react-native-paper';
import { ColorPicker } from 'react-native-color-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {ThemeContext} from '../context/ThemeContext';
import {ColorContext} from '../context/ColorContext';
import { useTheme } from '@react-navigation/native';

const {width, height} =  Dimensions.get("window");


const Options = ({navigation}) =>{
  const { setTheme, theme } = React.useContext(ThemeContext)
  const { color, setColor } = React.useContext(ColorContext);
  const[newColor, setNewColor] = React.useState(null);
  const[percentageSwitch, setPercetageSwitch] = React.useState(true);

  const { dark, colors } = useTheme();
  
  const styles = StyleSheet.create({
    colorTitle: {
        color: colors.text,
        fontWeight:"bold",
        textAlign:"center",
        fontSize:width/23,
        padding:5
    },
  });
  console.log(color);

  const changeThemeHandler = () =>{
    if(theme ==="0"){
      setTheme("1");
      AsyncStorage.setItem("@theme","1");
    }else{
      setTheme("0");
      AsyncStorage.setItem("@theme","0");
    }
  }

  React.useEffect(()=>{
    (async () =>{
      if(newColor!== null){
        setNewColor(null);
        setColor(newColor);
        await AsyncStorage.setItem("@color", newColor);
        console.log("storing value: " + newColor);
      }                
            // await AsyncStorage.clear();
    })();
  },[newColor])

  const showHelp = (calledFrom) =>{
    if(calledFrom=="percentage"){
      ToastAndroid.showWithGravity("Activa o desactiva los porcentajes para tus notas parciales, los examenes siempre requerirán de ellos", ToastAndroid.LONG,ToastAndroid.CENTER,25,50);
    }else{
      ToastAndroid.showWithGravity("Activa o desactiva el modo oscuro", ToastAndroid.LONG,ToastAndroid.CENTER,25,50);
    }
  }

    // React.useEffect(()=>{
    //     (async () =>{
    //         await AsyncStorage.removeItem('color');
    //     })();
    // },[])


    return(
        <Provider>
          <StatusBar style={ dark ? "light" : "dark" }/>
          <View style={{height:"60%"}}>
              <View style={{height:"10%"}}>
                  <Text style={styles.colorTitle}>Elige un color y presiona el circulo para aplicar</Text>
              </View>
              <View style={{height:"90%"}}>
              <ColorPicker onColorSelected={(color) => setNewColor(color)} style={{flex: 1}}/>
              </View>
          </View>

          <View style={{height:"35%", justifyContent: 'center', alignItems: 'center'}}>
            {/* <View style={{flexDirection:"row"}}>
              <MaterialCommunityIcons name="percent" size={32} color={colors.text}/>
              <Switch value={percentageSwitch} color={color} onValueChange={()=>setPercetageSwitch(!percentageSwitch)}/>
              <MaterialCommunityIcons name="help-circle" color={colors.text} size={32} onPress={()=>showHelp("percentage")}/>
            </View> */}
            <View style={{flexDirection:"row", paddingTop:"10%"}}>
              <MaterialCommunityIcons name="moon-waning-crescent" color={theme==="0" ? "orange" : "yellow"} size={32}/>
              <Switch value={theme ==="0"? false : true} color={color} onValueChange={()=>changeThemeHandler()}/>
              <MaterialCommunityIcons name="help-circle" color={colors.text} size={32} onPress={()=>showHelp("nightmode")}/>
            </View>
          </View>
        </Provider>
    );

}



export default Options;