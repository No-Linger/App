import React from "react";
import { View } from "react-native";

const Obstacle = ({color, ObstacleHeight, ObstacleWidth, ObstaclesLeft, gap, randomHeight}) => {

    return(
        <>
        <View style={{
            position:'absolute',
            backgroundColor: color,
            width: ObstacleWidth,
            height: ObstacleHeight,
            left: ObstaclesLeft,
            bottom : randomHeight + ObstacleHeight + gap

        }}/>

        <View style={{
            position:'absolute',
            backgroundColor: color,
            width: ObstacleWidth,
            height: ObstacleHeight,
            left: ObstaclesLeft,
            bottom : randomHeight
        }}/>

        </>
    )
}

export default Obstacle