import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import Bird from "../components/Bird";
import Obstacle from "../components/Obstacle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function FlappyBird() {
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  // Bird
  const birdLeft = screenWidth / 2;
  const [gravity, setGravity] = useState(4);

  const [birdBottom, setBirdBottom] = useState(screenHeight / 2);

  // Obstacles
  const [obstacleLeft, setObstacleLeft] = useState(screenWidth);
  const obstacleWidth = 60;
  const obstacleHeight = 300;
  const gap = 150;

  const [obstacleLeftTwo, setObstacleLeftTwo] = useState(
    screenWidth + screenWidth / 2 + 30
  );
  const [obstacleNegHeight, setObstacleNegHeight] = useState(0);
  const [obstacleNegHeightTwo, setObstacleNegHeightTwo] = useState(0);

  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  let gameTimerId;

  // Bird Flying
  useEffect(() => {
    if (birdBottom > 0 && !isGameOver) {
      gameTimerId = setInterval(() => {
        setBirdBottom((birdBottom) => birdBottom - gravity);
      }, 30);

      return () => {
        clearInterval(gameTimerId);
      };
    }
  }, [birdBottom, isGameOver]);

  const jump = () => {
    if (!isGameOver && birdBottom < screenHeight) {
      setBirdBottom((birdBottom) => birdBottom + 50);
    }
  };

  // Function to reset the game
  const resetGame = () => {
    setScore(0);
    setBirdBottom(screenHeight / 2);
    setObstacleLeft(screenWidth);
    setObstacleLeftTwo(screenWidth + screenWidth / 2 + 30);
    setObstacleNegHeight(0);
    setObstacleNegHeightTwo(0);
    setIsGameStarted(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    resetGame(); // Automatically reset the game when the component loads.
  }, []);

  // Start the game
  const startGame = () => {
    resetGame(); // Reset the game to its initial state
    setIsGameStarted(true);
  };

  // Obstacles
  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      if (obstacleLeft > -obstacleWidth) {
        const obstacleTimerID = setInterval(() => {
          setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
        }, 30);
        return () => {
          clearInterval(obstacleTimerID);
        };
      } else {
        setObstacleLeft(screenWidth);
        setObstacleNegHeight(-Math.random() * 100);
        setScore((score) => score + 1);
      }
    }
  }, [obstacleLeft, isGameStarted, isGameOver]);

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      if (obstacleLeftTwo > -obstacleWidth) {
        const obstacleTimerIDTwo = setInterval(() => {
          setObstacleLeftTwo((obstacleLeftTwo) => obstacleLeftTwo - 5);
        }, 30);
        return () => {
          clearInterval(obstacleTimerIDTwo);
        };
      } else {
        setObstacleLeftTwo(screenWidth);
        setObstacleNegHeightTwo(-Math.random() * 100);
        setScore((score) => score + 1);
      }
    }
  }, [obstacleLeftTwo, isGameStarted, isGameOver]);

  // Collisions
  useEffect(() => {
    if (
      (birdLeft + 34 > obstacleLeft &&
        birdLeft < obstacleLeft + obstacleWidth &&
        (birdBottom < obstacleNegHeight + obstacleHeight ||
          birdBottom + 24 > obstacleNegHeight + obstacleHeight + gap)) ||
      (birdLeft + 34 > obstacleLeftTwo &&
        birdLeft < obstacleLeftTwo + obstacleWidth &&
        (birdBottom < obstacleNegHeightTwo + obstacleHeight ||
          birdBottom + 24 > obstacleNegHeightTwo + obstacleHeight + gap))
    ) {
      console.log("Game Over");
      gameOver();
    }
  });

  const gameOver = () => {
    clearInterval(gameTimerId);
    setIsGameOver(true);
    setGravity(4);
  };

  useEffect(() => {
    if (score >= 3) {
      SpeedGame();
    }
    if (score >= 6) {
      SpeedGameX2();
    }
  }, [score]);

  const SpeedGame = () => {
    setGravity(6);
  };

  const SpeedGameX2 = () => {
    setGravity(8);
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        {isGameStarted ? (
          <>
            <Icon
              name="bird"
              size={40}
              color="#4B6CFE"
              style={{
                position: "absolute",
                left: birdLeft,
                bottom: birdBottom,
              }}
            />

            <Obstacle
              ObstaclesLeft={obstacleLeft}
              ObstacleWidth={obstacleWidth}
              ObstacleHeight={obstacleHeight}
              gap={gap}
              color={"#4B6CFE"}
              randomHeight={obstacleNegHeight}
            />
            <Obstacle
              ObstaclesLeft={obstacleLeftTwo}
              ObstacleWidth={obstacleWidth}
              ObstacleHeight={obstacleHeight}
              gap={gap}
              color={"#4B6CFE"}
              randomHeight={obstacleNegHeightTwo}
            />
            {isGameOver && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  borderColor: "#4B6CFE",
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                  borderRadius: 15,
                }}
              >
                <Text style={{ fontSize: 24, color: "#4B6CFE", padding: 5 }}>
                  ¡Ooopps! Perdiste
                </Text>
                <Text style={{ fontSize: 24, color: "black", padding: 5 }}>
                  Puntuación: {score}
                </Text>
                <Button title="De nuevo" onPress={resetGame} />
              </View>
            )}
          </>
        ) : (
          <View
            style={{
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#4B6CFE",
              borderWidth: 2,
              margin: 15,
              borderRadius: 10,
              padding: 15,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                marginBottom: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "#4B6CFE",
                marginTop: 10,
              }}
            >
              FlappyBird
            </Text>
            <Text
              style={{
                padding: 10,
                textAlign: "center",
                color: "black",
                marginBottom: 10,
              }}
            >
              Esta es una pantalla de carga {"\n"} en lo que esperas a que
              cargue{"\n"} lo que sea que esté cargando
            </Text>
            <TouchableOpacity
              onPress={startGame}
              style={{ borderWidth: 2, padding: 8, borderRadius: 10 }}
            >
              <Text style={{ fontSize: 20 }}>Empezar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
