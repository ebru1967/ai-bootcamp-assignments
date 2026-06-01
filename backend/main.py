import pandas as pd
import io
import os
from dotenv import load_dotenv
from google import genai 
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import LabelEncoder

# 1. Çevresel değişkenleri (.env) yükle
load_dotenv()

# 2. Yeni Gemini İstemcisini Başlat
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

last_analysis = {
    "message": "Henüz analiz yapılmadı.",
    "altin_saatler": [18, 20, 22],
    "model_skoru": 0.0,
    "en_iyi_saat_etkilesim_ortalamasi": 0,
    "icerik_basarisi": {},
    "ai_tavsiyesi": "Lütfen önce bir veri seti yükleyerek analizi başlatın."
}

@app.get("/")
def read_root():
    return {"status": "Online", "project": "AI-Community Insights Backend"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        return {
            "filename": file.filename,
            "rows": df.shape[0],
            "message": "Veri seti başarıyla sisteme yüklendi!"
        }
    except Exception as e:
        return {"error": "Dosya okunamadı", "detail": str(e)}

@app.get("/analyze")
async def get_analyze():
    return last_analysis

@app.post("/analyze")
async def analyze_data(file: UploadFile = File(...)):
    global last_analysis
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        
        beklenen_sutunlar = ['saat', 'icerik_turu', 'etkilesim']
        if not all(col in df.columns for col in beklenen_sutunlar):
            return {"error": f"Eksik sütun! Gerekli: {beklenen_sutunlar}"}

        # --- MAKİNE ÖĞRENMESİ (ML) KISMI ---
        le = LabelEncoder()
        df['icerik_turu_kod'] = le.fit_transform(df['icerik_turu'])
        
        X = df[['saat', 'icerik_turu_kod']]
        y = df['etkilesim']

        model = DecisionTreeRegressor(random_state=42)
        model.fit(X, y)

        saat_etkilesim = df.groupby('saat')['etkilesim'].mean().sort_values(ascending=False).head(3)
        altin_saatler = [int(x) for x in saat_etkilesim.index.tolist()]

        icerik_etkilesim = df.groupby('icerik_turu')['etkilesim'].mean().round(0).to_dict()
        icerik_etkilesim = {k: int(v) for k, v in icerik_etkilesim.items()}
        en_iyi_tur = max(icerik_etkilesim, key=icerik_etkilesim.get)

        # --- YENİ: GEMINI API (LLM) KISMI VE HATA KONTROLÜ ---
        prompt = f"""
        Sen uzman bir sosyal medya stratejistisin.
        Elimizde az önce eğittiğimiz makine öğrenmesi modelinden çıkan şu veriler var:
        - En çok etkileşim alan saatler: {altin_saatler}
        - En başarılı içerik türü: '{en_iyi_tur}'
        - İçerik başarı skorları: {icerik_etkilesim}
        
        Lütfen uygulamanın kullanıcısına doğrudan hitap eden, enerjik ve motive edici 2-3 cümlelik kısa bir içerik tavsiyesi yaz. 
        Kullanıcıya algoritmayı yenmesi için ne tür içerik üretmesi gerektiğini ve saat kaçta paylaşması gerektiğini kesin bir dille söyle. 
        Markdown formatı kullanma, düz metin olsun.
        """
        
        try:
            response = gemini_client.models.generate_content(
                model='gemini-1.5-flash', 
                contents=prompt
            )
            ai_tavsiyesi_metni = response.text.strip()
            mesaj_durumu = "Yapay Zeka Analizi Başarılı! 🧠✨"
            
        except Exception as api_error:
            print(f"Gemini API Hatası Yakalandı: {api_error}")
            ai_tavsiyesi_metni = f"Makine öğrenmesi modelimize göre en çok etkileşimi '{en_iyi_tur}' içerikleri alıyor. Algoritmayı yakalamak ve kitleyi büyütmek için bir sonraki gönderini saat {altin_saatler[0]}:00 sularında paylaşmalısın!"
            mesaj_durumu = "ML Analizi Başarılı (LLM Çevrimdışı) 📊"

        last_analysis = {
            "message": mesaj_durumu,
            "altin_saatler": altin_saatler,
            "model_skoru": round(float(model.score(X, y)), 2),
            "en_iyi_saat_etkilesim_ortalamasi": int(saat_etkilesim.iloc[0]),
            "icerik_basarisi": icerik_etkilesim,
            "ai_tavsiyesi": ai_tavsiyesi_metni 
        }

        return last_analysis

    except Exception as e:
        return {"error": "Analiz hatası", "detail": str(e)}
