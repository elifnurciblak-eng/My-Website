import React from 'react';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className, width = 380, height = 122 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 500 160" 
      width={width} 
      height={height} 
      className={className}
    >
      <defs>
        {/* Sitenin Swiss Style (Kırmızı-Siyah-Beyaz) paletine uygun gradyanlar */}
        <linearGradient id="logo-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E63946" /> {/* Sitenin ana kırmızısı (oklch(0.6 0.25 25)) */}
          <stop offset="100%" stopColor="#1D3557" /> {/* Derin kontrast için koyu lacivert/siyah geçişi */}
        </linearGradient>
        
        <linearGradient id="logo-gradient-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E63946" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#457B9D" stopOpacity="0.6" />
        </linearGradient>

        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform="translate(85, 80)">
        {/* Arka Plandaki Derinlik Çemberleri - Sitenin gri/siyah tonlarıyla karışmaması için hafif kırmızı tonlar */}
        <circle cx="0" cy="0" r="32" stroke="#E63946" strokeWidth="1.2" fill="none" strokeDasharray="2 2" opacity="0.3" />
        <circle cx="0" cy="0" r="26" stroke="#1D3557" strokeWidth="1.8" fill="none" opacity="0.4" />
        <circle cx="0" cy="0" r="20" stroke="#E63946" strokeWidth="1.5" fill="none" strokeDasharray="4 2" opacity="0.5" />
        
        {/* İnce Simetri Çizgileri */}
        <g stroke="#1D3557" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round">
          <line x1="0" y1="0" x2="0" y2="-25" />
          <line x1="0" y1="0" x2="0" y2="25" />
          <line x1="0" y1="0" x2="22" y2="-8" />
          <line x1="0" y1="0" x2="-22" y2="8" />
          <line x1="0" y1="0" x2="14" y2="18" />
          <line x1="0" y1="0" x2="-14" y2="-18" />
        </g>
        <circle cx="0" cy="0" r="3.5" fill="url(#logo-gradient-primary)" />

        {/* Görseldeki Üç Boyutlu Katmanlar - Renk Paleti Uygulaması */}
        <g stroke="url(#logo-gradient-primary)" strokeWidth="0.5" strokeOpacity="0.3">
          {/* Arka katman - geniş ve çok şeffaf */}
          <polygon points="20,-22 45,-30 125,-42 125,-6" fill="#E63946" opacity="0.1" />
          <polygon points="20,22 45,30 125,42 125,6" fill="#1D3557" opacity="0.1" />
          
          {/* Orta katman - kesişim dalgaları */}
          <polygon points="25,-15 42,-24 130,-20 120,-32" fill="#E63946" opacity="0.15" />
          <polygon points="25,15 42,24 130,20 120,32" fill="#457B9D" opacity="0.15" />
          
          {/* Ön ana katman - görseldeki belirgin gövde */}
          <polygon points="30,-12 42,-18 120,-28 120,-16" fill="url(#logo-gradient-primary)" opacity="0.25" />
          <polygon points="30,12 42,18 120,28 120,16" fill="url(#logo-gradient-accent)" opacity="0.25" />
          
          {/* Merkezdeki keskin yoğunluk üçgeni - En belirgin nokta */}
          <polygon points="32,0 48,-7 48,7" fill="#E63946" fillOpacity="0.8" stroke="none" filter="url(#logo-glow)" />
        </g>

        {/* 7 Farklı Canlı Alfabede 'A' Sesi - Kontrast için koyu renkler */}
        <g font-family="'Times New Roman', 'Arial', sans-serif" fontWeight="bold" fill="#1D3557" fillOpacity="0.9" textAnchor="middle">
          <text x="0" y="-38" fontSize="13">A</text>
          <text x="28" y="-22" font-family="'Arabic Typesetting', serif" fontSize="18">ا</text>
          <text x="36" y="12" font-family="'Noto Sans Bengali', sans-serif" fontSize="13">অ</text>
          <text x="16" y="36" font-family="'MS Mincho', sans-serif" fontSize="11">あ</text>
          <text x="-16" y="36" font-family="'Malgun Gothic', sans-serif" fontSize="11">아</text>
          <text x="-36" y="12" font-family="'SimSun', 'STSong', serif" fontSize="11">阿</text>
          <text x="-28" y="-22" font-family="'Arial Unicode MS', sans-serif" fontSize="11">अ</text>
        </g>
      </g>

      {/* Sağ Taraftaki Metin ve Alt Çizgi - Sitenin ana kırmızısı ve siyahı ile uyumlu */}
      <g fill="none" strokeLinecap="round">
        <text x="220" y="84" font-family="sans-serif" fontWeight="900" fontSize="36" letterSpacing="6" fill="#1D3557">
          AVT<tspan fill="#E63946">T</tspan>
        </text>
        <line x1="220" y1="96" x2="330" y2="96" stroke="#E63946" strokeWidth="3" />
      </g>
    </svg>
  );
};
