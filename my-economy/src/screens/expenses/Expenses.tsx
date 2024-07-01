import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import styles from './ExpensesStyle';
import AsyncStorage from "@react-native-async-storage/async-storage";


const DespesaScreen = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [reference_month, setReference_month] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [expenseData, setExpenseData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    
    
    useEffect(() => {
        handleGetExpenses();
        fetchCategories(); // Carrega as categorias ao montar o componente
    }, []);

    const fetchCategories = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get('http://192.168.0.70:3005/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setCategories(response.data.categories);
            } else {
                console.log('Erro ao buscar categorias:', response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const handleGetExpenses = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get('http://192.168.0.70:3005/expense', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExpenseData(response.data.expenses);
        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar as despesas.');
        }
    };

    const handleSaveExpense = async () => {
        console.log('description:', description);
        console.log('amount:', amount);
        console.log('reference_month:', reference_month);
        console.log('selectedCategoryId:', selectedCategoryId);
    
        // Verificação de preenchimento
        if (!description || !amount || !reference_month || !selectedCategoryId) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione uma categoria');
            return;
        }

        const expenseData = {
            description,
            amount: parseFloat(amount),
            reference_month,
            category_id: selectedCategoryId // Adiciona o category_id selecionado
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post('http://192.168.0.70:3005/expense/create', expenseData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                Alert.alert('Sucesso', 'Despesa cadastrada com sucesso!');
                setDescription('');
                setAmount('');
                setReference_month(null);
                setSelectedCategoryId(null); // Limpa o category_id selecionado
                handleGetExpenses(); // Atualiza a lista de despesas
            } else {
                Alert.alert('Erro', response.data);
            }
        } catch (error) {
            Alert.alert('Erro', error.response.data);
        }
    };


    const handleEditExpense = async () => {
        if (!newDescription || !newAmount) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.put('http://192.168.0.70:3005/expense/update', {
                id: editingExpense.id,
                description: newDescription,
                amount: parseFloat(newAmount),
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                Alert.alert('Sucesso', 'Despesa editada com sucesso!');
                setModalVisible(false);
                handleGetExpenses(); // Atualiza a lista de despesas
            } else {
                Alert.alert('Erro', response.data);
            }
        } catch (error) {
            Alert.alert('Erro', error.response.data);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.delete('http://192.168.0.70:3005/expense/delete', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: { id }
            });
            if (response.status === 200) {
                Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
                handleGetExpenses(); // Atualiza a lista de despesas
            } else {
                Alert.alert('Erro', response.data);
            }
        } catch (error) {
            Alert.alert('Erro', error.response.data);
        }
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setNewDescription(expense.description);
        setNewAmount(expense.amount.toString());
        setModalVisible(true);
    };

    const handleMonthFilterChange = (month) => {
        if (month === null) {
            setSelectedMonth(null);
            handleGetExpenses();
            return;
        }

        setSelectedMonth(month);
        fetchExpensesByMonth(month);
    };

    const fetchExpensesByMonth = async (month) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const url = `http://192.168.0.70:3005/expense/mes/${month}`;
    
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                setExpenseData(response.data.limits);
            } else {
                console.log('Erro ao buscar despesas por mês:', response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar despesas por mês', error);
        }
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
            <Text style={styles.title}>Despesa</Text>
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />
            <RNPickerSelect
                onValueChange={setReference_month}
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
             <RNPickerSelect
                onValueChange={(value) => setSelectedCategoryId(value)}
                items={categories.map(category => ({ label: category.name, value: category.id }))}
                style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                }}
                placeholder={{
                    label: 'Selecione uma categoria...',
                    value: null,
                }}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveExpense}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <Text style={styles.title2}>Histórico</Text>
            <RNPickerSelect
                onValueChange={handleMonthFilterChange}
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
            <FlatList
                data={expenseData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => openEditModal(item)}>
                        <View style={styles.textContainerExpense}>
                            <Text style={styles.textStyle}>{item.description}</Text>
                            <Text style={styles.textStyle}>{item.amount}</Text>
                            <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                                <Text style={styles.deleteButton}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Despesa</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Descrição"
                            value={newDescription}
                            onChangeText={setNewDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Valor"
                            value={newAmount}
                            onChangeText={setNewAmount}
                            keyboardType="numeric"
                        />
                        <Button title="Salvar" onPress={handleEditExpense} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DespesaScreen;
