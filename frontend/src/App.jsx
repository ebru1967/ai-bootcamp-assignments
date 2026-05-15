import { useState, useRef } from 'react'; // useRef eklendi
import AnalyticsChart from './components/features/AnalyticsChart'; 
import jsPDF from 'jspdf'; // PDF kütüphanesi
import { toPng } from 'html-to-image'; // Ekran görüntüsü kütüphanesi

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Raporun fotoğrafını çekmek için bu referansı kullanacağız
  const reportRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Lütfen önce bir CSV dosyası seçin!");
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Canlıdaki Render API adresin
      const response = await fetch("https://ai-social-insights-api.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Sunucu Hatası: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Bağlantı Hatası:", error);
      alert("Analiz başarısız! Lütfen arka plan sunucusunun (Render) ayakta olduğundan emin olun.");
    } finally {
      setLoading(false);
    }
  };

const downloadPDF = async () => {
  console.log("PDF hazırlama işlemi başladı...");
  const element = reportRef.current;

  if (!element) {
    alert("Hata: Rapor alanı bulunamadı.");
    return;
  }

  try {
    // html-to-image ile oklch hatalarından kurtularak fotoğraf çekiyoruz
    const dataUrl = await toPng(element, { 
      quality: 0.95,
      cacheBust: true,
      backgroundColor: '#ffffff', // Arka planın beyaz olmasını garanti ediyoruz
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("AI-Social-Insights-Raporu.pdf");
    
    console.log("PDF başarıyla indirildi!");
  } catch (error) {
    console.error("PDF oluşturulurken bir hata oluştu:", error);
    alert("PDF oluşturulamadı. Lütfen tekrar deneyin.");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 font-sans text-slate-800">
      
      {/* BAŞLIK ALANI */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 tracking-tight">
          AI-Social Insights
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          İçerik verilerini yükle, yapay zeka algoritma sırlarını çözsün.
        </p>
      </div>
      
      {/* UPLOAD KARTI */}
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 w-full max-w-2xl border border-slate-100 mb-8 transition-all hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 cursor-pointer transition-colors"
          />
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200'
            }`}
          >
            {loading ? 'Analiz Ediliyor...' : 'VERİLERİ ANALİZ ET'}
          </button>
        </div>
      </div>

      {/* SONUÇ KARTI VE PDF BUTONU */}
      {result && (
        <div className="w-full max-w-2xl flex flex-col gap-4 animate-fade-in-up">
          
          {/* PDF İNDİR BUTONU */}
          <button 
            onClick={downloadPDF}
            className="self-end flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 hover:shadow-emerald-200"
          >
            📥 Analiz Raporunu PDF İndir
          </button>

          {/* PDF'E DÖNÜŞECEK ALAN (reportRef buraya bağlandı) */}
          <div ref={reportRef} className="bg-white shadow-2xl shadow-indigo-100/40 rounded-3xl p-8 border border-indigo-50 bg-white">
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              📊 Analiz Sonuçları
            </h2>
            
            {/* AI TAVSİYESİ KUTUSU */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl mb-8 shadow-sm">
              <h3 className="text-amber-700 font-bold text-lg mb-2 flex items-center gap-2">
                💡 Algoritma İçgörüsü
              </h3>
              <p className="text-amber-900 leading-relaxed font-medium">
                {result.ai_tavsiyesi}
              </p>
            </div>

            {/* İSTATİSTİKLER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500 font-semibold mb-1">🎯 Modelin Güven Skoru</p>
                <p className="text-3xl font-black text-indigo-600">%{Math.round(result.model_skoru * 100)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500 font-semibold mb-1">🔥 En Yüksek Etkileşim</p>
                <p className="text-3xl font-black text-rose-500">{result.en_iyi_saat_etkilesim_ortalamasi.toLocaleString('tr-TR')}</p>
              </div>
            </div>
            
            {/* ALTIN SAATLER */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-700 mb-4">⭐ Altın Saatler</h3>
              <div className="flex flex-wrap gap-3">
                {result.altin_saatler.map((saat, index) => (
                  <span 
                    key={index} 
                    className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full font-bold text-lg shadow-sm"
                  >
                    {saat}:00
                  </span>
                ))}
              </div>
            </div>
            
            {/* GRAFİK ALANI */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-700 mb-6">📈 İçerik Tipi Başarı Oranları</h3>
              <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                  <AnalyticsChart data={result.icerik_basarisi}/>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;