import * as React from 'react';
import { NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Calculate from './src/screens/Calculate';
import Options from './src/screens/Options';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorContext } from './src/context/ColorContext';
import { ThemeContext } from './src/context/ThemeContext';

const Tab = createBottomTabNavigator();

const defaultTheme = {
  ...DefaultTheme,
}

const darkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(27, 28, 29)',
    background: 'rgb(19, 19, 20)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(242, 244, 245)',
    border: 'rgb(27, 28, 29)',
    notification: 'rgb(255, 69, 58)',
  }
};

export default function App() {
  const [color, setColor] = React.useState('#80BE43');
  const [theme, setTheme] = React.useState("0");

  React.useEffect(()=>{
    (async () =>{
      let queryColor = await AsyncStorage.getItem("@color");
      if(queryColor !== null){
        console.log("setting color: " + queryColor);
        setColor(queryColor);      
      }
      let queryTheme = await AsyncStorage.getItem("@theme");
      if(queryTheme != null){
        console.log("setting theme: " + queryTheme);
        setTheme(queryTheme);
      }
    })();
  },[])  

  const themeData = {theme, setTheme};
  const colorData = {color, setColor}

  return (
    <ThemeContext.Provider value={themeData}>
      <ColorContext.Provider value={colorData}>
        <NavigationContainer theme={theme === "0" ? defaultTheme : darkTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarStyle:{backgroundColor: theme === "0"? defaultTheme.colors.background :  darkTheme.colors.primary},
              tabBarIcon: ({ focused, color, size }) => {

                let iconName;

                if (route.name === 'Calcular') {
                  iconName = focused
                    ? 'text-box-plus'
                    : 'text-box-plus-outline';
                } else if (route.name === 'Opciones') {
                  iconName = focused ? 'cog' : 'cog-outline';
                }

                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: color,
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen options={{headerStyle:{backgroundColor: theme === "0" ? defaultTheme.colors.background : darkTheme.colors.primary}}} name="Calcular" component={Calculate} />
            <Tab.Screen options={{headerStyle:{backgroundColor: theme === "0" ? defaultTheme.colors.background : darkTheme.colors.primary}}} name="Opciones" component={Options} />
          </Tab.Navigator>
        </NavigationContainer>
      </ColorContext.Provider>
    </ThemeContext.Provider>
  );
}
