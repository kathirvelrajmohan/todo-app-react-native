import { useLocalSearchParams } from "expo-router";
import {View, Text, Pressable, StyleSheet, TextInput} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";


export default function EditScreen(){
    const {id} = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const router = useRouter()
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);
    const [loaded, error] = useFonts({
        Inter_500Medium,
    })

    useEffect(() => {
        const fetchData = async (id) => {
            try{
                const jsonValue = await AsyncStorage.getItem('TodoApp')
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

                if(storageTodos && storageTodos.length){
                    const MyTodo = storageTodos.find(todo => todo.id.toString() === id)
                    setTodo(MyTodo)
                }
            
            } catch(e){
                console.error(e)
            }
        }
        
        fetchData(id)
    },[])

    if(!loaded && !error) return null

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try{
            const saveTodo = {...todo, title: todo.title}

            const jsonValue = await AsyncStorage.getItem('TodoApp')
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            if(storageTodos && storageTodos.length){
                const otherTodos = storageTodos.filter(todo => todo.id !== saveTodo.id)
                const allTodos = [...otherTodos, saveTodo]
                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
            } else{
                await AsyncStorage.setItem('TodoApp', JSON.stringify([saveTodo]))
            }

            router.push('/')
        } catch(e){
            console.error(e)
        }
    } 

    return (
        <SafeAreaView style = {styles.container}>
            <View style = {styles.inputContainer}>
                <TextInput
                    style = {styles.input}
                    placeholder = "Edit todo"
                    placeholderTextColor = "gray"
                    value = {todo?.title || ""} 
                    onChangeText = {(text) => setTodo(prev => ({...prev, title: text}))}
                    />
                    
                <Pressable
                    onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>

                    <Octicons name={colorScheme === 'dark' ? "moon" : "sun"} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
                </Pressable>
            </View>
            <View style = {styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style = {styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>
                        Save
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}    
                    style = {[styles.saveButton, { backgroundColor: 'red' }]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>
                        Cancel
                    </Text>
                </Pressable>
            </View>
            <StatusBar style = {colorScheme === 'light' ? 'dark' : 'light'} />
        </SafeAreaView>
        
    )
}

function createStyles(theme, colorScheme){
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        input: {
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
            MarginRight: 10,
            fontSize: 18,
            color: theme.text,
            fontFamily: 'Inter_500Medium',
            borderRadius: 5,
            minWidth: 0,
        },
        saveButton: {
            backgroundColor: theme.button,
            padding: 10,
            borderRadius: 5,
        },
        saveButtonText: {
            color: colorScheme === 'dark' ? 'black' : 'white',
            fontSize: 18,
        }
    })
}