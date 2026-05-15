import { createContext, useState, useContext } from 'react';

// 1. Context'i oluşturuyoruz
const ReportContext = createContext<any>(null);

// 2. Uygulamayı sarmalayacak Provider bileşeni
export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [analizSonucu, setAnalizSonucu] = useState<any>(null);

  return (
    <ReportContext.Provider value={{ analizSonucu, setAnalizSonucu }}>
      {children}
    </ReportContext.Provider>
  );
}

// 3. Diğer sayfalardan veriye kolayca ulaşmak için özel bir Hook yazıyoruz
export function useReport() {
  return useContext(ReportContext);
}