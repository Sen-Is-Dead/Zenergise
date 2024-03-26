import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '60%',
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    linkText: {
        color: 'deepskyblue',
        marginTop: 10,
        marginBottom: 15,
        textDecorationLine: 'underline'
    },  
    button: {
        backgroundColor: 'dodgerblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default styles;
