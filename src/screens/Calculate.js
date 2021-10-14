import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions, ToastAndroid } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { Provider, Surface, Badge, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

import { ColorContext } from '../context/ColorContext';
import { SliderContext } from '../context/SliderContext';
import { CourseContext } from '../context/CourseContext';
import { CurrentCourseContext } from '../context/CurrentCourseContext';
import { ModalContext } from '../context/ModalContext';
import { ExamContext } from '../context/ExamContext';
import { GradesContext } from '../context/GradesContext';
import { AverageContext } from '../context/AverageContext';

import LoadGrades from '../comp/LoadGrades';
import SaveGrades from '../comp/SaveGrades';
import Grade from '../comp/Grade';
import Exam from '../comp/Exam';


const Calculate = ({ navigation }) => {
    const [course, setCourse] = React.useState('');
    const [currentCourses, setCurrentCourses] = React.useState([]);
    const [grades, setGrades] = React.useState([]);
    const [exam, setExam] = React.useState([]);
    const [percetageSum, setPercentageSum] = React.useState(0);
    const [average, setAverage] = React.useState(null);
    const [showMenu, setShowMenu] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [buttonState, setButtonState] = React.useState(true);

    const { color } = React.useContext(ColorContext);

    const { width } = Dimensions.get("window");
    const { dark, colors } = useTheme();

    const SliderState = { showMenu, setShowMenu };
    const CourseState = { course, setCourse };
    const CurrentCourseState = { currentCourses, setCurrentCourses };
    const ModalState = { modalVisible, setModalVisible };
    const ExamState = { exam, setExam };
    const GradesState = { grades, setGrades };
    const AverageState = { average, setAverage };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 10
        },
        buttonsRow: {
            paddingTop: 15,
            justifyContent: "center", alignItems: "center",
            flexDirection: 'row'
        },
        surface: {
            elevation: 12,
            height: "10%",
            width: "100%",
            backgroundColor: dark ? "#1F1F29" : "#fff",
            flexDirection:"row",
        },
        topIcons: {
            marginRight: 30,
        },
        badge: {
            backgroundColor: percetageSum != 100 ? "#E75660" : "#80BE43",
        }
    })

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons style={styles.topIcons} name="text-box-search" onPress={() => setShowMenu(prevState => !prevState)} color={color} size={36} />
                    <MaterialCommunityIcons style={styles.topIcons} name="floppy" onPress={() => setModalVisible(prevState => !prevState)} color={color} size={36} />
                </View>

            )
        });
    }, [navigation, color]);

    const getCourses = () => {
        (async () => {
            let courses = [];
            let currentKeys = await AsyncStorage.getAllKeys();
            currentKeys.forEach((element) => {
                if (!element.includes("@")) {
                    courses.push(element);
                }
            });
            let sorted = courses.sort();
            setCurrentCourses(sorted);
            console.log("setting courses: " + sorted);
        })();
    }

    const sumPercentages = () => {
        let sum = 0;
        grades.forEach((grade) => {
            let percentage = grade.percentage !== "" ? parseInt(grade.percentage) : 0;
            sum += percentage;
        });
        setPercentageSum(sum);
    }

    const handleAdd = (type) => {
        if (type === "partial") {
            if (grades.length >= 1) {
                setGrades(prevArray => [...prevArray, { id: (grades[grades.length - 1].id) + 1, test: '', grade: '', percentage: '' }]);
            }
            else {
                setGrades(prevArray => [...prevArray, { id: 1, test: '', grade: '', percentage: '' }]);
            }
        } else {
            if (percetageSum === 100) {
                setExam(prevArray => [...prevArray, { grade: '', percentage: '' }]);
            }
        }
    }

    const raiseExplain = () => {
        ToastAndroid.showWithGravity("Este elemento representa la suma de los porcentajes de tus notas parciales hasta el momento", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    }

    const calculateAverage = () => {
        let acum = 0;
        let missing = false;
        let wrongGradeOrPercentage = false;
        grades.forEach((element) => {
            if (element.grade !== "" && element.percentage !== "") {
                if (parseFloat(element.grade) > 7 || parseFloat(element.grade) < 1 || element.percentage < "10" || element.percentage > "70") {
                    wrongGradeOrPercentage = true;
                }
                else {
                    let thisOne = parseFloat(element.grade) * parseFloat("0." + element.percentage);
                    acum += thisOne;
                }
    
            } else {
                missing = true;
            }
        });
        if (missing) {
            ToastAndroid.showWithGravity("Para calcular el promedio, tanto porcentajes como notas deben estar presentes", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
            setAverage(null);
        } else {
            if (exam.length == 1) {
                if (exam[0].grade !== "" && exam[0].percentage !== "") {
                    if (parseFloat(exam[0].grade) > 7) {
                        ToastAndroid.showWithGravity("La nota máxima es 7.0", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
                    } else {
                        if (parseInt(exam[0].percentage) < 10 || parseInt(exam[0].percentage) > 70) {
                            ToastAndroid.showWithGravity("El porcentaje de tu examen debe ser mayor a 10% o menor a 70%", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
                        } else {
                            if (wrongGradeOrPercentage) {
                                ToastAndroid.showWithGravity("Tus notas parciales no pueden ser menor a 1 o mayor a 7, los porcentajes deben estar entre 10% y 70%", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
                                setAverage(null);
                            } else {
                                if (parseFloat(exam[0].grade) < 1.0 || parseFloat(exam[0].grade) > 7.0) {
                                    ToastAndroid.showWithGravity("La nota de tu examen debe ser entre 1 y 7", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
                                } else {
                                    let examGrade = exam[0].grade;
                                    let examPercentage = parseInt(exam[0].percentage);
                                    let gradesPercentage = 100 - examPercentage;
    
                                    let finalAvg = acum * parseFloat("0." + gradesPercentage);
                                    let finalExam = parseFloat(examGrade) * parseFloat("0." + examPercentage).toFixed(2);
    
                                    let finalGrade = finalAvg + finalExam;
                                    setAverage((finalGrade.toFixed(2)).toString());
                                }
                            }
                        }
                    }
                } else {
                    ToastAndroid.showWithGravity("Para calcular el promedio debes indicar el porcentaje y nota de tu examen.", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
                }
            } else {
                if (wrongGradeOrPercentage) {
                    ToastAndroid.showWithGravity("Tus notas parciales no pueden ser menor a 1 o mayor a 7, los porcentajes deben estar entre 10% y 70%", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
                    setAverage(null);
                } else {
                    setAverage((acum.toFixed(2)).toString());
                }
            }
        }
    }

    //dynamic percentage acum
    React.useEffect(() => {
        sumPercentages();
    }, [grades]);

    //clear Exam if percentage is below 100
    React.useEffect(() => {
        if (percetageSum < 100) {
            setExam([]);
            setAverage(null);
            setButtonState(true);
        }
        if (percetageSum == 100) {
            setButtonState(false);
        }
    }, [percetageSum]);

    //Get stored courses the first time
    React.useEffect(() => {
        getCourses();
    }, []);

    return (
        <Provider>
            <StatusBar style={dark ? "light" : "dark"} />

            <CourseContext.Provider value={CourseState}>
                    <CurrentCourseContext.Provider value={CurrentCourseState}>
                        <ExamContext.Provider value={ExamState}>
                            <GradesContext.Provider value={GradesState}>

                                <SliderContext.Provider value={SliderState}>
                                    <LoadGrades getCourses={getCourses} />
                                </SliderContext.Provider>

                                <ModalContext.Provider value={ModalState}>
                                    <SaveGrades getCourses={getCourses} />
                                </ModalContext.Provider>

                            </GradesContext.Provider>
                        </ExamContext.Provider>
                    </CurrentCourseContext.Provider>
                </CourseContext.Provider>

            <SafeAreaView style={styles.container}>    
                <ScrollView keyboardShouldPersistTaps='handled'>

                    <GradesContext.Provider value={GradesState}>
                        {grades && grades.map((grade) => {
                            return (
                                <Grade key={grade.id} grade={grade} />
                            )
                        })
                        }
                    </GradesContext.Provider>

                    {(exam.length == 1 && percetageSum === 100) && 
                        <AverageContext.Provider value={AverageState}>
                            <ExamContext.Provider value={ExamState}>
                                <Exam/>
                            </ExamContext.Provider>
                        </AverageContext.Provider>
                    }

                    <View style={styles.buttonsRow}>
                        {(grades.length <= 7 && percetageSum < 100) &&
                            <MaterialCommunityIcons name="plus-circle" style={{ paddingRight: 10 }} color={color} size={width / 8} onPress={() => handleAdd("partial")} />
                        }
                        {(grades.length >= 1 && exam.length < 1) &&
                            <Badge onPress={() => raiseExplain()} style={styles.badge} size={width / 9}>{`${percetageSum}%`}</Badge>
                        }
                        {(percetageSum === 100 && exam.length === 0) &&
                            <MaterialCommunityIcons name="star-circle" style={{ paddingLeft: 10 }} color={color} size={width / 8} onPress={() => handleAdd("exam")} />
                        }
                    </View>

                </ScrollView>

            </SafeAreaView>
            <Surface style={styles.surface}>
                <View style={{flex:1.5, justifyContent:"center",alignItems:"center",height:"100%"}}>
                        <Text style={{color: colors.text,fontWeight:"bold", fontSize:16}}>Promedio :</Text>
                </View>
                <View style={{flex:1.5, justifyContent:"center",alignItems:"center",height:"100%"}}>
                    {average && <Text style={{ color: colors.text, fontWeight:"bold", fontSize:28 }}>{average}</Text>}
                </View>
                <View style={{flex:3, justifyContent:"center",alignItems:"center",height:"100%"}}>
                    <Button disabled={buttonState} mode="contained" onPress={() => calculateAverage()}>Calcular</Button>
                </View>
            </Surface>

        </Provider>
    )
}

export default Calculate;