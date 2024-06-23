import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button, Modal } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import styles from './SettingsStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format } from 'date-fns';

const SettingsScreen = () => {
  const [valor, setValor] = useState('');
  const [mes, setMes] = useState('');
  const [limiteConsultado, setLimiteConsultado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoValor, setNovoValor] = useState('');

  const handleSave = async () => {
    const data = {
      limit_amount: valor,
      reference_month: mes
    };
    const token = await AsyncStorage.getItem('userToken');
    axios.post('http://192.168.0.51:3005/limit/create', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      Alert.alert("Sucesso", "Limite cadastrado com sucesso.");
    })
    .catch(error => {
      console.log("ERRO: ", error);
      Alert.alert("Erro", error.response.data);
    });
  };

  const handleGetLimit = async () => {
    const token = await AsyncStorage.getItem('userToken');
    axios.get(`http://192.168.0.51:3005/limit/mes/${mes}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      const limitData = response.data.limits[0];
      setLimiteConsultado(limitData);
    })
    .catch(error => {
      console.log("ERRO: ", error);
      Alert.alert("Erro", error.response.data);
    });
  };

  const handleEditLimit = async () => {
    const token = await AsyncStorage.getItem('userToken');
    axios.put('http://192.168.0.51:3005/limit/update', {
      id: limiteConsultado.id,
      limit_amount: novoValor
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      setLimiteConsultado(response.data.limit);
      setModalVisible(false);
      Alert.alert("Sucesso", "Limite atualizado com sucesso.");
    })
    .catch(error => {
      console.log("ERRO: ", error.response.data);
      Alert.alert("Erro", error.response.data);
    });
  };

  const handleDeleteLimit = async () => {
    const token = await AsyncStorage.getItem('userToken');
    axios.delete('http://192.168.0.51:3005/limit/delete', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { id: limiteConsultado.id }
    })
    .then(response => {
      console.log(response.data);
      setLimiteConsultado(null);
      Alert.alert("Sucesso", "Limite excluído com sucesso.");
    })
    .catch(error => {
      console.log("ERRO: ", error);
      Alert.alert("Erro", error.response.data);
    });
  };

  const meses = [
    { label: 'Janeiro', value: '01-01-2024' },
    { label: 'Fevereiro', value: '01-02-2024' },
    { label: 'Março', value: '01-03-2024' },
    { label: 'Abril', value: '01-04-2024' },
    { label: 'Maio', value: '01-05-2024' },
    { label: 'Junho', value: '01-06-2024' },
    { label: 'Julho', value: '01-07-2024' },
    { label: 'Agosto', value: '01-08-2024' },
    { label: 'Setembro', value: '01-09-2024' },
    { label: 'Outubro', value: '01-10-2024' },
    { label: 'Novembro', value: '01-11-2024' },
    { label: 'Dezembro', value: '01-12-2024' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Limite</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <RNPickerSelect
        onValueChange={(value) => setMes(value)}
        items={meses}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
        placeholder={{
          label: 'Selecione um mês...',
          value: null,
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
      <Text style={styles.title2}>Consulta</Text>
      <RNPickerSelect
        onValueChange={(value) => setMes(value)}
        items={meses}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
        placeholder={{
          label: 'Selecione um mês...',
          value: null,
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleGetLimit}>
        <Text style={styles.buttonText}>Consultar Limite</Text>
      </TouchableOpacity>
      {limiteConsultado && (
        <View style={styles.resultContainer}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
                {format(new Date(limiteConsultado.reference_month), 'MM/yyyy')}
            </Text>
            <Text style={styles.resultText}>R$ {limiteConsultado.limit_amount}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>EDITAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteLimit}>
              <Text style={styles.buttonText}>EXCLUIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Limite</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Valor"
              value={novoValor}
              onChangeText={setNovoValor}
              keyboardType="numeric"
            />
            <Button title="Salvar" onPress={handleEditLimit} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
