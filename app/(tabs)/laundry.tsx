import React, { useState } from "react";
import { Image, StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import Machine from "@/components/machineBox";
import { Ionicons } from "@expo/vector-icons";
export default function LaundryScreen() {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>

            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor:'#cccccc', height: 56, paddingHorizontal: 20, backgroundColor: '#f8f8f8', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ width: 30, height: 30 }} />
                <Text style={{ fontSize: 20, fontWeight: 'semibold', fontFamily: 'helvetica' }}>
                    Laundry Room
                </Text>
                <TouchableOpacity> 
                    <Ionicons name="settings-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={{ padding: 16, backgroundColor: '#f8f8f8' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'helvetica' }}>

                    Washer
                </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, justifyContent: 'space-evenly' }}>


                <View style={styles.machineWrapperLeft}>
                    {/* Machine 컴포넌트 사용 */}
                    <Machine type="washer" id={1} />
                </View>

                <View style={styles.machineWrapperRight}>
                    {/* Machine 컴포넌트 사용 */}
                    <Machine type="washer" id={2} />
                </View>

            </View>

            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'helvetica' }}>

                    Dryer
                </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, justifyContent: 'space-evenly' }}>

                <View style={styles.machineWrapperLeft}>
                    {/* Machine 컴포넌트 사용 */}
                    <Machine type="dryer" id={1} />
                </View>

                <View style={styles.machineWrapperRight}>
                    {/* Machine 컴포넌트 사용 */}
                    <Machine type="dryer" id={2} />
                </View>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    touchable: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12, // 둥근 모서리 추가
    },
    machineText: {
        fontWeight: 'bold'
    },
    timeText: {
        color: 'red'
    },
    machineRow: {
        flexDirection: 'row',
        paddingHorizontal: 16, // 좌우 패딩
        paddingBottom: 16, // 행 아래 패딩
        // justifyContent: 'space-evenly', // space-evenly 대신 flex와 margin으로 조절
    },
    // 각 Machine 컴포넌트를 감싸는 View 스타일
    machineWrapperLeft: {
        flex: 1, // 사용 가능한 공간을 차지
        marginRight: 8, // 오른쪽 간격
    },
    machineWrapperRight: {
        flex: 1, // 사용 가능한 공간을 차지
        marginLeft: 8, // 왼쪽 간격
    },
})