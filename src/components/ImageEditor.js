import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { cropImage } from "../services/imageEditorService";

export default function ImageEditor({ image, onCancel }) {
  // Crop square tool
  const [isCroping, setIsCroping] = useState(false);

  const [cropedImage, setCropedImage] = useState(null);

  const [imageFixedWidth, setImageFixedWidth] = useState(0);
  const [imageFixedHeight, setImageFixedHeight] = useState(0);

  const [descaleFactor, setDescaleFactor] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const croperWidth = useSharedValue(100);
  const croperHeight = useSharedValue(100);

  const croperCornerX = useSharedValue(0);
  const croperCornerY = useSharedValue(0);

  const panRef = useRef(null);

  const MIN_WIDTH = 100;
  const MIN_HEIGHT = 100;

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onFinish: (event, context) => {
      croperCornerX.value = croperCornerX.value + event.translationX;
      croperCornerY.value = croperCornerY.value + event.translationY;
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
        if (corner === "bottomRight") {
          croperCornerX.value = croperCornerX.value - event.translationX / 2;
          croperCornerY.value = croperCornerY.value - event.translationY / 2;
        } else if (corner === "bottomLeft") {
          croperCornerX.value = croperCornerX.value + event.translationX / 2;
          croperCornerY.value = croperCornerY.value - event.translationY / 2;
        } else if (corner === "topRight") {
          croperCornerX.value = croperCornerX.value - event.translationX / 2;
          croperCornerY.value = croperCornerY.value + event.translationY / 2;
        } else if (corner === "topLeft") {
          croperCornerX.value = croperCornerX.value + event.translationX / 2;
          croperCornerY.value = croperCornerY.value + event.translationY / 2;
        }
      },
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
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
        image.uri,
        croperCornerX.value,
        croperCornerY.value,
        croperWidth.value,
        croperHeight.value,
        descaleFactor
      );
      setCropedImage(res);
      console.log("Resultado : ", res);
    } catch (err) {
      console.log(err);
    }
  };

  // Ratate Tool
  const [isRotating, setIsRotating] = useState(false);

  const rotation = useSharedValue(0);

  const resetRotation = () => {
    rotation.value = 0;
  };

  const rotateImage = () => {
    rotation.value = withTiming(rotation.value + 90, {
      duration: 75,
      easing: Easing.linear,
    });
  };

  const animatedRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  //Image display
  const [containerHeight, setContainerHeight] = useState(null);

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
            onPress={() => setIsRotating(!isRotating)}
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
      <GestureHandlerRootView style={{ flex: 10, justifyContent: "center" }}>
        <View
          style={{
            height: "85%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          onLayout={(event) => {
            let { height } = event.nativeEvent.layout;
            setContainerHeight(height);
            setImageFixedHeight(height);
            setImageFixedWidth(height * (image.width / image.height));
            setDescaleFactor(image.height / height);
            croperHeight.value = height;
            croperWidth.value = height * (image.width / image.height);
          }}
        >
          <Animated.Image
            source={{ uri: cropedImage ? cropedImage.uri : image.uri }}
            style={[
              {
                width: containerHeight * (image.width / image.height),
                height: containerHeight,
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
                  borderColor: "#CEF1FF",
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
              <Text style={{ color: "white", fontSize: 20 }}>Crop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCropedImage(null)}>
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
            <TouchableOpacity onPress={rotateImage}>
              <Icon name="rotate-left-variant" color="white" size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={resetRotation}>
              <Text style={{ color: "white", fontSize: 20 }}>Reset</Text>
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
