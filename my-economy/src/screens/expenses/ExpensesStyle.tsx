import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        padding: 20
    },
    title2: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        padding: 20
    },
    input: {
        height: 40,
        borderColor: "darkgreen",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signUpText: {
        color: 'black',
        fontSize: 16,
    },
    textContainer: {
        width: '80%', 
      },
      card: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
    },
    textContainerExpense: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textStyle: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 18,
        marginBottom: 10,
      },
      deleteButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
        flex: 1,
      },
});

export default styles;
