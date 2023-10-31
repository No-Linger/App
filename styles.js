import {StyleSheet, Dimensions} from "react-native";
const {height, width}= Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-end'
    },
    button:{
        backgroundColor:'rgba(123,104,238,0.8)',
        height:55,
        alignItems:'center',
        borderRadius:35,
        justifyContent:'center',
        marginHorizontal:20,
        marginVertical:10,
        borderWidth:1,
        borderColor:'white'
    },
    buttonText:{
        fontSize:20,
        fontWeight:'600',
        color:'white',
        letterSpacing:0.5
    },
    bottomContainer:{
        justifyContento:'center',
        height:height/3
    },
    textInput:{
        height:50,
        borderWidth:1,
        borderColor: 'rgba(0,0,0,0.2)',
        marginHorizontal:20,
        marginVertical:20,
        borderRadius:25,
        paddingLeft:20

    },
    formButtom:{
        backgroundColor:'rgba(123,104,238,0.8)',
        height:55,
        alignItems:'center',
        borderRadius:35,
        justifyContent:'center',
        marginHorizontal:20,
        marginVertical:10,
        borderWidth:1,
        borderColor:'white',
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:7,
        },
        shadowOpacity:0.25,
        shadowRadius:3.84,
        elevation:5,
        zindex:-1

    },
    formInputContainer:{
        marginBottom:30,
        //...StyleSheet.absoluteFill,
        zindex:-1,
        justifyContent:'center'
    },
    closeButtonContainer:{
    height:40,
    width:60,
    alignSelf:'center',
    justifyContent:'center',
    shadowColor:'#000',
    shadowOffset:{
        width:0,
        height:7
    },
    shadowOpacity:0.34,
    shadowRadius:6.27,
    elevation:1,
    backgroundColor:'white',
    alignItems:'center',
    borderRadius:20,
    zindex:1

    },
    lottieAnimationStyle:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // marginBottom:150,
        position: 'absolute',
        top: '100',
        left: '100'
        // transform: 'translate(-50%, -50%)'


    }

});

export default styles