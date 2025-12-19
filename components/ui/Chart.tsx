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
        <Card className="p-0 overflow-hidden bg-navy-surface border border-navy-border shadow-card rounded-3xl">
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
                withVerticalLabels={false}
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: '#1a1a3a',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(163, 230, 53, ${opacity})`, // Lime green stroke
                    labelColor: (opacity = 1) => `rgba(176, 176, 187, ${opacity})`,
                    style: {
                        borderRadius: 16,
                        paddingRight: 0,
                        paddingLeft: 0,
                    },
                    propsForDots: {
                        r: "0", // No dots
                        strokeWidth: "0",
                        stroke: "#a3e635"
                    },
                    fillShadowGradient: "#a3e635", // Lime green gradient fill
                    fillShadowGradientOpacity: 0.2,
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
