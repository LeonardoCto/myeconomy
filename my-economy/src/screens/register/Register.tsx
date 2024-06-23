import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "./RegisterStyle"; 
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
    } else {
      const data = {
        name: name,
        email: email,
        birthdate: dob,
        password: password
      }

      //http://10.0.2.2:3005/signup
      //http://192.168.0.125:3005/signup
      //http://localhost:3005/signup

      axios.post('http://192.168.0.51:3005/signup', data)
      .then(response => {
        console.log(response.data);
        Alert.alert("Sucesso", "Cadastro realizado com sucesso.")
      })
      .catch(error => {
        console.log("ERRO: ", error);
        Alert.alert("Erro", "Ocorreu um erro, verifique suas informações e tente novamente.")
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
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
        placeholder="Data de Nascimento"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBack} style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;