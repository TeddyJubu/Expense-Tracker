import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export function useBiometrics() {
    const [isCompatible, setIsCompatible] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        checkHardware();
    }, []);

    const checkHardware = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsCompatible(compatible);
        if (compatible) {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setIsEnrolled(enrolled);
        }
    };

    const authenticate = async () => {
        if (!isCompatible || !isEnrolled) {
            Alert.alert('Biometrics not available', 'Please enable FaceID or TouchID in your device settings.');
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access Expense Tracker',
            fallbackLabel: 'Enter Passcode',
        });

        return result.success;
    };

    return { isCompatible, isEnrolled, authenticate };
}
