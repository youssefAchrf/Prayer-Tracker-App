import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the colors for both themes
const darkColors = {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AFAFAF',
    border: '#333333',
    primary: '#059669',
    buttonDisabled: '#333333',
};

const lightColors = {
    background: '#f9fafb',
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#059669',
    buttonDisabled: '#f3f4f6',
};

// Define the shape of the context
interface ThemeContextType {
    theme: 'light' | 'dark';
    colors: typeof lightColors;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme || 'dark');

    // Load saved theme from storage
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme') as 'light' | 'dark' | null;
            if (savedTheme) {
                setTheme(savedTheme);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };
    
    // Select the color palette based on the current theme
    const colors = useMemo(() => {
        return theme === 'light' ? lightColors : darkColors;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use the theme context easily
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}