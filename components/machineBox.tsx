// src/components/Machine.tsx (파일 경로 예시)

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// --- 설정값 ---
const WASHER_DURATION_MS = 90 *60 * 1000; // 예시: 10초 세탁 시간
const DRYER_DURATION_MS = 120*60 * 1000;  // 예시: 7초 건조 시간
const UPDATE_INTERVAL_MS = 1000; // 1초마다 업데이트
// -------------

interface MachineProps {
    type: 'washer' | 'dryer';
    id: number;
}

type MachineStatus = 'available' | 'running' | 'finished';

// 남은 시간 포맷 함수
const formatTimeLeft = (endTime: number | null): string | null => {
    if (endTime === null) return null;
    const now = Date.now();
    const remainingMs = Math.max(0, endTime - now);

    if (remainingMs === 0) return "0s left";

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`); // 초는 항상 표시 (0 제외)

    return parts.length > 0 ? parts.join(' ') + ' left' : "0s left";
};

const Machine = ({ type, id }: MachineProps): JSX.Element => {
    const [status, setStatus] = useState<MachineStatus>('available');
    const [endTime, setEndTime] = useState<number | null>(null);
    const [timeLeftDisplay, setTimeLeftDisplay] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const machineName = `${type === 'washer' ? 'Washer' : 'Dryer'} ${id}`; // id 포함
    const iconName = type === 'washer' ? 'water-outline' : 'sunny-outline';

    useEffect(() => {
        const cleanupTimer = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        if (status === 'running' && endTime !== null) {
            cleanupTimer(); // 기존 타이머 정리

            intervalRef.current = setInterval(() => {
                const now = Date.now();
                if (now >= endTime) {
                    // 타이머 종료 로직 수정: cleanupTimer 호출 후 상태 변경
                    cleanupTimer();
                    setStatus('finished');
                    setEndTime(null);
                    setTimeLeftDisplay(null);
                } else {
                    setTimeLeftDisplay(formatTimeLeft(endTime));
                }
            }, UPDATE_INTERVAL_MS);
        } else {
            cleanupTimer(); // running 상태가 아니면 타이머 정리
        }

        return cleanupTimer; // 언마운트 또는 의존성 변경 시 최종 정리
    }, [status, endTime]);

    const handlePress = () => {
        if (status === 'available') {
            // 시작 시 올바른 durationMs 사용하도록 수정
            const durationMs = type === 'washer' ? WASHER_DURATION_MS : DRYER_DURATION_MS;
            const finishTime = Date.now() + durationMs; // 여기 수정됨!

            setStatus('running');
            setEndTime(finishTime);
            setTimeLeftDisplay(formatTimeLeft(finishTime)); // 즉시 업데이트

        } else if (status === 'running') {
            // 실행 중일 때 누르면 중지하고 available로 변경
            setStatus('available');
            setEndTime(null);
            setTimeLeftDisplay(null);
            // cleanupTimer() 호출은 useEffect가 status 변경 감지 후 처리하므로 여기서 중복 호출 불필요 (단, 즉시 멈추려면 clearInterval 필요)
            if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null;


        } else if (status === 'finished') {
            // 완료 상태에서 누르면 available로 초기화
            setStatus('available');
            // endTime, timeLeftDisplay는 이미 null이므로 추가 처리 불필요
        }
    };

    // 상태 텍스트 렌더링 함수 (renderStatusText 오타 수정)
    const renderStatusText = () => {
        switch (status) {
            case 'available':
                return <Text style={styles.availableText}>Available</Text>;
            case 'running':
                // timeLeftDisplay 사용
                return timeLeftDisplay ? <Text style={styles.timeText}>{timeLeftDisplay}</Text> : null;
            case 'finished':
                return <Text style={styles.finishedText}>Finished</Text>;
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.machineButton, styles[status]]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {/* size 오타 수정 */}
            <Ionicons name={iconName} size={24} color="#000" style={styles.icon} />
            <Text style={styles.machineText}>{machineName}</Text>

            {/* 상태/시간 텍스트 렌더링 함수 호출 */}
            {renderStatusText()}

        </TouchableOpacity>
    );
};

// 스타일 (이전과 동일)
const styles = StyleSheet.create({
    machineButton: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'gray',
        // marginBottom 제거: 부모의 paddingBottom으로 간격 조절
        // marginBottom: 16,
        alignItems: 'flex-start',
        // flex: 1은 부모의 View에서 설정
    },
    icon: {
        marginBottom: 16,
    },
    machineText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#000',
        fontFamily: 'helvetica'
    },
    available: {
        backgroundColor: '#F0F8FF',
        borderColor: 'gray',
    },
    running: {
        backgroundColor: '#FFE4E1',
        // borderColor: '#ffeb3b',
    },
    finished: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
    },
    timeText: {
        color: '#F08080',
        fontSize: 14,
        fontWeight: 'bold',
    },
    availableText: {
        color: '#6495ED',
        fontSize: 14,
        fontWeight: 'bold',
    },
    finishedText: {
        color: '#555',
        fontSize: 14,
    }
});

export default Machine;