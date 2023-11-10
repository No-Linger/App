import {StyleSheet, Dimensions} from "react-native";
const {height, width}= Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-end'
    },
    button:{
        height:55,
        alignItems:'center',
        borderRadius:35,
        justifyContent:'center',
        marginHorizontal:20,
        marginVertical:10,
        borderWidth:2,
        borderColor:'#4B6CFE'
    },
    buttonText:{
        fontSize:20,
        fontWeight:'600',
        color:'#4B6CFE',
        letterSpacing:0.5
    },
    bottomContainer:{
        justifyContento:'center',
        height:height/3
    },
    textInput:{
        height:50,
        borderWidth:2,
        borderColor: '#4B6CFE',
        marginHorizontal:20,
        marginVertical:20,
        borderRadius:25,
        paddingLeft:20
    },
    formButtom:{
        height:55,
        alignItems:'center',
        borderRadius:35,
        justifyContent:'center',
        marginHorizontal:20,
        marginVertical:10,
        borderWidth:2,
        borderColor:'#4B6CFE',
        elevation:5,
        zindex:-1

    },
    formInputContainer:{
        marginBottom:30,
        //...StyleSheet.absoluteFill,
        zindex:-1,
        justifyContent:'center',
    },
    closeButtonContainer:{
    height:40,
    width:60,
    alignSelf:'center',
    justifyContent:'center',
    elevation:1,
    borderColor: '#4B6CFE',
    borderWidth:2,
    marginBottom:5,
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