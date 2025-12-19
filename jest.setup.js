import 'react-native-gesture-handler/jestSetup';

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
}));

// Mock Vector Icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props) => <View {...props} testID="icon" />,
  };
});

// Mock Chart Kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: () => null,
}));