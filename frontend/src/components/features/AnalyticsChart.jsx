import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsChart({ data }) {
  // Gelen objeyi Recharts'ın anlayacağı Dizi formatına çeviriyoruz
  const chartData = data ? Object.entries(data).map(([key, value]) => ({
    isim: key,
    Etkileşim: value
  })) : [];

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">📈 İçerik Türü Performansı</h3>
      
      <div className="w-full h-[300px] bg-white p-4 rounded-xl mt-2 shadow-sm border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            
            <XAxis 
              dataKey="isim" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => value > 1000 ? `${value/1000}k` : value} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            
            <Tooltip 
              cursor={{ fill: '#f8fafc' }} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
            />
            
            <Bar dataKey="Etkileşim" radius={[6, 6, 0, 0]} barSize={50}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  /* En yüksek değerli ilk çubuğu daha koyu bir renkle vurguluyoruz */
                  fill={index === 0 ? '#4f46e5' : '#818cf8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}