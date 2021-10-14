import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Animated, TouchableWithoutFeedback, TouchableOpacity, Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SliderContext } from '../context/SliderContext';
import { CourseContext } from '../context/CourseContext';
import { CurrentCourseContext } from '../context/CurrentCourseContext';
import { ColorContext } from '../context/ColorContext';
import { ExamContext } from '../context/ExamContext';
import { GradesContext } from '../context/GradesContext';


const LoadGrades = (props) => {
    const { showMenu, setShowMenu } =  React.useContext(SliderContext);
    const { course, setCourse } = React.useContext(CourseContext);
    const { currentCourses, setCurrentCourses } = React.useContext(CurrentCourseContext);
    const { setExam } = React.useContext(ExamContext);
    const { setGrades } = React.useContext(GradesContext); 
    const { color } = React.useContext(ColorContext);

    const { dark, colors } = useTheme();
    const { width, height } =  Dimensions.get("window");

    const menuAnim = React.useRef(new Animated.Value(width)).current

    const styles = StyleSheet.create({
        menuText:{ 
            marginTop:width/20,
            marginBottom:width/20,
            flexDirection:"row"
        },
    })

    const deleteCourse = (courseName) =>{
        (async ()=>{
            await AsyncStorage.removeItem(courseName);
            await AsyncStorage.removeItem(`${courseName}@exam`);
            if(course==courseName){
                setCurrentCourses([]);
            }
            props.getCourses();
        })();
    }

    const loadCourse = (courseName) =>{
        (async ()=>{
            let getCourse = await AsyncStorage.getItem(courseName);
            let getExam = await AsyncStorage.getItem(`${courseName}@exam`)
            let courseResult = getCourse != null ? JSON.parse(getCourse) : null;
            let examResult = getExam != null ? JSON.parse(getExam) : null;

            if(courseResult){
                console.log("setting course!!!");
                setGrades([...courseResult]);
            }
            if(examResult){
                console.log("setting exam........");
                setExam([...examResult]);
            }
            setCourse(courseName);
            setShowMenu(prevState => !prevState);
        })();
    }

    const handleDeleteCourse = (courseName) =>{
        Alert.alert(
            "Atención",
            `Estás a punto de eliminar la asignatura "${courseName}" ¿Deseas continuar?`,
            [
              {
                text: "Cancelar",
                onPress: () => console.log("erase canceled..."),
                style: "cancel"
              },
              { text: "OK", onPress: () => deleteCourse(courseName) }
            ]
          );
    }

    React.useEffect(()=>{
        Animated.timing(
            menuAnim,
            {
              toValue: showMenu ? 0 : width,
              duration: 100,
              useNativeDriver:true
            }
          ).start();
    },[showMenu]);

    return (
        <Animated.View style={{ height: height / 1.29, position: "absolute", width: width, zIndex: 9999, transform: [{ translateX: menuAnim }] }}>
            <View style={{ flexDirection: "row", height: "100%", width: "100%" }}>
                <TouchableWithoutFeedback style={{ width: "40%", height: "100%" }} onPress={() => setShowMenu(prevState => !prevState)}>
                    <View style={{ backgroundColor: colors.text, opacity: 0.2, width: "40%", height: "100%" }} />
                </TouchableWithoutFeedback>
                <View style={{ width: "60%", height: "100%", backgroundColor: dark ? "#1F1F29" : "white" }}>
                    <Text style={{ padding: width / 30, fontWeight: "bold", fontStyle: "italic", fontSize: width / 20, color: colors.text }}>Asignaturas</Text>
                    <ScrollView>
                        {currentCourses.map((subject, index) => {
                            return (
                                <View key={index} style={styles.menuText}>
                                    <TouchableOpacity style={{flex:5}} onPress={() => loadCourse(subject)}>
                                        <Text style={{ paddingLeft: "5%", fontSize: width / 23, color: color, textAlign: "left", fontWeight: "bold" }}>{subject}</Text>
                                    </TouchableOpacity>
                                    <MaterialCommunityIcons style={{ marginLeft: 'auto', flex: 1 }} name="delete" color={"#E75660"} size={width / 18} onPress={() => handleDeleteCourse(subject)} />
                                </View>
                            )
                        })
                        }
                    </ScrollView>
                </View>
            </View>
        </Animated.View>
    )
}

export default LoadGrades;