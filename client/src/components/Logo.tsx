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
      <g transform="translate(85, 80)">
        {/* Arka Plandaki Derinlik Çemberleri */}
        <circle cx="0" cy="0" r="32" stroke="#6B21A8" strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
        <circle cx="0" cy="0" r="26" stroke="#6B21A8" strokeWidth="1.8" fill="none" />
        <circle cx="0" cy="0" r="20" stroke="#6B21A8" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
        
        {/* İnce Simetri Çizgileri */}
        <g stroke="#6B21A8" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round">
          <line x1="0" y1="0" x2="0" y2="-25" />
          <line x1="0" y1="0" x2="0" y2="25" />
          <line x1="0" y1="0" x2="22" y2="-8" />
          <line x1="0" y1="0" x2="-22" y2="8" />
          <line x1="0" y1="0" x2="14" y2="18" />
          <line x1="0" y1="0" x2="-14" y2="-18" />
        </g>
        <circle cx="0" cy="0" r="3.5" fill="#6B21A8" />

        {/* Görseldeki Üç Boyutlu, İç İçe Geçmiş Yarı Şeffaf Prizma Katmanları */}
        <g fill="#6B21A8" stroke="#6B21A8" strokeWidth="0.5" strokeOpacity="0.2">
          {/* Arka katman - geniş ve çok şeffaf */}
          <polygon points="20,-22 45,-30 125,-42 125,-6" opacity="0.08" />
          <polygon points="20,22 45,30 125,42 125,6" opacity="0.08" />
          
          {/* Orta katman - kesişim dalgaları */}
          <polygon points="25,-15 42,-24 130,-20 120,-32" opacity="0.12" />
          <polygon points="25,15 42,24 130,20 120,32" opacity="0.12" />
          
          {/* Ön ana katman - görseldeki belirgin gövde */}
          <polygon points="30,-12 42,-18 120,-28 120,-16" opacity="0.15" />
          <polygon points="30,12 42,18 120,28 120,16" opacity="0.15" />
          
          {/* Merkezdeki keskin yoğunluk üçgeni (Görselin tam ortasındaki koyu kısım) */}
          <polygon points="32,0 48,-7 48,7" fill="#6B21A8" fillOpacity="0.65" stroke="none" />
        </g>

        {/* 7 Farklı Canlı Alfabede 'A' Sesi */}
        <g font-family="'Times New Roman', 'Arial', sans-serif" fontWeight="bold" fill="#6B21A8" fillOpacity="0.95" textAnchor="middle">
          <text x="0" y="-38" fontSize="13">A</text> {/* Latin */}
          <text x="28" y="-22" font-family="'Arabic Typesetting', serif" fontSize="18">ا</text> {/* Arapça */}
          <text x="36" y="12" font-family="'Noto Sans Bengali', sans-serif" fontSize="13">অ</text> {/* Bengalce */}
          <text x="16" y="36" font-family="'MS Mincho', sans-serif" fontSize="11">あ</text> {/* Japonca */}
          <text x="-16" y="36" font-family="'Malgun Gothic', sans-serif" fontSize="11">아</text> {/* Korece */}
          <text x="-36" y="12" font-family="'SimSun', 'STSong', serif" fontSize="11">阿</text> {/* Çince */}
          <text x="-28" y="-22" font-family="'Arial Unicode MS', sans-serif" fontSize="11">अ</text> {/* Hintçe */}
        </g>
      </g>

      {/* Sağ Taraftaki Metin ve Alt Çizgi */}
      <g fill="none" strokeLinecap="round">
        <text x="220" y="84" font-family="sans-serif" fontWeight="900" fontSize="36" letterSpacing="6" fill="#6B21A8">AVTT</text>
        <line x1="220" y1="96" x2="330" y2="96" stroke="#6B21A8" strokeWidth="3" />
      </g>
    </svg>
  );
};
