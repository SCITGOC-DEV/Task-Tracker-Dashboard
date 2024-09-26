import React from 'react';
import { View, Text } from 'react-native';

const pieData = [
    { label: 'Completed', value: 40, color: '#FF6384' },
    { label: 'In Progress', value: 30, color: '#36A2EB' },
    { label: 'Pending', value: 30, color: '#FFCE56' },
];

const CustomPieChart = () => {
    const totalValue = pieData.reduce((total, item) => total + item.value, 0);

    return (
        <View className="p-4 bg-white rounded-lg shadow-md m-4">
            <Text className="text-xl font-bold text-gray-800 mb-4">Task Status Distribution</Text>
            <View className="relative items-center justify-center w-48 h-48 rounded-full overflow-hidden mx-auto">
                {pieData.map((item, index) => {
                    const sliceStyle = {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderTopLeftRadius: 100,
                        borderTopRightRadius: 100,
                        backgroundColor: item.color,
                        transform: [
                            { rotate: `${(index / pieData.length) * 360}deg` },
                            { translateY: 0 },
                        ],
                    };
                    return <View key={index} style={sliceStyle} />;
                })}
            </View>
            <View className="mt-4">
                {pieData.map((item, index) => (
                    <View key={index} className="flex-row items-center mb-2">
                        <View style={{ backgroundColor: item.color }} className="w-4 h-4 mr-2" />
                        <Text className="text-gray-800">{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default CustomPieChart;
