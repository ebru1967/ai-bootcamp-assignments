import { StyleSheet, Text, View, TouchableOpacity, Share, Alert } from 'react-native';
import { useReport } from '@/context/ReportContext'; // 1. Veri deposuna erişim için import

export default function ExploreScreen() {
  // 2. Global depodan analiz sonucunu çekiyoruz
  const { analizSonucu } = useReport();

  // 3. Veri varsa dinamik rapor oluştur, yoksa kullanıcıyı yönlendir
  const analizRaporu = analizSonucu 
    ? `🔥 *AI-Social Insights: İçerik Raporu* 🔥\n\n🎯 Model Güven Skoru: %${(analizSonucu.model_skoru * 100).toFixed(0)}\n⭐ Altın Saatler: ${analizSonucu.altin_saatler.map((s: number) => s + ":00").join(", ")}\n\n💡 *Yapay Zeka Tavsiyesi:* ${analizSonucu.ai_tavsiyesi}`
    : `Henüz bir analiz bulunamadı.\n\nLütfen Ana Sayfa'ya dönüp "Verileri Analiz Et" butonuna tıklayın. ✨`;

  const handleShare = async () => {
    // Analiz yapılmamışsa paylaşımı engelle
    if (!analizSonucu) {
      Alert.alert("Eksik Veri", "Paylaşacak bir analiz raporu yok. Önce analiz yapmalısın!");
      return;
    }

    try {
      await Share.share({
        message: analizRaporu,
        title: 'İçerik Performans Raporu',
      });
    } catch (error: any) {
      Alert.alert("Hata", "Rapor paylaşılırken bir sorun oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ekip Paylaşımı</Text>
      <Text style={styles.subtitle}>
        Yapay zeka analiz sonuçlarını tek tıkla ekibine veya sosyal medya yöneticilerine gönder.
      </Text>

      {/* RAPORU GÖSTEREN KUTU (Veri yoksa farklı stil uyguluyoruz) */}
      <View style={[styles.reportBox, !analizSonucu && styles.reportBoxEmpty]}>
        <Text style={[styles.reportText, !analizSonucu && styles.reportTextEmpty]}>
          {analizRaporu}
        </Text>
      </View>

      {/* PAYLAŞ BUTONU (Veri yoksa butonu etkisiz gösteriyoruz) */}
      <TouchableOpacity 
        style={[styles.button, !analizSonucu && styles.buttonDisabled]} 
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>🚀 RAPORU PAYLAŞ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    color: '#d0deec',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 22,
  },
  reportBox: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4189e2',
  },
  reportBoxEmpty: {
    backgroundColor: '#2c3e50',
    borderLeftColor: '#7f8c8d',
  },
  reportText: {
    color: '#2c3e50',
    fontSize: 15,
    lineHeight: 24,
  },
  reportTextEmpty: {
    color: '#bdc3c7',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4189e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4189e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#34495e',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});