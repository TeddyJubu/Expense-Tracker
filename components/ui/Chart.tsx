import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from './Card';
import { Typography } from './Typography';

interface SimpleLineChartProps {
    data: number[];
    labels?: string[];
    width?: number;
    height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
    data,
    labels = [],
    width = Dimensions.get('window').width - 48, // Default padding handling
    height = 180,
}) => {
    if (data.length === 0) return null;

    return (
        <Card className="p-0 overflow-hidden bg-card border border-border shadow-sm rounded-3xl">
            <View className="px-4 pt-4">
                <Typography variant="h3" className="mb-1 text-foreground">Spending Trend</Typography>
                <Typography variant="caption" className="text-muted-foreground">Last 7 Days</Typography>
            </View>

            <LineChart
                data={{
                    labels,
                    datasets: [{ data }],
                }}
                width={width}
                height={height}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                withHorizontalLabels={false}
                withVerticalLabels={true}
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: '#18181b',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(163, 230, 53, ${opacity})`, // Lime accent
                    labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
                    style: {
                        borderRadius: 16,
                        paddingRight: 0,
                        paddingLeft: 0,
                    },
                    propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: "#a3e635"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    paddingRight: 0,
                }}
            />
        </Card>
    );
};
