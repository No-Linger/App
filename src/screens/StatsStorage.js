import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LottieAnimation } from "../components";

export default function StatsData({
  dataByDate,
  toggleOpen,
  dateOpen,
  toggleDateOpen,
}) {
  return (
    <ScrollView>
      <View
        style={{ margin: 0, padding: 10, overflow: "hidden", borderRadius: 15 }}
      >
        {Object.keys(dataByDate).length > 0 ? (
          <View style={{ marginTop: 10 }}>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ fontSize: 25, fontWeight: "600" }}>Historial</Text>
            </View>
            {Object.keys(dataByDate).map((date) => (
              <View
                key={date}
                style={{
                  margin: -2,
                  padding: 10,
                  borderColor: "#4B6CFE",
                  borderWidth: 2,
                  borderRadius: 15,
                }}
              >
                <TouchableOpacity onPress={() => toggleDateOpen(date)}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      padding: 2,
                      textAlign: "left",
                    }}
                  >{`Fecha: ${date}`}</Text>
                </TouchableOpacity>
                {dateOpen[date] && (
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      marginLeft: 5,
                      overflow: "hidden",
                      borderRadius: 10,
                    }}
                  >
                    {dataByDate[date].map((item) => (
                      <View key={item.hora} style={{ marginBottom: 5 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 5,
                            marginTop: 5,
                          }}
                        >
                          <Text>Planograma:</Text>
                          <Text>{item.planograma}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <Text>Hora:</Text>
                          <Text>{item.hora}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>Error:</Text>
                          <Text style={{ color: "red" }}>
                            {item.precision}%
                          </Text>
                        </View>
                        <Text style={{ textAlign: "center" }}>
                          ___________________________
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#4B6CFE",
              borderWidth: 2,
              margin: 5,
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                padding: 20,
                color: "#4B6CFE",
                overflow: "hidden",
                borderRadius: 15,
                fontWeight: "600",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Tu bitácora está vacía.
            </Text>
            <LottieAnimation
              source={require("../../assets/lotties/contentLoading.json")}
              width={60}
              height={80}
              style={{ marginBottom: 30 }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
