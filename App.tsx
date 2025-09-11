import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  FlatList,
  Switch
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Issue {
  id: number;
  text: string;
  date: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Language translations
  const translations = {
    English: {
      welcome: 'Welcome to your medical app',
      getStarted: 'Get Started',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      back: '← Back',
      dashboard: '🏥 Medical Dashboard',
      submitIssue: 'Submit Medical Issue',
      describeIssue: 'Describe your medical issue...',
      submit: 'Submit Issue',
      recentIssues: 'Recent Issues',
      noIssues: 'No issues submitted yet',
      events: 'Events',
      reports: 'Reports',
      issues: 'Issues',
      video: 'Video',
      settings: 'Settings',
      home: 'Home',
      medicalReports: '📋 Medical Reports',
      myIssues: '📝 My Issues',
      submitNewIssue: 'Submit New Issue',
      videoCall: '📞 Video Call',
      connectDoctor: 'Connect with Doctor',
      startConsultation: 'Start a video consultation',
      startVideoCall: 'Start Video Call',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      switchTheme: 'Switch between dark and light theme',
      language: 'Language',
      account: 'Account',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      privacySettings: 'Privacy Settings',
      logout: 'Logout',
      about: 'About',
      appVersion: 'App Version',
      helpSupport: 'Help & Support',
    },
    Hindi: {
      welcome: 'आपके मेडिकल ऐप में आपका स्वागत है',
      getStarted: 'शुरू करें',
      login: 'लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      back: '← वापस',
      dashboard: '🏥 मेडिकल डैशबोर्ड',
      submitIssue: 'मेडिकल समस्या जमा करें',
      describeIssue: 'अपनी मेडिकल समस्या का वर्णन करें...',
      submit: 'समस्या जमा करें',
      recentIssues: 'हाल की समस्याएं',
      noIssues: 'अभी तक कोई समस्या जमा नहीं की गई',
      events: 'इवेंट्स',
      reports: 'रिपोर्ट्स',
      issues: 'समस्याएं',
      video: 'वीडियो',
      settings: 'सेटिंग्स',
      home: 'होम',
      medicalReports: '📋 मेडिकल रिपोर्ट्स',
      myIssues: '📝 मेरी समस्याएं',
      submitNewIssue: 'नई समस्या जमा करें',
      videoCall: '📞 वीडियो कॉल',
      connectDoctor: 'डॉक्टर से जुड़ें',
      startConsultation: 'वीडियो परामर्श शुरू करें',
      startVideoCall: 'वीडियो कॉल शुरू करें',
      appearance: 'दिखावट',
      darkMode: 'डार्क मोड',
      switchTheme: 'डार्क और लाइट थीम के बीच स्विच करें',
      language: 'भाषा',
      account: 'खाता',
      editProfile: 'प्रोफाइल संपादित करें',
      changePassword: 'पासवर्ड बदलें',
      privacySettings: 'गोपनीयता सेटिंग्स',
      logout: 'लॉगआउट',
      about: 'के बारे में',
      appVersion: 'ऐप संस्करण',
      helpSupport: 'सहायता और समर्थन',
    },
    Punjabi: {
      welcome: 'ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਐਪ ਵਿੱਚ ਸਵਾਗਤ ਹੈ',
      getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
      login: 'ਲੌਗਇਨ',
      email: 'ਈਮੇਲ',
      password: 'ਪਾਸਵਰਡ',
      back: '← ਵਾਪਸ',
      dashboard: '🏥 ਮੈਡੀਕਲ ਡੈਸ਼ਬੋਰਡ',
      submitIssue: 'ਮੈਡੀਕਲ ਸਮਸਿਆ ਜਮ੍ਹਾ ਕਰੋ',
      describeIssue: 'ਆਪਣੀ ਮੈਡੀਕਲ ਸਮਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ...',
      submit: 'ਸਮਸਿਆ ਜਮ੍ਹਾ ਕਰੋ',
      recentIssues: 'ਹਾਲੀਆ ਸਮਸਿਆਵਾਂ',
      noIssues: 'ਹਾਲੇ ਤੱਕ ਕੋਈ ਸਮਸਿਆ ਜਮ੍ਹਾ ਨਹੀਂ ਕੀਤੀ ਗਈ',
      events: 'ਇਵੈਂਟਸ',
      reports: 'ਰਿਪੋਰਟਸ',
      issues: 'ਸਮਸਿਆਵਾਂ',
      video: 'ਵੀਡੀਓ',
      settings: 'ਸੈਟਿੰਗਸ',
      home: 'ਹੋਮ',
      medicalReports: '📋 ਮੈਡੀਕਲ ਰਿਪੋਰਟਸ',
      myIssues: '📝 ਮੇਰੀਆਂ ਸਮਸਿਆਵਾਂ',
      submitNewIssue: 'ਨਵੀਂ ਸਮਸਿਆ ਜਮ੍ਹਾ ਕਰੋ',
      videoCall: '📞 ਵੀਡੀਓ ਕਾਲ',
      connectDoctor: 'ਡਾਕਟਰ ਨਾਲ ਜੁੜੋ',
      startConsultation: 'ਵੀਡੀਓ ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ',
      startVideoCall: 'ਵੀਡੀਓ ਕਾਲ ਸ਼ੁਰੂ ਕਰੋ',
      appearance: 'ਦਿੱਖ',
      darkMode: 'ਡਾਰਕ ਮੋਡ',
      switchTheme: 'ਡਾਰਕ ਅਤੇ ਲਾਈਟ ਥੀਮ ਵਿਚਕਾਰ ਸਵਿਚ ਕਰੋ',
      language: 'ਭਾਸ਼ਾ',
      account: 'ਖਾਤਾ',
      editProfile: 'ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ',
      changePassword: 'ਪਾਸਵਰਡ ਬਦਲੋ',
      privacySettings: 'ਗੁਪਤਤਾ ਸੈਟਿੰਗਸ',
      logout: 'ਲੌਗਆਉਟ',
      about: 'ਬਾਰੇ',
      appVersion: 'ਐਪ ਵਰਜਨ',
      helpSupport: 'ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ',
    },
  };

  const t = (key: string) => translations[selectedLanguage as keyof typeof translations]?.[key as keyof typeof translations.English] || key;

  // Screen order for swipe navigation
  const screenOrder = ['dashboard', 'events', 'reports', 'issues', 'video', 'settings'];
  
  const handleSwipeLeft = () => {
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex < screenOrder.length - 1) {
      setCurrentScreen(screenOrder[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex > 0) {
      setCurrentScreen(screenOrder[currentIndex - 1]);
    }
  };

  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        handleSwipeRight();
      } else if (translationX < -50) {
        handleSwipeLeft();
      }
    }
  };
  const [events] = useState<Event[]>([
    { id: '1', title: 'Health Camp - City Center', date: '2025-09-22', time: '9:00 AM' },
    { id: '2', title: 'Free Checkup - Community Hall', date: '2025-10-01', time: '10:00 AM' },
    { id: '3', title: 'Vaccination Drive', date: '2025-10-15', time: '8:00 AM' },
  ]);
  const [reports] = useState<Report[]>([
    { id: '1', name: 'Blood Test Report', date: '2025-09-15', type: 'PDF' },
    { id: '2', name: 'X-Ray Results', date: '2025-09-10', type: 'Image' },
    { id: '3', name: 'ECG Report', date: '2025-09-05', type: 'PDF' },
  ]);

  const handleLogin = () => {
    if (email && password) {
      setCurrentScreen('dashboard');
      Alert.alert('Success', 'Logged in successfully!');
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  const handleSubmitIssue = () => {
    if (newIssue.trim()) {
      setIssues([...issues, { id: Date.now(), text: newIssue, date: new Date().toLocaleDateString() }]);
      setNewIssue('');
      Alert.alert('Success', 'Issue submitted successfully!');
    }
  };

  const renderBottomNavigation = () => (
    <View style={[styles.bottomNavigation, isDarkMode ? styles.darkNav : styles.lightNav]}>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'dashboard' && styles.activeNavButton]} 
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={[styles.navIcon, currentScreen === 'dashboard' && styles.activeNavIcon]}>🏠</Text>
        <Text style={[styles.navLabel, currentScreen === 'dashboard' && styles.activeNavLabel]}>{t('home')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'events' && styles.activeNavButton]} 
        onPress={() => setCurrentScreen('events')}
      >
        <Text style={[styles.navIcon, currentScreen === 'events' && styles.activeNavIcon]}>📅</Text>
        <Text style={[styles.navLabel, currentScreen === 'events' && styles.activeNavLabel]}>{t('events')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'reports' && styles.activeNavButton]} 
        onPress={() => setCurrentScreen('reports')}
      >
        <Text style={[styles.navIcon, currentScreen === 'reports' && styles.activeNavIcon]}>📋</Text>
        <Text style={[styles.navLabel, currentScreen === 'reports' && styles.activeNavLabel]}>{t('reports')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'issues' && styles.activeNavButton]} 
        onPress={() => setCurrentScreen('issues')}
      >
        <Text style={[styles.navIcon, currentScreen === 'issues' && styles.activeNavIcon]}>📝</Text>
        <Text style={[styles.navLabel, currentScreen === 'issues' && styles.activeNavLabel]}>{t('issues')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'video' && styles.activeNavButton]} 
        onPress={() => setCurrentScreen('video')}
      >
        <Text style={[styles.navIcon, currentScreen === 'video' && styles.activeNavIcon]}>📞</Text>
        <Text style={[styles.navLabel, currentScreen === 'video' && styles.activeNavLabel]}>{t('video')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'settings' && styles.activeNavButton]} 
        onPress={() => setCurrentScreen('settings')}
      >
        <Text style={[styles.navIcon, currentScreen === 'settings' && styles.activeNavIcon]}>⚙️</Text>
        <Text style={[styles.navLabel, currentScreen === 'settings' && styles.activeNavLabel]}>{t('settings')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWelcomeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Patient App</Text>
      <Text style={styles.subtitle}>{t('welcome')}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('login')}>
        <Text style={styles.buttonText}>{t('getStarted')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t('email')}
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('welcome')}>
          <Text style={styles.linkText}>{t('back')} to Welcome</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDashboard = () => (
    <View style={[styles.screenContainer, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.screenTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          {t('dashboard')}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Issues */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>
            {t('recentIssues')}
          </Text>
          {issues.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                {t('noIssues')}
              </Text>
            </View>
          ) : (
            issues.slice(0, 3).map((issue) => (
              <View key={issue.id} style={[styles.issueCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.issueText, isDarkMode ? styles.darkText : styles.lightText]}>
                  {issue.text}
                </Text>
                <Text style={[styles.issueDate, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                  Submitted: {issue.date}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Video Section */}
        <View style={styles.section}>
          <View style={[styles.videoContainer, { backgroundColor: 'transparent', padding: 0 }]}> 
            <View style={{ width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: isDarkMode ? '#333' : '#d1d5db', backgroundColor: '#000' }}>
              <Video
                source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              />
            </View>
          </View>
        </View>

        {/* Upcoming Events (Preview) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Upcoming Events</Text>
          <View>
            {events.slice(0, 2).map((item) => (
              <View key={item.id} style={[styles.eventCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.eventTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
                <Text style={[styles.eventDate, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                  {item.date} at {item.time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {renderBottomNavigation()}
    </View>
  );

  const renderEventsScreen = () => (
    <View style={[styles.screenContainer, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.screenTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          📅 {t('events')}
        </Text>
      </View>
      
      <FlatList
        data={events.slice(0, 2)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.eventCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.eventTitle, isDarkMode ? styles.darkText : styles.lightText]}>
              {item.title}
            </Text>
            <Text style={[styles.eventDate, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              {item.date} at {item.time}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {renderBottomNavigation()}
    </View>
  );

  const renderReportsScreen = () => (
    <View style={[styles.screenContainer, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.screenTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          {t('medicalReports')}
        </Text>
      </View>
      
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.reportCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.reportName, isDarkMode ? styles.darkText : styles.lightText]}>
              {item.name}
            </Text>
            <Text style={[styles.reportDate, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              {item.date} • {item.type}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {renderBottomNavigation()}
    </View>
  );

  const renderIssuesScreen = () => (
    <View style={[styles.screenContainer, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.screenTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          {t('myIssues')}
        </Text>
      </View>
      
      <View style={[styles.submitSection, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          Submit New Issue
        </Text>
        <TextInput
          style={[styles.textArea, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Describe your medical issue..."
          placeholderTextColor={isDarkMode ? "#666" : "#999"}
          value={newIssue}
          onChangeText={setNewIssue}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmitIssue}>
          <Text style={styles.buttonText}>Submit Issue</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={issues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.issueCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.issueText, isDarkMode ? styles.darkText : styles.lightText]}>
              {item.text}
            </Text>
            <Text style={[styles.issueDate, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              Submitted: {item.date}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              No issues submitted yet
            </Text>
          </View>
        }
      />

      {renderBottomNavigation()}
    </View>
  );

  const renderVideoScreen = () => (
    <View style={[styles.screenContainer, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.screenTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          {t('videoCall')}
        </Text>
      </View>
      
      <View style={styles.videoContainer}>
        <Text style={[styles.videoTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          Connect with Doctor
        </Text>
        <Text style={[styles.videoSubtitle, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
          Start a video consultation
        </Text>
        <TouchableOpacity style={styles.videoButton}>
          <Text style={styles.buttonText}>Start Video Call</Text>
        </TouchableOpacity>
      </View>

      {renderBottomNavigation()}
    </View>
  );

  const renderSettingsScreen = () => (
    <View style={[styles.screenContainer, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
      <View style={[styles.header, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.screenTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          ⚙️ {t('settings')}
        </Text>
      </View>
      
      <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
        {/* Theme Settings */}
        <View style={[styles.settingsSection, isDarkMode ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.settingsTitle, isDarkMode ? styles.darkText : styles.lightText]}>
            {t('appearance')}
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>
                {t('darkMode')}
              </Text>
              <Text style={[styles.settingDescription, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                {t('switchTheme')}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#3b82f6' }}
              thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Language Settings */}
        <View style={[styles.settingsSection, isDarkMode ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.settingsTitle, isDarkMode ? styles.darkText : styles.lightText]}>
            {t('language')}
          </Text>
          
          <View style={styles.languageOptions}>
            {['English', 'Hindi', 'Punjabi'].map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.languageButton,
                  selectedLanguage === language ? styles.selectedLanguage : styles.unselectedLanguage,
                  isDarkMode ? styles.darkLanguageButton : styles.lightLanguageButton
                ]}
                onPress={() => setSelectedLanguage(language)}
              >
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === language 
                      ? styles.selectedLanguageText 
                      : (isDarkMode ? styles.darkText : styles.lightText)
                  ]}
                >
                  {language}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View style={[styles.settingsSection, isDarkMode ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.settingsTitle, isDarkMode ? styles.darkText : styles.lightText]}>
            {t('account')}
          </Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
              {t('editProfile')}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
              {t('changePassword')}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
              {t('privacySettings')}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingButton, styles.logoutSettingButton]} 
            onPress={() => setCurrentScreen('welcome')}
          >
            <Text style={[styles.settingButtonText, styles.logoutText]}>
              {t('logout')}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={[styles.settingsSection, isDarkMode ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.settingsTitle, isDarkMode ? styles.darkText : styles.lightText]}>
            {t('about')}
          </Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
              {t('appVersion')}
            </Text>
            <Text style={[styles.versionText, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              1.0.0
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
              {t('helpSupport')}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderBottomNavigation()}
    </View>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome': return renderWelcomeScreen();
      case 'login': return renderLoginScreen();
      case 'dashboard': return renderDashboard();
      case 'events': return renderEventsScreen();
      case 'reports': return renderReportsScreen();
      case 'issues': return renderIssuesScreen();
      case 'video': return renderVideoScreen();
      case 'settings': return renderSettingsScreen();
      default: return renderWelcomeScreen();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.safeArea, isDarkMode ? styles.darkTheme : styles.lightTheme]}>
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
          <View style={{ flex: 1 }}>
            {renderCurrentScreen()}
          </View>
        </PanGestureHandler>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Theme Styles
  darkTheme: {
    backgroundColor: '#0a0a0a',
  },
  lightTheme: {
    backgroundColor: '#ffffff',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
  },
  darkSubtext: {
    color: '#a1a1aa',
  },
  lightSubtext: {
    color: '#666666',
  },
  darkCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
  },
  lightCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e5e7eb',
  },
  darkInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    color: '#ffffff',
  },
  lightInput: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    color: '#000000',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  lightHeader: {
    backgroundColor: '#f8f9fa',
    borderBottomColor: '#e5e7eb',
  },
  darkNav: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
  },
  lightNav: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingBottom: 80,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  submitSection: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  quickActions: {
    padding: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  activeNavButton: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeNavIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    color: '#9ca3af',
  },
  activeNavLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  eventDate: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  reportCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  reportName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  reportDate: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  issueCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  issueText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
  },
  issueDate: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  videoSubtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 30,
    textAlign: 'center',
  },
  videoButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#a1a1aa',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 16,
  },
  // Settings Styles
  settingsContainer: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedLanguage: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  unselectedLanguage: {
    borderColor: '#d1d5db',
  },
  darkLanguageButton: {
    borderColor: '#333',
  },
  lightLanguageButton: {
    borderColor: '#d1d5db',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLanguageText: {
    color: '#ffffff',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingButtonText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  versionText: {
    fontSize: 14,
  },
  logoutSettingButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});