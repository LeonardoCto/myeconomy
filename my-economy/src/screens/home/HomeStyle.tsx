import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    hello: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start', 
        backgroundColor: '#f8f8f8',
        padding: 20, 
    },
    statusMeta: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center', 
      color: 'white',
      flex: 1, 
      paddingTop: 100
    },
    
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        alignSelf: 'stretch', 
        gap: 40,
      },
    userName: {
      fontSize: 26,
      fontWeight: 'bold',
    },
    userHello: {
        fontSize: 20,
    },
    boxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 220,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 220,
        borderRadius: 15,
      },
    input: {
        height: 40,
        borderColor: "darkgreen",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: 300,
        marginLeft: 35
    },

    progressBar: {
      height: 10,
      width: '100%',
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: '#4caf50',
    },


  });

  export default styles;