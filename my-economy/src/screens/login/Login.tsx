import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "./LoginStyle"; 
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const data = {
      email: email,
      password: password
    }

    axios.post('http://192.168.0.70:3005/signin', data)
      .then(async response => {
        console.log(response.data);
        const token = response.data.token;
        await AsyncStorage.setItem('userToken', token)
        
        navigation.navigate('TabNavigator'); 
      })
      .catch(error => {
        console.log("ERRO: ", error);
        Alert.alert("Erro", "Ocorreu um erro, verifique suas informações e tente novamente.")
      });
  }

  const handleSignUp = () => {
    navigation.navigate('Register'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Não possui conta? Criar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
