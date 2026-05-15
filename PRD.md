Proje Adı: AI-Social Insights (Final Sürüm)
1. Vizyon ve Proje Özeti
AI-Social Insights, sosyal medya yöneticileri için geliştirilmiş, hibrit yapay zeka (LLM + ML) destekli bir analiz platformudur. Uygulama, karmaşık etkileşim verilerini işleyerek içerik takvimlerini optimize eder ve stratejik kararları veriye dayalı hale getirir.

2. Problem Tanımı
Tahmine Dayalı Stratejiler: İçeriklerin hangi saatte paylaşılacağının veriye değil, alışkanlıklara dayanması.

Veri Okuryazarlığı Zorluğu: CSV/Excel tablolarındaki ham verilerin anlamlı stratejilere dönüştürülememesi.

Raporlama Süreçleri: Analiz sonuçlarının profesyonel ve sunulabilir bir formatta (PDF) paylaşılmasının vakit alması.

3. Kullanım Senaryosu (Use-Case)
Bir içerik üreticisi veya ajans, geçmiş 6 aylık performans verilerini sisteme yükler. Platform, Google Gemini AI kullanarak verileri analiz eder ve şu çıktıyı üretir: "Pazar günü 21:00'da paylaşılan 'Cinematic Edit' videoları, takipçi kitlenizde %40 daha fazla paylaşım alıyor." Kullanıcı bu analizi tek tıkla profesyonel bir PDF raporuna dönüştürerek ekibiyle paylaşır.

4. Uygulanan Çözümler ve Özellikler (Scope)
Akıllı Veri Analizi: Pandas ve Scikit-learn kütüphaneleri ile ham verilerin işlenmesi.

Hibrit Yapay Zeka Mekanizması: Google Gemini API ile doğal dilde tavsiyeler üretilir. API erişimi olmadığında sistem, yerel ML modelleriyle (Graceful Degradation) çalışmaya devam eder.

Profesyonel Dashboard: Recharts ile etkileşim oranlarının görselleştirilmesi.

PDF Rapor Çıktısı: html-to-image ve jsPDF teknolojileriyle analiz sonuçlarının dışa aktarılması.

Cloud Deployment: Kesintisiz erişim için Backend Render.com'da, Frontend Vercel üzerinde canlıya alınmıştır.

5. Teknik Altyapı (Final Tech Stack)
Frontend: React.js (Vite), Tailwind CSS (Modern ve Responsive UI).

Backend: Python 3.10, FastAPI (Yüksek performanslı asenkron API).

Yapay Zeka: Google Gemini Pro v1.5, Scikit-learn (Yedek Analiz Modeli).

Veri İşleme: Pandas, NumPy.

DevOps: GitHub CI/CD, Vercel, Render.