

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   Platform,
//   StatusBar,
//   ActivityIndicator,
// } from 'react-native';
// import { Link, router } from 'expo-router';
// import { Mail, Lock, User as UserIcon, CheckCircle, AlertCircle } from 'lucide-react-native';
// import { useAuth } from '@/contexts/AuthContext';

// // This is the self-contained notification component
// const Notification = ({ message, type }) => {
//   if (!message) return null;
//   const isSuccess = type === 'success';
//   const containerStyle = {
//     backgroundColor: isSuccess ? '#ecfdf5' : '#fffbeb',
//     borderColor: isSuccess ? '#10b981' : '#f59e0b',
//   };
//   const textStyle = { color: isSuccess ? '#047857' : '#b45309' };
//   const Icon = isSuccess ? CheckCircle : AlertCircle;

//   return (
//     <View style={[styles.notificationContainer, containerStyle]}>
//       <Icon color={textStyle.color} size={20} />
//       <Text style={[styles.notificationText, textStyle]}>{message}</Text>
//     </View>
//   );
// };

// export default function RegisterScreen() {
//   const { signUp } = useAuth();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

//   // --- 1. STATE FOR FOCUS TRACKING (ONE FOR EACH INPUT) ---
//   const [isNameFocused, setIsNameFocused] = useState(false);
//   const [isEmailFocused, setIsEmailFocused] = useState(false);
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false);
//   const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

