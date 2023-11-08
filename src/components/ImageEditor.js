import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { cropImage, rotateImage } from "../services/imageEditorService";

export default function ImageEditor({ image, onCancel, onComplete }) {
  //Image display
  const [editedImage, setEditedImage] = useState(null);

  const [actualImage, setActualImage] = useState(null);

  const [containerWidth, setContainerWidth] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const [imageFixedWidth, setImageFixedWidth] = useState(0);
  const [imageFixedHeight, setImageFixedHeight] = useState(0);

  // Crop square tool
  const [isCroping, setIsCroping] = useState(false);
  const [descaleFactor, setDescaleFactor] = useState(0);

  const croperWidth = useSharedValue(100);
  const croperHeight = useSharedValue(100);

  const croperCornerX = useSharedValue(0);
  const croperCornerY = useSharedValue(0);

  const tempX = useSharedValue(0);
  const tempY = useSharedValue(0);

  const panRef = useRef(null);

  const MIN_WIDTH = 100;
  const MIN_HEIGHT = 100;

  const deltaX = useSharedValue(0);
  const deltaY = useSharedValue(0);

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = croperCornerX.value;
      context.startY = croperCornerY.value;
    },
    onActive: (event, context) => {
      croperCornerX.value = context.startX + event.translationX;
      croperCornerY.value = context.startY + event.translationY;
    },
    onFinish: (event, context) => {
      tempX.value = tempX.value + event.translationX;
      tempY.value = tempY.value + event.translationY;
    },
  });

  const onResizeGestureEvent = (corner) => {
    return useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startWidth = croperWidth.value;
        context.startHeight = croperHeight.value;
      },
      onActive: (event, context) => {
        if (corner === "bottomRight") {
          croperWidth.value = context.startWidth + event.translationX;
          croperHeight.value = context.startHeight + event.translationY;
        } else if (corner === "bottomLeft") {
          croperWidth.value = context.startWidth - event.translationX;
          croperHeight.value = context.startHeight + event.translationY;
        } else if (corner === "topRight") {
          croperWidth.value = context.startWidth + event.translationX;
          croperHeight.value = context.startHeight - event.translationY;
        } else if (corner === "topLeft") {
          croperWidth.value = context.startWidth - event.translationX;
          croperHeight.value = context.startHeight - event.translationY;
        }

        croperWidth.value = Math.max(
          MIN_WIDTH,
          Math.min(croperWidth.value, imageFixedWidth)
        );
        croperHeight.value = Math.max(
          MIN_HEIGHT,
          Math.min(croperHeight.value, imageFixedHeight)
        );
      },
      onFinish: (event, context) => {
        deltaX.value = context.startWidth - croperWidth.value;
        deltaY.value = context.startHeight - croperHeight.value;

        tempX.value = tempX.value + deltaX.value / 2;
        tempY.value = tempY.value + deltaY.value / 2;

        deltaX.value = 0;
        deltaY.value = 0;
      },
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: croperCornerX.value },
        { translateY: croperCornerY.value },
      ],
      width: croperWidth.value,
      height: croperHeight.value,
    };
  });

  const handleStyle = (corner) => {
    return {
      position: "absolute",
      width: 20,
      height: 20,
      backgroundColor: "white",
      ...(corner === "bottomRight" && { bottom: -10, right: -10 }),
      ...(corner === "bottomLeft" && { bottom: -10, left: -10 }),
      ...(corner === "topRight" && { top: -10, right: -10 }),
      ...(corner === "topLeft" && { top: -10, left: -10 }),
    };
  };

  const handleImageCrop = async () => {
    try {
      let res = await cropImage(
        actualImage ? actualImage.uri : image.uri,
        tempX.value,
        tempY.value,
        croperWidth.value,
        croperHeight.value,
        descaleFactor
      );
      setActualImage(res);
      setIsCroping(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateImageStyles = (
    containerWidth,
    containerHeight,
    imageWidth,
    imageHeight
  ) => {
    if (imageWidth > imageHeight) {
      setImageFixedHeight(containerWidth * (imageHeight / imageWidth));
      setImageFixedWidth(containerWidth);
      setDescaleFactor(imageWidth / containerWidth);
      croperHeight.value = containerWidth * (imageHeight / imageWidth);
      croperWidth.value = containerWidth;
    } else {
      setImageFixedHeight(containerHeight);
      setImageFixedWidth(containerHeight * (imageWidth / imageHeight));
      setDescaleFactor(imageHeight / containerHeight);
      croperHeight.value = containerHeight;
      croperWidth.value = containerHeight * (imageWidth / imageHeight);
    }
    croperCornerX.value = 0;
    croperCornerY.value = 0;
    tempX.value = 0;
    tempY.value = 0;
  };

  useEffect(() => {
    if (actualImage && containerHeight && containerWidth) {
      updateImageStyles(
        containerWidth,
        containerHeight,
        actualImage.width,
        actualImage.height
      );
    }
  }, [actualImage, containerHeight]);

  // Ratate Tool
  const [isRotating, setIsRotating] = useState(false);

  const rotation = useSharedValue(0);

  const resetRotation = () => {
    rotation.value = 0;
  };

  const handeleRotateImage = () => {
    rotation.value = withTiming(rotation.value + 90, {
      duration: 75,
      easing: Easing.linear,
    });
  };

  const handleRotateImageConfirm = async () => {
    console.log("Aqui", rotation.value);
    let result = await rotateImage(
      actualImage ? actualImage.uri : image.uri,
      rotation.value
    );
    rotation.value = 0;
    setActualImage(result);
    setIsRotating(false);
  };

  const animatedRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: "5%",
        }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity style={{ marginLeft: "20%" }} onPress={onCancel}>
            <Icon
              name="arrow-left-thin-circle-outline"
              color="white"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            gap: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsRotating(!isRotating);
              rotation.value = 0;
            }}
            disabled={isCroping}
          >
            <Icon
              name="rotate-left"
              color={isRotating ? "#1D76F5" : "white"}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsCroping(!isCroping)}
            style={{ marginRight: 15 }}
            disabled={isRotating}
          >
            <Icon
              name="crop"
              color={isCroping ? "#1D76F5" : "white"}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
      <GestureHandlerRootView
        style={{ flex: 10, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            height: "85%",
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          onLayout={(event) => {
            let { width, height } = event.nativeEvent.layout;
            setContainerHeight(height);
            setContainerWidth(width);
            updateImageStyles(width, height, image.width, image.height);
          }}
        >
          <Animated.Image
            source={{ uri: actualImage ? actualImage.uri : image.uri }}
            style={[
              {
                width: imageFixedWidth,
                height: imageFixedHeight,
              },
              animatedRotateStyle,
            ]}
          />

          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            ref={panRef}
            enabled={isCroping}
          >
            <Animated.View
              style={[
                {
                  position: "relative",
                  backgroundColor: "transparent",
                  opacity: isCroping ? 1 : 0,
                  position: "absolute",
                  borderColor: "#FBFDFF",
                  borderWidth: 2,
                  zIndex: 2,
                },
                animatedStyle,
              ]}
            >
              <PanGestureHandler
                onGestureEvent={onResizeGestureEvent("bottomRight")}
              >
                <Animated.View style={handleStyle("bottomRight")} />
              </PanGestureHandler>
              <PanGestureHandler
                onGestureEvent={onResizeGestureEvent("bottomLeft")}
              >
                <Animated.View style={handleStyle("bottomLeft")} />
              </PanGestureHandler>
              <PanGestureHandler
                onGestureEvent={onResizeGestureEvent("topRight")}
              >
                <Animated.View style={handleStyle("topRight")} />
              </PanGestureHandler>
              <PanGestureHandler
                onGestureEvent={onResizeGestureEvent("topLeft")}
              >
                <Animated.View style={handleStyle("topLeft")} />
              </PanGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </GestureHandlerRootView>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginBottom: "5%",
        }}
      >
        {isCroping && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 30,
            }}
          >
            <TouchableOpacity onPress={handleImageCrop}>
              <Icon name="content-cut" color="white" size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditedImage(null)}>
              <Text style={{ color: "white", fontSize: 20 }}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
        {isRotating && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 30,
            }}
          >
            <TouchableOpacity onPress={handeleRotateImage}>
              <Icon name="rotate-left-variant" color="white" size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={resetRotation}>
              <Text style={{ color: "white", fontSize: 20 }}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRotateImageConfirm}
              style={{ marginLeft: 10 }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Listo</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isRotating && !isCroping && (
          <View
            style={{
              flex: 3,
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "row",
              gap: 15,
              marginRight: "5%",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#1D76F5",
                padding: "4%",
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
              onPress={() => {
                console.log(imageFixedWidth, imageFixedHeight);
              }}
            >
              <Icon
                name="arrow-right-thin-circle-outline"
                size={20}
                color="white"
                onPress={() => onComplete(actualImage ? actualImage : image)}
              />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
                Continuar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
