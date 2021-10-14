import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal} from 'react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorContext } from '../context/ColorContext';
import { CourseContext } from '../context/CourseContext';
import { ModalContext } from '../context/ModalContext';
import { CurrentCourseContext } from '../context/CurrentCourseContext';
import { ExamContext } from '../context/ExamContext';
import { GradesContext } from '../context/GradesContext';


const SaveGrades = (props) =>{
    const { course, setCourse } = React.useContext(CourseContext);
    const { currentCourses, setCurrentCourses } = React.useContext(CurrentCourseContext);
    const { modalVisible, setModalVisible } = React.useContext(ModalContext);
    const { exam } = React.useContext(ExamContext);
    const { grades } = React.useContext(GradesContext); 
    const { color } = React.useContext(ColorContext);
    const [showWarningExist, setShowWarningExist] = React.useState(false);
    const [showWarningEmpty, setShowWarningEmpty] = React.useState(false);

    const handleSave = () =>{
        if(showWarningEmpty == true){

        }else{
            (async ()=>{
                let thisCourse = course.replace(/[@]/g, "");
    
                let gradesToString = JSON.stringify([...grades]);
                AsyncStorage.setItem(`${thisCourse}`, gradesToString,()=>{
                    props.getCourses();
                });
                
                let examToString = JSON.stringify([...exam]);
                AsyncStorage.setItem(`${thisCourse}@exam`, examToString);
    
                setModalVisible(prevState => !prevState);
            })();
        }
    }

    const handleCancel = () => { setModalVisible(prevState => !prevState); }

    //show warning if current course name is already in database

    React.useEffect(()=>{
        if([...currentCourses].includes(course)){
            setShowWarningExist(true);
        }else{
            setShowWarningExist(false);
        }

        let str = course;
        if(!str.replace(/\s/g, '').length){
            setShowWarningEmpty(true);
        }else{
            setShowWarningEmpty(false);
        }
    }, [course]);


    return(
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}> 
            <TextInput label="Nombre de la asignatura" maxLength={20} mode={'outlined'} value={course} style={styles.asignatura} 
            onChangeText={course => setCourse(course)} theme={{colors:{primary:color}}}/>
                {showWarningExist&&
                    <Text style={{color:"red"}}>Esta asignatura ya esta registrada, si guardas los cambios será modificada</Text>
                }
                {showWarningEmpty&&
                    <Text style={{color:"red"}}>El nombre no puede estar vacío</Text>
                }
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={()=> handleCancel()}>
                        <Text style={styles.modalText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> handleSave()}>
                        <Text style={styles.modalText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      modalText:{
          fontWeight: "bold",
          paddingLeft:"20%",
          paddingTop: "5%"
      },
      asignatura:{
        marginBottom:"2%"
    },
})

export default SaveGrades;