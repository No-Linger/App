import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    button: {
        height: 55,
        alignItems: 'center',
        borderRadius: 35,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#4B6CFE'
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4B6CFE',
        letterSpacing: 0.5
    },
    bottomContainer: {
        justifyContent: 'center',
        marginBottom: 100,
        height: height / 3,
    },
    textInput: {
        height: 50,
        borderWidth: 2,
        borderColor: '#4B6CFE',
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 25,
        paddingLeft: 20
    },
    formButtom: {
        height: 45,
        alignItems: 'center',
        borderRadius: 35,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#4B6CFE',
        elevation: 5,
        zIndex: -1  // Changed 'zindex' to 'zIndex'
    },
    formInputContainer: {
        marginBottom: 30,
        //...StyleSheet.absoluteFill,
        zIndex: -1,  // Changed 'zindex' to 'zIndex'
        justifyContent: 'center',
    },
    closeButtonContainer: {
        height: 40,
        width: 60,
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 1,
        borderColor: '#4B6CFE',
        borderWidth: 2,
        marginBottom: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 20,
        zIndex: 1  // Changed 'zindex' to 'zIndex'
    },
    lottieAnimationStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: '100',
        left: '100'
    }
});

export default styles;

// import { StyleSheet, Dimensions } from "react-native";

// const { height, width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-end'
//     },
//     button: {
//         height: height * 0.1, // Ajusta el tamaño del botón según la altura de la pantalla
//         alignItems: 'center',
//         borderRadius: width * 0.1, // Ajusta el radio del borde según el ancho de la pantalla
//         justifyContent: 'center',
//         marginHorizontal: width * 0.05, // Ajusta el margen horizontal según el ancho de la pantalla
//         marginVertical: height * 0.05, // Ajusta el margen vertical según la altura de la pantalla
//         borderWidth: 2,
//         borderColor: '#4B6CFE'
//     },
//     buttonText: {
//         fontSize: width * 0.06, // Ajusta el tamaño del texto según el ancho de la pantalla
//         fontWeight: '600',
//         color: '#4B6CFE',
//         letterSpacing: width * 0.005, // Ajusta el espaciado entre letras según el ancho de la pantalla
//     },
//     bottomContainer: {
//         justifyContent: 'center',
//         marginBottom: height * 0.2, // Ajusta el margen inferior según la altura de la pantalla
//         height: height / 3,
//     },
//     textInput: {
//         height: height * 0.1, // Ajusta la altura del cuadro de texto según la altura de la pantalla
//         borderWidth: 2,
//         borderColor: '#4B6CFE',
//         marginHorizontal: width * 0.05,
//         marginVertical: height * 0.05,
//         borderRadius: width * 0.1,
//         paddingLeft: width * 0.05, // Ajusta el relleno izquierdo según el ancho de la pantalla
//     },
//     formButtom: {
//         height: height * 0.09,
//         alignItems: 'center',
//         borderRadius: width * 0.1,
//         justifyContent: 'center',
//         marginHorizontal: width * 0.05,
//         marginVertical: height * 0.05,
//         borderWidth: 2,
//         borderColor: '#4B6CFE',
//         elevation: 5,
//         zIndex: -1
//     },
//     formInputContainer: {
//         marginBottom: height * 0.15,
//         zIndex: -1,
//         justifyContent: 'center',
//     },
//     closeButtonContainer: {
//         height: height * 0.08,
//         width: width * 0.12,
//         alignSelf: 'center',
//         justifyContent: 'center',
//         elevation: 1,
//         borderColor: '#4B6CFE',
//         borderWidth: 2,
//         marginBottom: height * 0.03,
//         backgroundColor: 'white',
//         alignItems: 'center',
//         borderRadius: width * 0.06,
//         zIndex: 1
//     },
//     lottieAnimationStyle: {
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         position: 'absolute',
//         top: height * 0.5,
//         left: width * 0.5
//     }
// });

// export default styles;
