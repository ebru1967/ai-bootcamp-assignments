import { useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleAnalyze = async () => {
    if (!file) {
      alert("Lütfen önce bir CSV dosyası seç!") 
      return
    }
    //Bu platformların "İstatistikler (Analytics)" bölümüne girip 
    // "Verileri Dışa Aktar (Export Data)"

    setLoading(true)
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData)
      setResult(response.data)
    } catch (error) {
      console.error("Bağlantı hatası:", error)
      alert("Backend'e bağlanırken bir hata oluştu. Python sunucusunun açık olduğundan emin ol.")
    } finally {
      setLoading(false)
    }
  }

  // Backend'den gelen veriyi Recharts'ın anlayacağı formata çeviriyoruz
  const chartData = result && result.icerik_basarisi 
    ? Object.entries(result.icerik_basarisi).map(([key, value]) => ({
        isim: key,
        Etkileşim: value
      }))
    : [];

  return (
    <div style={{ padding: '70px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      
      <h1 style={{ color: '#d0deec', fontFamily: "'Playfair Display', serif", fontWeight: '700', fontSize: '2.5rem' }}>
        AI-Community Insights
      </h1>
      
      <p style={{ color: '#7f8c8d', fontFamily: "'Oswald', sans-serif", fontSize: '1.2rem', letterSpacing: '0.5px' }}>
        Sosyal medya verilerini yükle, yapay zeka en iyi saatleri söylesin.
      </p>
      
      <div style={{ 
        marginBottom: '30px', 
        padding: '30px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e0e6ed', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px' 
      }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={{ 
            width: '100%',
            maxWidth: '300px',
            fontFamily: 'inherit',
            color: '#34495e',
            cursor: 'pointer'
          }} 
        />
        
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          style={{ 
            padding: '14px 28px', 
            backgroundColor: loading ? '#bdc3c7' : '#2c3e50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: "'Oswald', sans-serif", 
            letterSpacing: '1px',
            width: '100%',
            maxWidth: '300px',
            boxShadow: loading ? 'none' : '0 4px 6px rgba(44, 62, 80, 0.2)'
          }}
        >
          {loading ? "YAPAY ZEKA DÜŞÜNÜYOR 🧠..." : "VERİLERİ ANALİZ ET"}
        </button>
      </div>

      {result && !result.error && (
        <div style={{background: '#ecf0f1', padding: '30px', borderRadius: '12px', borderLeft: '6px solid #2aaf8c', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#4189e2', marginTop: '0', fontFamily: "'Playfair Display', serif" }}>📊 Analiz Sonuçları</h2>
          <p style={{ fontSize: '1.1rem' }}><strong>🎯 Modelin Güven Skoru:</strong> %{(result.model_skoru * 100).toFixed(0)}</p>
          <p style={{ fontSize: '1.1rem' }}><strong>🔥 En Yüksek Ortalama Etkileşim:</strong> {result.en_iyi_saat_etkilesim_ortalamasi.toLocaleString('tr-TR')}</p>
          
          <h3 style={{ color: '#2aaf8c', fontFamily: "'Oswald', sans-serif", marginTop: '25px' }}>⭐ Altın Saatler (Tavsiye Edilen)</h3>
          <ul style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', gap: '15px', padding: 0, listStyle: 'none' }}>
            {result.altin_saatler.map((saat, index) => (
              <li key={index} style={{ background: '#2aaf8c', color: 'white', padding: '8px 16px', borderRadius: '20px' }}>
                {saat}:00
              </li>
            ))}
          </ul>

          {}
          <h3 style={{ color: '#4189e2', fontFamily: "'Oswald', sans-serif", marginTop: '35px' }}>📈 İçerik Türü Performansı</h3>
          <div style={{ width: '100%', height: 300, backgroundColor: 'white', padding: '6px', borderRadius: '8px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="isim" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value > 1000 ? `${value/1000}k` : value} />
                <Tooltip cursor={{ fill: '#f4f6f8' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Etkileşim" fill="#3498db" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {}

        </div>
      )}

      {result && result.error && (
        <div style={{ background: '#ffcccc', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #c0392b' }}>
          <h3 style={{ color: '#cb2512', marginTop: '0', fontFamily: "'Playfair Display', serif" }}>Bir Sorun Oluştu!</h3>
          <p><strong>Hata:</strong> {result.error}</p>
          <p><strong>Detay:</strong> {result.detay}</p>
        </div>
      )}
    </div>
  )
}

export default App