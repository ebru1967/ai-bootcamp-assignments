import pandas as pd
import io
from fastapi import FastAPI, File, UploadFile
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import LabelEncoder

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI-Community Insights Backend aktif! 🚀"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        return {
            "filename": file.filename,
            "satir_sayisi": df.shape[0],
            "sutunlar": df.columns.tolist(),
            "message": "Dosya başarıyla yüklendi! Şimdi /analyze endpoint'ine geçebilirsin."
        }
    except Exception as e:
        return {"error": "Okuma hatası", "detay": str(e)}

@app.post("/analyze")
async def analyze_data(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        
        # Sütun kontrolü: Bizim modelimiz 'saat', 'icerik_turu' ve 'etkilesim' sütunları bekliyor.
        beklenen_sutunlar = ['saat', 'icerik_turu', 'etkilesim']
        if not all(col in df.columns for col in beklenen_sutunlar):
            return {"error": f"CSV dosyasında şu sütunlar olmalı: {beklenen_sutunlar}"}

        # 1. Veri Ön İşleme (Preprocessing)
        le = LabelEncoder()
        df['icerik_turu_kod'] = le.fit_transform(df['icerik_turu']) # Metinleri (Video, Fotoğraf) sayılara çeviriyoruz
        
        X = df[['saat', 'icerik_turu_kod']]
        y = df['etkilesim']

        # 2. Model Eğitimi
        model = DecisionTreeRegressor(random_state=42)
        model.fit(X, y)

        # 3. İçgörü (Insight) Çıkarma
        # Hangi saatlerin en çok etkileşim getirdiğini bulalım
        saat_etkilesim = df.groupby('saat')['etkilesim'].mean().sort_values(ascending=False).head(3)
        altin_saatler = saat_etkilesim.index.tolist()

        return {
            "message": "Yapay Zeka Analizi Tamamlandı! 🧠",
            "altin_saatler": altin_saatler,
            "model_skoru": round(model.score(X, y), 2),
            "en_iyi_saat_etkilesim_ortalamasi": round(saat_etkilesim.iloc[0], 2)
        }

    except Exception as e:
        return {"error": "Analiz sırasında bir hata oluştu", "detay": str(e)}