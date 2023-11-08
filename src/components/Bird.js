import React from "react"
import { View } from "react-native"

export default function Bird ({birdBottom, birdLeft}) {
    
    const birdWidth = 50
    const birdHeight = 60

    return(

        <View style={{
            position:'absolute',
            backgroundColor:'blue',
            width:50,
            height: 60,
            left: birdLeft - (birdWidth/2),
            bottom: birdBottom,
        }} />

    )
}