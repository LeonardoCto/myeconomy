import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./ProfileStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format } from 'date-fns';

const ProfileScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    handleUserInfo();
  }, []);

  const handleUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get('http://192.168.0.70:3005/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserData(response.data.users[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('Token removido com sucesso');
      navigation.navigate('Login');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dados</Text>
      {userData && (
        <View style={styles.textContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{userData.name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>

          <Text style={styles.label}>Data de Nascimento:</Text>
          <Text style={styles.value}>
            {format(new Date(userData.birthdate), 'dd/MM/yyyy')}
          </Text>
        </View>
      )}
      <Pressable style={styles.pressable} onPress={handleLogout}>
        <Text style={styles.pressableText}>SAIR</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;
