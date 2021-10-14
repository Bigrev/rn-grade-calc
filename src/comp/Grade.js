import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {TextInput} from'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {ColorContext} from '../context/ColorContext';
import {GradesContext} from '../context/GradesContext';


const Grade = (props) => {
    const { grades, setGrades } = React.useContext(GradesContext);
    const { dark, colors } = useTheme();
    const { color } = React.useContext(ColorContext);

    const { width } =  Dimensions.get("window");

    const styles = StyleSheet.create({
        motivo:{
            width:"45%"
        },
        nota:{
            width:"20%",
            marginLeft:"3%"
        },
        porcentaje:{
            width:"15%",
            marginLeft:"3%"
        },
        deleteIcon:{
            paddingTop:20,
            marginLeft:"5%"
        },
    })

    const handleTextChange = (Id, find, Text) =>{
        if(find == "test" ){
            let temp_state = [...grades];
            let ID = temp_state.findIndex(obj => obj.id == Id);
            let temp_obj = {...temp_state[ID]}
            temp_obj.test = Text;
            temp_state[ID] = temp_obj;
            setGrades(temp_state);
        }
        else if(find == "grade"){
            let newText = Text.replace(/[^0-9.]/g, '');
            let temp_state = [...grades];
            let ID = temp_state.findIndex(obj => obj.id == Id);
            let temp_obj = {...temp_state[ID]}
            temp_obj.grade = newText;
            temp_state[ID] = temp_obj;
            setGrades(temp_state);
        }
        else if(find == "percentage"){
            let newText = Text.replace(/[^0-9]/g, '');
            let temp_state = [...grades];
            let ID = temp_state.findIndex(obj => obj.id == Id);
            let temp_obj = {...temp_state[ID]}
            temp_obj.percentage = newText;
            temp_state[ID] = temp_obj;
            setGrades(temp_state);
        }
    }

    const handleDelete = (gradeID) =>{
        let filteredArr = grades.filter(item => item.id !== gradeID);
        setGrades(filteredArr);
    }

    return (
        <View key={props.grade.id} style={{ flexDirection: "row" }}>
            
            <TextInput
                label="Descripción"
                maxLength={16}
                mode={'outlined'}
                style={styles.motivo}
                theme={{ colors: { primary: color, background: dark ? colors.background : "#F4F4F4", text: colors.text, placeholder: "#676767" } }}
                contextMenuHidden={true}
                value={grades[grades.findIndex(Obj => Obj.id == props.grade.id)].test}
                onChangeText={(text) => handleTextChange(props.grade.id, "test", text)}
            />

            <TextInput
                label="Nota"
                maxLength={4}
                keyboardType='numeric'
                mode={'outlined'}
                style={styles.nota}
                theme={{ colors: { primary: color, background: dark ? colors.background : "#F4F4F4", text: colors.text, placeholder: "#676767" } }}
                contextMenuHidden={true}
                value={grades[grades.findIndex(Obj => Obj.id == props.grade.id)].grade}
                onChangeText={(text) => handleTextChange(props.grade.id, "grade", text)}
            />

            <TextInput
                label="%"
                maxLength={2}
                keyboardType='numeric'
                mode={'outlined'}
                style={styles.porcentaje}
                theme={{ colors: { primary: color, background: dark ? colors.background : "#F4F4F4", text: colors.text, placeholder: "#676767" } }}
                contextMenuHidden={true}
                value={grades[grades.findIndex(Obj => Obj.id == props.grade.id)].percentage}
                onChangeText={(text) => handleTextChange(props.grade.id, "percentage", text)}
            />

            <MaterialCommunityIcons name="delete" size={width / 12} style={styles.deleteIcon} color={"#E75660"} onPress={() => handleDelete(props.grade.id)} />

        </View>
    )
}

export default Grade;