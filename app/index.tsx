import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';
import {Checkbox} from 'expo-checkbox';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { jsx } from "react/jsx-runtime";

type ToDoType ={
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {
  const todoData =[
    {
      id: 1,
      title: "Todo 1",
      isDone: false,
    },
    {
      id: 2,
      title: "Todo 2",
      isDone: false,
    },
    {
      id: 3,
      title: "Todo 3",
      isDone: false,
    },
    {
      id: 4,
      title: "Todo 4",
      isDone: true,
    },
    {
      id: 5,
      title: "Todo 5",
      isDone: false,
    },
    {
      id: 6,
      title: "Todo 6",
      isDone: false,
    },
  ];

  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oldTodos, setOldTodos] = useState<ToDoType[]>([]);

  
  useEffect(() => {
    const getTodos = async() =>{
      try{
        const todos = await AsyncStorage.getItem('my-todo');
        if(todos !== null){
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));
        }
      }catch(error){
        console.log(error);
        }
    }
    getTodos();
  }, []);

  const addTodo = async() => {
    try{
      const newTodo = {
      id: Math.random()*100+1,
      title: todoText,
      isDone:false,
    };
    todos.push(newTodo);
    setTodos(todos);
    setOldTodos(todos);
    await AsyncStorage.setItem('my-todo', JSON.stringify(todos));
    setTodoText('');
    Keyboard.dismiss();
    }catch(error){
      console.log(error);
    }
    
  }


  const deleteTodo = async(id:number) =>{
    try{
      const newTodos = todos.filter((todo) => todo.id !== id );
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    }catch(error){
      console.log(error);
    }
  }

  const handleTodo = async (id:number) => {
    try{
      const newTodos = todos.map((todo) =>{
        if(todo.id === id){
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    }catch(error){
      console.log(error);
    }
  }

  const onSearch = (query:string) =>{
    if(query===''){
      setTodos(oldTodos);
    }else{
      const filteredTodos = todos.filter((todo) =>
      todo.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
      setTodos(filteredTodos);
    }
  };
  
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery]);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{alert("Icon is Clicked !")}}>
          <Ionicons name="menu" size={30} color={'#333'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{alert('Profile Icon Clicked !')}}>
          <Image source={require('../assets/images/profilenew.png')} style={{height:40, width:40, borderRadius:20}} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color={'#333'}/>
          {/* <TextInput placeholder="Search" style={styles.searchInput} clearButtonMode="always" /> */}
          <TextInput 
              placeholder="Search"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)} 
              style={styles.searchInput} 
              placeholderTextColor={'#939393ff'} />
      </View>

      <FlatList 
        data={[...todos].reverse()} 
        keyExtractor={(item) => (item.id.toString())} 
        renderItem={({item})=>(
        <ToDoItem todo={item} deleteTodo={deleteTodo} handleTodo={handleTodo} />
      )} />

      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20} style={styles.footer}>
        <TextInput
             placeholder="Add new Todo" 
             placeholderTextColor={'#939393ff'} 
             style={styles.newTodoInput}
             value={todoText}
             onChangeText={(text)=>setTodoText(text)}
             autoCorrect={false}
          />

        <TouchableOpacity style={styles.addButton} onPress={()=>addTodo()}>
          <Ionicons name="add" size={34} color={'#fff'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


const ToDoItem = ({todo, deleteTodo, handleTodo}:{todo:ToDoType, deleteTodo:(id:number) =>void, handleTodo:(id:number) => void
}) =>(
  <View style={styles.todoContainer}>

          <View style={styles.todoInfo}>
            <Checkbox value={todo.isDone} onValueChange={() => handleTodo(todo.id)} color={todo.isDone ? '#4630EB': undefined} />
            <Text style={[styles.todoText, todo.isDone && {textDecorationLine:'underline line-through'}]}>{todo.title}</Text>
          </View>
          <TouchableOpacity onPress={()=>{
            deleteTodo(todo.id);
            alert('DELETED '+todo.id);
            }}>
            <Ionicons name="trash" size={24} color={'red'} />
          </TouchableOpacity>
        </View>
);





const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:20,
    backgroundColor:'#c1dfefff'
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:20,
    marginTop:20
  },
  searchBar:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
    // padding: 16,
    gap: 10,
    borderRadius: 10,
    marginBottom:20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 8,
  },
  searchInput:{
    flex:1,
    fontSize: 16,
    color:"#333",
 },
  todoContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#fff',
    marginBottom:20,
    padding:16,
    borderRadius:10,

 },
  todoInfo:{
    flexDirection:'row',
    gap:10,
    alignItems:'center',
 },
  todoText:{
    fontSize:16,
    color:'#333'
  },
  footer:{
    marginTop:20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    bottom:2
  },
  newTodoInput:{
    backgroundColor:'#fff',
    flex:1,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",

  },
  addButton:{
    backgroundColor:"#4630EB",
    padding:8,
    borderRadius:10,
    marginLeft:20
  }
})
