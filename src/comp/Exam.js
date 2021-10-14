import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import { ColorContext } from '../context/ColorContext';
import { ExamContext } from '../context/ExamContext';
import { AverageContext } from '../context/AverageContext';



import { MaterialCommunityIcons } from '@expo/vector-icons';


const Exam = () => {
    const { setAverage } =  React.useContext(AverageContext);
    const { exam, setExam } = React.useContext(ExamContext);

    const { color } = React.useContext(ColorContext);
    const { width } = Dimensions.get("window");
    const { dark, colors } = useTheme();

    const styles =  StyleSheet.create({
        examIcon: {
            paddingTop: 20,
            marginLeft: "18%"
        },
        nota: {
            width: "20%",
            marginLeft: "3%"
        },
        porcentaje: {
            width: "15%",
            marginLeft: "3%"
        }
    })

    const handleExamChange = (find, Text) => {
        if (find == "grade") {
            let newText = Text.replace(/[^0-9.]/g, '');
            let temp_state = [...exam]
            let temp_obj = temp_state[0];
            temp_obj.grade = newText;
            setExam(temp_state);
        }
        else if (find == "percentage") {
            let newText = Text.replace(/[^0-9]/g, '');
            let temp_state = [...exam]
            let temp_obj = temp_state[0];
            temp_obj.percentage = newText;
            setExam(temp_state);
        }
        console.log(exam);
    }

    const handleExamDelete = () => {
        setExam([]);
        setAverage(null);
    }

    const raiseExplain = () => {
        ToastAndroid.showWithGravity("El examen se calcula contra el promedio de tus notas parciales", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    }

    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.text, fontWeight: "bold", paddingTop: width / 15, fontSize: width / 28 }}>Examen final</Text>
            <TextInput
                label="Nota"
                maxLength={4}
                keyboardType='numeric'
                mode={'outlined'}
                style={styles.nota}
                theme={{ colors: { primary: color, background: dark ? colors.background : "#F4F4F4", text: colors.text, placeholder: "#676767" } }}
                contextMenuHidden={true}
                value={exam[0].grade}
                onChangeText={(text) => handleExamChange("grade", text)}
            />

            <TextInput
                label="%"
                maxLength={2}
                keyboardType='numeric'
                mode={'outlined'}
                style={styles.porcentaje}
                theme={{ colors: { primary: color, background: dark ? colors.background : "#F4F4F4", text: colors.text, placeholder: "#676767" } }}
                contextMenuHidden={true}
                value={exam[0].percentage}
                onChangeText={(text) => handleExamChange("percentage", text)}
            />
            <View style={{ flexDirection: "row", }}>
                {/* <MaterialCommunityIcons name="wizard-hat" size={width/12} style={styles.examIcon} color={color}/> */}
                <MaterialCommunityIcons name="help-circle" size={width / 12} style={styles.examIcon} color={color} onPress={() => raiseExplain()} />
                <MaterialCommunityIcons name="delete" size={width / 12} style={styles.examIcon} color={"#E75660"} onPress={() => handleExamDelete()} />
            </View>
        </View>
    )
}

export default Exam;