//   useEffect(() => {
//     if (notification.message) {
//       const timer = setTimeout(() => {
//         setNotification({ message: '', type: '' });
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const handleRegister = async () => {
//     if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
//       setNotification({ message: 'Please fill in all fields.', type: 'error' });
//       return;
//     }
//     if (password !== confirmPassword) {
//       setNotification({ message: 'Passwords do not match.', type: 'error' });
//       return;
//     }
//     if (password.length < 6) {
//       setNotification({ message: 'Password must be at least 6 characters.', type: 'error' });
//       return;
//     }

//     setIsLoading(true);
//     const { error } = await signUp(email.trim(), password, name.trim());
//     setIsLoading(false);

//     if (error) {
//       setNotification({ message: error.message, type: 'error' });
//     } else {
//       setNotification({ message: 'Account created! Please check your email to verify.', type: 'success' });
//       setTimeout(() => {
//         router.replace('/(auth)/verify'); // Send to verify page
//       }, 2000);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Notification message={notification.message} type={notification.type} />
      
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Create Account</Text>
//           <Text style={styles.subtitle}>Join the prayer community</Text>
//         </View>

//         <View style={styles.form}>
//           {/* --- 2. UPDATED INPUTS WITH FOCUS STYLING --- */}
//           <View style={[styles.inputContainer, isNameFocused && styles.inputContainerFocused]}>
//             <UserIcon size={20} color={isNameFocused ? '#059669' : '#6b7280'} />
//             <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} onFocus={() => setIsNameFocused(true)} onBlur={() => setIsNameFocused(false)}/>
//           </View>

//           <View style={[styles.inputContainer, isEmailFocused && styles.inputContainerFocused]}>
//             <Mail size={20} color={isEmailFocused ? '#059669' : '#6b7280'} />
//             <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" onFocus={() => setIsEmailFocused(true)} onBlur={() => setIsEmailFocused(false)}/>
//           </View>

//           <View style={[styles.inputContainer, isPasswordFocused && styles.inputContainerFocused]}>
//             <Lock size={20} color={isPasswordFocused ? '#059669' : '#6b7280'} />
//             <TextInput style={styles.input} placeholder="Password (min. 6 characters)" value={password} onChangeText={setPassword} secureTextEntry={true} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)}/>
//           </View>

//           <View style={[styles.inputContainer, isConfirmPasswordFocused && styles.inputContainerFocused]}>
//             <Lock size={20} color={isConfirmPasswordFocused ? '#059669' : '#6b7280'} />
//             <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} onFocus={() => setIsConfirmPasswordFocused(true)} onBlur={() => setIsConfirmPasswordFocused(false)}/>
//           </View>

//           <TouchableOpacity
//             style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
//             onPress={handleRegister}
//             disabled={isLoading}
//           >
//             {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.registerButtonText}>Create Account</Text>}
//           </TouchableOpacity>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already have an account? </Text>
//             <Link href="/(auth)/login" asChild>
//               <Text style={styles.linkText}>Sign In</Text>
//             </Link>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
//   content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', },
//   header: { alignItems: 'center', marginBottom: 40, },
//   title: { fontSize: 32, fontFamily: 'Inter-Bold', color: '#1f2937', marginBottom: 8, },
//   subtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#6b7280', textAlign: 'center', },
//   form: { gap: 16, },

//   // --- 3. UPDATED STYLES FOR INPUTS ---
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     gap: 12,
//     borderWidth: 2,
//     borderColor: '#e5e7eb',
//     // @ts-ignore
//     transitionDuration: '300ms',
//   },
//   inputContainerFocused: {
//     borderColor: '#059669',
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 16,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#1f2937',
//     // This is the key change to remove the default browser outline
//     // @ts-ignore
//     outlineStyle: 'none',
//   },
//   // --- END OF UPDATED STYLES ---

//   registerButton: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, },
//   registerButtonDisabled: { backgroundColor: '#9ca3af', },
//   registerButtonText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#ffffff', },
//   footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, },
//   footerText: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#6b7280', },
//   link: { marginLeft: 4, },
//   linkText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#059669', },
//   notificationContainer: { position: 'absolute', top: Platform.OS === 'web' ? 20 : 60, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, zIndex: 9999, gap: 12, },
//   notificationText: { flex: 1, fontSize: 14, fontFamily: 'Inter-SemiBold', },
// });
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
import { Mail, Lock, User as UserIcon, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const CustomAlertModal = ({ visible, title, message, onClose }) => {
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
            <TouchableOpacity style={styles.alertButton} onPress={onClose}>
              <Text style={styles.alertButtonText}>Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
};

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '' });

  // --- 1. ADD STATE TO TRACK FOCUS FOR EACH INPUT ---
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setAlertInfo({ visible: true, title: 'Missing Information', message: 'Please fill in all fields.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAlertInfo({ visible: true, title: 'Invalid Email', message: 'Please enter a valid email format.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlertInfo({ visible: true, title: 'Password Mismatch', message: 'The passwords you entered do not match.' });
      return;
    }
    if (password.length < 6) {
      setAlertInfo({ visible: true, title: 'Password Too Short', message: 'Your password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setIsLoading(false);

    if (error) {
      setAlertInfo({ visible: true, title: 'Registration Failed', message: error.message });
    } else {
      setAlertInfo({ visible: true, title: 'Success!', message: 'Your account has been created successfully.' });
    }
  };
  
  const handleAlertClose = () => {
    if (alertInfo.title === 'Success!') {
      router.replace('/(auth)/login');
    }
    setAlertInfo({ visible: false, title: '', message: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={handleAlertClose}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the prayer community</Text>
        </View>

        <View style={styles.form}>
          {/* --- 2. UPDATE INPUTS TO USE FOCUS STATE --- */}
          <View style={[styles.inputContainer, isNameFocused && styles.inputContainerFocused]}>
            <UserIcon size={20} color={isNameFocused ? '#059669' : '#6b7280'} />
            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} onFocus={() => setIsNameFocused(true)} onBlur={() => setIsNameFocused(false)} />
          </View>

          <View style={[styles.inputContainer, isEmailFocused && styles.inputContainerFocused]}>
            <Mail size={20} color={isEmailFocused ? '#059669' : '#6b7280'} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" onFocus={() => setIsEmailFocused(true)} onBlur={() => setIsEmailFocused(false)} />
          </View>

          <View style={[styles.inputContainer, isPasswordFocused && styles.inputContainerFocused]}>
            <Lock size={20} color={isPasswordFocused ? '#059669' : '#6b7280'} />
            <TextInput style={styles.input} placeholder="Password (min. 6 characters)" value={password} onChangeText={setPassword} secureTextEntry={true} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} />
          </View>

          <View style={[styles.inputContainer, isConfirmPasswordFocused && styles.inputContainerFocused]}>
            <Lock size={20} color={isConfirmPasswordFocused ? '#059669' : '#6b7280'} />
            <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} onFocus={() => setIsConfirmPasswordFocused(true)} onBlur={() => setIsConfirmPasswordFocused(false)} />
          </View>

          <TouchableOpacity style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.registerButtonText}>Create Account</Text>}
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild><Text style={styles.linkText}>Sign In</Text></Link>
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
  
  // --- 3. UPDATED STYLES TO REMOVE BOUNDING BOX ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  inputContainerFocused: {
    borderColor: '#059669', // Green border when focused
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    outlineStyle: 'none', // This removes the blue outline on web
  },
  // --- END OF UPDATED STYLES ---

  registerButton: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, },
  registerButtonDisabled: { backgroundColor: '#9ca3af', },
  registerButtonText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#ffffff', },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, },
  footerText: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#6b7280', },
  linkText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#059669', marginLeft: 4, },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertContainer: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5 },
  alertTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: '#1f2937', marginTop: 16, marginBottom: 8 },
  alertMessage: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  alertButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 12, alignSelf: 'stretch' },
  alertButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter-SemiBold', textAlign: 'center' },
});