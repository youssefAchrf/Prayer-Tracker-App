
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Modal 
} from 'react-native';
import { Link, router } from 'expo-router';
import { Mail, Lock, CheckCircle, AlertTriangle } from 'lucide-react-native'; 
import { useAuth } from '@/contexts/AuthContext';

// CustomAlertModal component - Modified to conditionally show the button
const CustomAlertModal = ({ visible, title, message, onClose, showAcknowledgeButton = true }) => { // Added showAcknowledgeButton prop with default
    if (!visible) return null;
    const isSuccess = title === 'Success!';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;
    const iconColor = isSuccess ? '#059669' : '#f59e0b';
    
    return (
      <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertContainer}>
            <Icon size={48} color={iconColor} />
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>
            {/* Conditionally render the Acknowledge button */}
            {showAcknowledgeButton && (
              <TouchableOpacity style={styles.alertButton} onPress={onClose}>
                <Text style={styles.alertButtonText}>Acknowledge</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '' });

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setAlertInfo({ visible: true, title: 'Missing Information', message: 'Please enter both email and password.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setAlertInfo({ visible: true, title: 'Invalid Email Format', message: 'Please enter a valid email address.' });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(trimmedEmail, trimmedPassword);
    setIsLoading(false);

    if (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorTitle = "Login Failed";

      if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Incorrect email or password. Please check your credentials.";
          errorTitle = "Authentication Failed";
      } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email address before logging in. Check your inbox for the verification link.";
          errorTitle = "Email Not Confirmed";
      } else if (error.message.includes("Network request failed")) {
          errorMessage = "Network error. Please check your internet connection.";
          errorTitle = "Connection Failed";
      }

      setAlertInfo({ visible: true, title: errorTitle, message: errorMessage });
    } else {
      // On SUCCESS: Show the alert, then redirect after a delay
      setAlertInfo({ visible: true, title: 'Success!', message: 'You have been logged in successfully.' });
      
      // Redirect instantly (after a short visual delay)
      setTimeout(() => {
        setAlertInfo({ visible: false, title: '', message: '' }); // Dismiss alert
        router.replace('/(tabs)'); // Redirect to home page
      }, 1500); // 1.5 second delay to let user read the success message
    }
  };

  const handleAlertClose = () => {
    // This function will primarily be called for error messages (when the Acknowledge button is present).
    // Success redirection is handled by the setTimeout in handleLogin, so no redirection here for success.
    setAlertInfo({ visible: false, title: '', message: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={handleAlertClose}
        // Hide the Acknowledge button if it's a success message
        showAcknowledgeButton={alertInfo.title !== 'Success!'} 
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your prayer journey</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, isEmailFocused && styles.inputContainerFocused]}>
            <Mail size={20} color={isEmailFocused ? '#059669' : '#6b7280'} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={[styles.inputContainer, isPasswordFocused && styles.inputContainerFocused]}>
            <Lock size={20} color={isPasswordFocused ? '#059669' : '#6b7280'} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <Text style={styles.linkText}>Sign Up</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', },
  header: { alignItems: 'center', marginBottom: 40, },
  title: { fontSize: 32, fontFamily: 'Inter-Bold', color: '#1f2937', marginBottom: 8, },
  subtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#6b7280', textAlign: 'center', },
  form: { gap: 16, },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    // @ts-ignore
    transitionDuration: '300ms', 
  },
  inputContainerFocused: {
    borderColor: '#059669', 
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    // @ts-ignore
    outlineStyle: 'none', 
  },

  loginButton: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, },
  loginButtonDisabled: { backgroundColor: '#9ca3af', },
  loginButtonText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#ffffff', },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, },
  footerText: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#6b7280', },
  linkText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#059669', marginLeft: 4, },

  // Styles for the CustomAlertModal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertContainer: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  alertTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: '#1f2937', marginTop: 16, marginBottom: 8 },
  alertMessage: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  alertButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 12, alignSelf: 'stretch' },
  alertButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter-SemiBold', textAlign: 'center' },
});