import pandas as pd
import io
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import LabelEncoder

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        
        beklenen_sutunlar = ['saat', 'icerik_turu', 'etkilesim']
        if not all(col in df.columns for col in beklenen_sutunlar):
            return {"error": f"CSV dosyasında şu sütunlar olmalı: {beklenen_sutunlar}"}

        # Veri Ön İşleme
        le = LabelEncoder()
        df['icerik_turu_kod'] = le.fit_transform(df['icerik_turu'])
        
        X = df[['saat', 'icerik_turu_kod']]
        y = df['etkilesim']

        # Model Eğitimi
        model = DecisionTreeRegressor(random_state=42)
        model.fit(X, y)

        # 1. Altın Saatler Hesaplaması
        saat_etkilesim = df.groupby('saat')['etkilesim'].mean().sort_values(ascending=False).head(3)
        altin_saatler = saat_etkilesim.index.tolist()

        # 2. İçerik Türü Başarısı Hesaplaması
        icerik_etkilesim = df.groupby('icerik_turu')['etkilesim'].mean().round(0).to_dict()

        return {
            "message": "Yapay Zeka Analizi Tamamlandı! 🧠",
            "altin_saatler": altin_saatler,
            "model_skoru": round(model.score(X, y), 2),
            "en_iyi_saat_etkilesim_ortalamasi": round(saat_etkilesim.iloc[0], 2),
            "icerik_basarisi": icerik_etkilesim 
        }

    except Exception as e:
        return {"error": "Analiz sırasında bir hata oluştu", "detay": str(e)}