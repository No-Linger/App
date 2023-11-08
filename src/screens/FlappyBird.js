import React from "react";
import { useState, useEffect } from "react";
import { Text, View, Button, Dimensions, TouchableWithoutFeedback } from "react-native";

import Bird from "../components/Bird";
import Obstacle from "../components/Obstacle";

export default function FlappyBird() {
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  // Bird
  const birdLeft = screenWidth / 2;
  const [birdBottom, setBirdBottom] = useState(screenHeight / 2);
  const gravity = 3;

  // Obstacle
  const [ObstaclesLeft, setObstaclesLeft] = useState(screenWidth);
  const ObstacleWidth = 60;
  const ObstacleHeight = 300;
  const gap = 150;

  const [ObstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + screenWidth / 2 + 30);
  const [ObstaclesNegHeight, setObstaclesNegHeight] = useState(0);
  const [ObstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0);

  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  let gameTimerId;

  // Bird Flying
  useEffect(() => {
    if (birdBottom > 0) {
      gameTimerId = setInterval(() => {
        setBirdBottom((birdBottom) => birdBottom - gravity);
      }, 30);

      return () => {
        clearInterval(gameTimerId);
      };
    }
  }, [birdBottom]);

  const jump = () => {
    if (!isGameOver && birdBottom < screenHeight) {
      setBirdBottom((birdBottom) => birdBottom + 50);
    }
  };

  // First Obstacles
  let ObstaclesLeftTimerID;
  useEffect(() => {
    // Move 5 pixels to the left every 30 milliseconds
    if (ObstaclesLeft > -ObstacleWidth) {
      ObstaclesLeftTimerID = setInterval(() => {
        setObstaclesLeft((ObstaclesLeft) => ObstaclesLeft - 5);
      }, 30);
      return () => {
        clearInterval(ObstaclesLeftTimerID);
      };
    } else {
      setObstaclesLeft(screenWidth);
      setObstaclesNegHeight(-Math.random() * 100);
      setScore((score) => score + 1);
    }
  }, [ObstaclesLeft]);

  let ObstaclesLeftTimerIDTwo;
  useEffect(() => {
    // Move 5 pixels to the left every 30 milliseconds
    if (ObstaclesLeftTwo > -ObstacleWidth) {
      ObstaclesLeftTimerIDTwo = setInterval(() => {
        setObstaclesLeftTwo((ObstaclesLeftTwo) => ObstaclesLeftTwo - 5);
      }, 30);
      return () => {
        clearInterval(ObstaclesLeftTimerIDTwo);
      };
    } else {
      setObstaclesLeftTwo(screenWidth);
      setObstaclesNegHeightTwo(-Math.random() * 100);
      setScore((score) => score + 1);
    }
  }, [ObstaclesLeftTwo]);

  // Collisions
  useEffect(() => {
    if (
      (birdLeft + 34 > ObstaclesLeft &&
        birdLeft < ObstaclesLeft + ObstacleWidth &&
        (birdBottom < ObstaclesNegHeight + ObstacleHeight ||
          birdBottom + 24 > ObstaclesNegHeight + ObstacleHeight + gap)) ||
      (birdLeft + 34 > ObstaclesLeftTwo &&
        birdLeft < ObstaclesLeftTwo + ObstacleWidth &&
        (birdBottom < ObstaclesNegHeightTwo + ObstacleHeight ||
          birdBottom + 24 > ObstaclesNegHeightTwo + ObstacleHeight + gap))
    ) {
      console.log("Game Over");
      gameOver();
    }
  });

  const gameOver = () => {
    clearInterval(gameTimerId);
    clearImmediate(ObstaclesLeftTimerID);
    clearInterval(ObstaclesLeftTimerIDTwo);
    setIsGameOver(true);
  };

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
  };

  const resetGame = () => {
    setScore(0);
    setBirdBottom(screenHeight / 2);
    setObstaclesLeft(screenWidth);
    setObstaclesLeftTwo(screenWidth + screenWidth / 2 + 30);
    setObstaclesNegHeight(0);
    setObstaclesNegHeightTwo(0);
    setIsGameStarted(true); // Automatically start the game on reset.
    setIsGameOver(false);
  };

  useEffect(() => {
    startGame(); // Automatically start the game when the component loads.
  }, []);

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {isGameStarted ? (
          <>
            <Bird birdBottom={birdBottom} birdLeft={birdLeft} />
            <Obstacle
              ObstaclesLeft={ObstaclesLeft}
              ObstacleWidth={ObstacleWidth}
              ObstacleHeight={ObstacleHeight}
              gap={gap}
              color={"green"}
              randomHeight={ObstaclesNegHeight}
            />
            <Obstacle
              ObstaclesLeft={ObstaclesLeftTwo}
              ObstacleWidth={ObstacleWidth}
              ObstacleHeight={ObstacleHeight}
              gap={gap}
              color={"yellow"}
              randomHeight={ObstaclesNegHeightTwo}
            />
            {isGameOver && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "gainsboro",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 24 }}>Game Over</Text>
                <Text style={{ fontSize: 24 }}>Score: {score}</Text>
                <Button title="Restart" onPress={resetGame} />
              </View>
            )}
          </>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
              Welcome to Flappy Bird!
            </Text>
            <Button title="Start" onPress={startGame} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
