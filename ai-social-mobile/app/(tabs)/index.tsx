import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useReport } from '@/context/ReportContext'; 

// Bildirim Ayarları
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { setAnalizSonucu } = useReport(); 

  // Uygulama açılışında bildirim izni
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log('Bildirim izni reddedildi.');
    })();
  }, []);

  // GERÇEK ANALİZ FONKSİYONU
  const handleAnalyze = async () => {
    // 1. Dokunsal Geri Bildirim (Başlangıç tıkı)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    
    try {
      // Senin IP adresin üzerinden Python sunucusuna bağlanıyoruz
      const response = await fetch("http://10.246.154.91:8000/analyze");
      
      if (!response.ok) throw new Error("Sunucu yanıt vermiyor.");

      // Python'dan gelen gerçek yapay zeka verisi
      const data = await response.json();

      // Verileri hem ekrana hem de global depoya (Paylaşım sayfası için) yazıyoruz
      setResult(data);
      setAnalizSonucu(data); 
      
      // Başarılı titreşimi
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (error) {
      console.error(error);
      Alert.alert(
        "Bağlantı Hatası", 
        "Python sunucusuna ulaşılamadı. 'uvicorn --host 0.0.0.0' komutuyla başlattığından emin ol."
      );
    } finally {
      setLoading(false); 
    }
  };

  const scheduleReminder = async (saat: number) => {
    Haptics.selectionAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Altın Saat Geldi!",
        body: `Analizimize göre içerik paylaşmak için en iyi vakit! (Saat: ${saat}:00)`,
      },
      trigger: { 
        seconds: 5,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
      }, 
    });
    Alert.alert("Hatırlatıcı Kuruldu!", `Saat ${saat}:00 için bildirim ayarlandı. ✨`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AI-Social Insights</Text>
      <Text style={styles.subtitle}>İçerik verilerini yükle, yapay zeka algoritma sırlarını çözsün.</Text>

      <View style={styles.card}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleAnalyze} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>VERİLERİ ANALİZ ET</Text>}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.card, styles.successCard]}>
          <Text style={styles.resultTitle}>📊 Analiz Sonuçları</Text>
          
          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>💡 Algoritma İçgörüsü:</Text>
            <Text style={styles.insightText}>{result.ai_tavsiyesi}</Text>
          </View>

          <Text style={styles.subHeading}>⭐ Altın Saatler (Hatırlatıcı kurmak için tıkla)</Text>
          <View style={styles.badgesContainer}>
            {result.altin_saatler.map((saat: number, index: number) => (
              <TouchableOpacity key={index} onPress={() => scheduleReminder(saat)} style={styles.badge}>
                <Text style={styles.badgeText}>{saat}:00 🔔</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subHeading}>📈 İçerik Performansı</Text>
          {Object.entries(result.icerik_basarisi).map(([isim, deger], i) => (
             <View key={i} style={styles.barItem}>
                <Text style={styles.barLabel}>{isim}</Text>
                <Text style={styles.barValue}>{String(deger)}</Text>
             </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24, paddingTop: 60 },
  title: { color: '#d0deec', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#7f8c8d', fontSize: 16, marginBottom: 30 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, marginBottom: 20, elevation: 4 },
  successCard: { backgroundColor: '#ecf0f1', borderLeftWidth: 6, borderLeftColor: '#2aaf8c' },
  button: { backgroundColor: '#2c3e50', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#bdc3c7' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: '#4189e2', marginBottom: 15 },
  insightBox: { backgroundColor: '#fffbe6', padding: 15, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#f39c12', marginBottom: 15 },
  insightTitle: { fontWeight: 'bold', color: '#d35400', marginBottom: 5 },
  insightText: { color: '#333', lineHeight: 20 },
  subHeading: { fontSize: 18, fontWeight: 'bold', color: '#2aaf8c', marginTop: 20, marginBottom: 10 },
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { backgroundColor: '#2aaf8c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  badgeText: { color: 'white', fontWeight: 'bold' },
  barItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8 },
  barLabel: { color: '#34495e', fontWeight: '500' },
  barValue: { color: '#4189e2', fontWeight: 'bold' }
});