import React from "react";
import { ScrollView, Text, View, Button, TouchableOpacity } from "react-native";
import { LottieAnimation } from "../components";

export default function DataCapture({
  capture,
  currentDate,
  loading,
  dataByDate,
  handleCapturar,
  clearData,
}) {
  return (
    <ScrollView>
      <Text
        style={{
          marginLeft: 10,
          marginTop: 20,
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 15,
        }}
      >
        ¡Hola! Hoy es: {currentDate}
      </Text>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
            padding: 2,
          }}
        >
          <Text>Cargando ...</Text>
        </View>
      ) : Object.keys(dataByDate).length === 0 ||
        Object.keys(dataByDate)[Object.keys(dataByDate).length - 1] !==
          currentDate ? (
        <View style={{ padding: 15 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#4B6CFE",
              borderWidth: 2,
              overflow: "hidden",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                padding: 10,
                color: "#4B6CFE",
                overflow: "hidden",
                borderRadius: 15,
                fontWeight: 600,
                textAlign: "center",
                fontSize: 22,
              }}
            >
              Aún no has realizado ninguna captura hoy.
            </Text>
            <LottieAnimation
              source={require("../../assets/lotties/NoDataCaptured.json")}
              width={60}
              height={60}
            />
          </View>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              margin: 10,
              padding: 10,
              borderColor: "#4B6CFE",
              borderWidth: 2,
              overflow: "hidden",
              borderRadius: 15,
              justifyContent: "center",
              width: "90%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  marginBottom: -5,
                  fontSize: 20,
                  color: "black",
                }}
              >
                Datos Generados
              </Text>
              <Text style={{ fontWeight: "bold", color: "#4B6CFE" }}>
                ________________________
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                padding: 5,
                fontSize: 17,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: 600 }}>Planograma:</Text>
              <Text style={{ fontSize: 17 }}>{capture.planograma}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: 600 }}>Fecha:</Text>
              <Text style={{ fontSize: 17 }}>{capture.fecha}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: 600 }}>Hora:</Text>
              <Text style={{ fontSize: 17 }}>{capture.hora}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: 600 }}>Precisión:</Text>
              <Text
                style={{ color: "green", fontSize: 17, fontWeight: "bold" }}
              >
                {capture.precision}%
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ justifyContent: "center", alignItems: "center", gap: 16 }}>
        <TouchableOpacity
          onPress={handleCapturar}
          style={{
            padding: 12,
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 12,
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Capturar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearData}
          style={{
            padding: 12,
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 12,
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
