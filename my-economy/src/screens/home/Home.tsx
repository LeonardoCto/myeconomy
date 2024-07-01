import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, Modal, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './HomeStyle';


const HomeScreen = ({ route, navigation }) => {
  const [limiteConsultado, setLimiteConsultado] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [limitAmount, setLimitAmount] = useState(null);
  const [expenseAmounts, setExpenseAmounts] = useState([]);
  const [percentageUsed, setPercentageUsed] = useState(0);
  const [progressBarProgress, setProgressBarProgress] = useState(0);
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

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

  useEffect(() => {
    handleUserInfo();
    if (selectedMonth) {
      handleGetLimit(selectedMonth);
      handleGetExpenses(selectedMonth);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (limitAmount && expenseAmounts.length > 0) {
      const totalExpenses = expenseAmounts.reduce((acc, curr) => acc + curr, 0);
      const percentageUsed = (totalExpenses / parseFloat(limitAmount)) * 100;
      setProgressBarProgress(percentageUsed / 100);
    }
  }, [limitAmount, expenseAmounts]);

  useEffect(() => {
    if (expenseData.length > 0) {
      calculateCategoryExpenses();
    }
  }, [expenseData]);

  const calculateCategoryExpenses = () => {
    const categories = {};
    expenseData.forEach(expense => {
      const categoryId = expense.category_id;
      if (!categories[categoryId]) {
        categories[categoryId] = {
          id: categoryId,
          name: expense.category_name, // Supondo que a API retorne o nome da categoria
          totalAmount: parseFloat(expense.amount),
        };
      } else {
        categories[categoryId].totalAmount += parseFloat(expense.amount);
      }
    });

    const categoriesArray = Object.values(categories);
    setCategoryData(categoriesArray);
  };


  const handleUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get("http://192.168.0.70:3005/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.users[0]);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao carregar informações do usuário.');
    }
  };

  const handleGetLimit = async (selectedMonth) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = `http://192.168.0.70:3005/limit/mes/${selectedMonth}`;
      console.log('URL handleGetLimit:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const limitData = response.data.limits[0];
      setLimiteConsultado(limitData);
      setLimitAmount(limitData.limit_amount);
      console.log('Limit Amount:', limitData.limit_amount);
    } catch (error) {
      console.log('ERRO: ', error);
      Alert.alert('Erro', error.response?.data);
    }
  };

  const handleGetExpenses = async (month) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = `http://192.168.0.70:3005/expense/mes/${month}`;
      console.log('URL handleGetExpenses:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setExpenseData(response.data.limits);
        const amounts = response.data.limits.map(expense => parseFloat(expense.amount));
        setExpenseAmounts(amounts);
        console.log('Expense Amounts:', amounts);

        const totalExpenses = amounts.reduce((acc, curr) => acc + curr, 0);
        const limit = parseFloat(limitAmount);
        const percentage = (totalExpenses / limit) * 100;
        setPercentageUsed(parseFloat(percentage.toFixed(2)));
        console.log('Total Expenses:', totalExpenses);
        console.log('Percentage Used:', percentage);
      } else {
        console.log('Erro ao buscar despesas por mês:', response.data);
      }
    } catch (error) {
      Alert.alert("Erro", error);
    }
  };

  const handleMonthChange = async (value) => {
    setSelectedMonth(value);
    if (value) {
      await handleGetLimit(value);
      await handleGetExpenses(value);
    }
  };

  const handleProgressClick = () => {
    setShowProgressPopup(true);
  };

  return (
    <View style={styles.hello}>
      {userData && (
        <>
          <Text style={styles.userName}>Olá {userData.name} 👋</Text>
          <Text style={styles.userHello}>É bom te ver por aqui!</Text>
        </>
      )}

      <View style={styles.container}>
        <RNPickerSelect
          onValueChange={handleMonthChange}
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
        <View style={styles.boxContainer}>
          <LinearGradient
            colors={['rgb(71, 173, 98)', 'rgba(135, 204, 153, 0.8)']}
            style={styles.background}
          >
            <Text style={styles.statusMeta}>
              {percentageUsed === 0 ? 'Status da meta' :
                percentageUsed < 100 ? 'Parabéns, você economizou 🤩' : 'Objetivo não atingido 😢'
              }
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.userHello}>Progresso</Text>
        <Text style={styles.progressBarText}>Despesa total: R$ {expenseAmounts.reduce((acc, curr) => acc + curr, 0).toFixed(2)}</Text>
        <Text style={styles.progressBarText}>Limite do mês: R$ {limitAmount}</Text>
        <TouchableWithoutFeedback onPress={handleProgressClick}>
          <View style={styles.progressBar}>
            <ProgressBar
              progress={progressBarProgress}
              width={null}
              height={20}
              borderRadius={5}
              color="rgb(71, 173, 98)"
              unfilledColor="rgba(135, 204, 153, 0.3)"
            />
          </View>
        </TouchableWithoutFeedback>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showProgressPopup}
          onRequestClose={() => {
            setShowProgressPopup(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Progresso Geral</Text>
              <Text style={styles.modalText}>Progresso total: {percentageUsed.toFixed(2)}%</Text>

              
              <View style={styles.modalProgressBar}>
                <View style={[styles.progress, { width: `${progressBarProgress * 100}%` }]} />
              </View>
              <Button
                title="Fechar"
                onPress={() => setShowProgressPopup(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );

};

export default HomeScreen;
