import React, { useState, useRef } from 'react';
import { Settings, Calendar, Heart, Star, Smile, Crown, Cloud, Sun, X, RefreshCw, Type, Palette, Cross, Bird, Image as ImageIcon, Upload } from 'lucide-react';

const BabyDdayApp = () => {
  // --- State Management ---
  const [babyName, setBabyName] = useState('사랑스런 아기');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('days'); // 'days', 'weeks', 'months'
  const [theme, setTheme] = useState('warm'); // 'warm', 'cool', 'pink', 'mono'
  const [decoration, setDecoration] = useState('bear'); // 'bear', 'star', 'cloud', 'cross', 'dove'
  const [fontStyle, setFontStyle] = useState('rounded'); // 'rounded', 'hand', 'serif'
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [customQuote, setCustomQuote] = useState(''); // State for custom user quote
  const [photoUrl, setPhotoUrl] = useState(null); // State for uploaded photo
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);

  // --- Constants & Themes ---
  const themes = {
    warm: {
      bg: 'bg-[#fdf6e3]',
      card: 'bg-[#fffbf0]',
      text: 'text-[#5c4b43]',
      accent: 'text-[#d4a373]',
      border: 'border-[#e6ccb2]',
      button: 'bg-[#d4a373] hover:bg-[#c59260]',
      blockBg: 'bg-[#ffffff]',
      blockShadow: 'shadow-[#d7c4bb]',
      blockBorder: 'border-[#e6ccb2]',
      ringColor: 'from-amber-200 to-amber-500',
    },
    cool: {
      bg: 'bg-[#e0f7fa]',
      card: 'bg-[#ffffff]',
      text: 'text-[#37474f]',
      accent: 'text-[#4dd0e1]',
      border: 'border-[#b2ebf2]',
      button: 'bg-[#4dd0e1] hover:bg-[#26c6da]',
      blockBg: 'bg-[#ffffff]',
      blockShadow: 'shadow-[#b2ebf2]',
      blockBorder: 'border-[#b2ebf2]',
      ringColor: 'from-slate-300 to-slate-400',
    },
    pink: {
      bg: 'bg-[#fce4ec]',
      card: 'bg-[#fff0f5]',
      text: 'text-[#880e4f]',
      accent: 'text-[#f48fb1]',
      border: 'border-[#f8bbd0]',
      button: 'bg-[#f48fb1] hover:bg-[#f06292]',
      blockBg: 'bg-[#ffffff]',
      blockShadow: 'shadow-[#f8bbd0]',
      blockBorder: 'border-[#f8bbd0]',
      ringColor: 'from-rose-200 to-rose-400',
    },
    mono: {
      bg: 'bg-[#f5f5f5]',
      card: 'bg-[#ffffff]',
      text: 'text-[#212121]',
      accent: 'text-[#757575]',
      border: 'border-[#e0e0e0]',
      button: 'bg-[#757575] hover:bg-[#616161]',
      blockBg: 'bg-[#ffffff]',
      blockShadow: 'shadow-[#dcdcdc]',
      blockBorder: 'border-[#dcdcdc]',
      ringColor: 'from-gray-300 to-gray-500',
    }
  };

  const quotes = [
    "너는 하나님의 가장 귀한 선물이야",
    "지혜와 키가 자라가며 사랑받는 아이",
    "주님의 사랑이 너의 삶에 가득하길",
    "빛과 소금 같은 아이로 자라렴",
    "사랑받기 위해 태어난 소중한 너",
    "항상 기뻐하라 쉬지 말고 기도하라",
    "믿음 소망 사랑 그 중의 제일은 사랑",
    "여호와는 너를 지키시는 이시라",
    "(문구 없음)",
    "직접 입력" // Added option for custom input
  ];

  const currentTheme = themes[theme];

  // Font Classes
  const fontClasses = {
    rounded: 'font-jua',   // Jua
    hand: 'font-gamja',    // Gamja Flower
    serif: 'font-gowun',   // Gowun Batang
  };

  // --- Calculations & Logic ---
  const calculateDday = () => {
    const start = new Date(birthDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const getDisplayData = () => {
    const days = calculateDday();
    
    if (viewMode === 'days') {
      return { 
        cards: ['D', '+', `${days}`], 
        label: '일째 만남' 
      };
    } else if (viewMode === 'weeks') {
      const weeks = Math.floor(days / 7);
      const remainDays = days % 7;
      return { 
        cards: [`${weeks}주`, `${remainDays}일`], 
        label: '무럭무럭 자라는 중' 
      };
    } else if (viewMode === 'months') {
      const start = new Date(birthDate);
      const today = new Date();
      let months = (today.getFullYear() - start.getFullYear()) * 12;
      months -= start.getMonth();
      months += today.getMonth();
      if (today.getDate() < start.getDate()) months--;
      return { 
        cards: [`${months}`, '개월'], 
        label: '함께한 시간' 
      };
    }
    return { cards: [], label: '' };
  };

  const displayData = getDisplayData();

  // Handle Photo Upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Render Helpers ---
  const renderDecoration = () => {
    const iconProps = { size: 80, className: `${currentTheme.accent} opacity-15` }; 
    switch (decoration) {
      case 'bear': return <div className="absolute top-8 right-8 animate-bounce-slow"><Smile {...iconProps} /></div>;
      case 'star': return <div className="absolute top-8 right-8 animate-pulse"><Star {...iconProps} /></div>;
      case 'cloud': return <div className="absolute top-8 right-8 animate-float"><Cloud {...iconProps} /></div>;
      case 'crown': return <div className="absolute top-8 right-8"><Crown {...iconProps} /></div>;
      case 'cross': return <div className="absolute top-8 right-8"><Cross {...iconProps} /></div>; 
      case 'dove': return <div className="absolute top-8 right-8 animate-float"><Bird {...iconProps} /></div>;
      default: return null;
    }
  };

  const ChristianCross = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="80" height="80">
      <path d="M11 2v6H5v4h6v10h2V12h6V8h-6V2h-2z" />
    </svg>
  );

  // --- Flip Card Component ---
  const FlipCard = ({ text, index }) => (
    <div className="flex flex-col items-center mx-1 md:mx-2 lg:mx-3 group relative">
      {/* Rings holding the card */}
      <div className="absolute -top-3 md:-top-5 w-full flex justify-around px-4 md:px-6 z-20">
         <div className={`w-3 h-8 md:w-5 md:h-12 rounded-full bg-gradient-to-b ${currentTheme.ringColor} shadow-sm ring-1 ring-black/10`}></div>
         <div className={`w-3 h-8 md:w-5 md:h-12 rounded-full bg-gradient-to-b ${currentTheme.ringColor} shadow-sm ring-1 ring-black/10`}></div>
      </div>
      
      {/* The Card Itself */}
      <div className={`
        relative
        bg-white
        min-w-[60px] md:min-w-[100px] lg:min-w-[150px]
        h-[90px] md:h-[150px] lg:h-[220px]
        rounded-xl md:rounded-3xl
        shadow-[0_8px_0_rgba(0,0,0,0.05),0_15px_20px_rgba(0,0,0,0.1)]
        flex items-center justify-center
        border-b-4 md:border-b-8 ${currentTheme.blockBorder}
        transform transition-all duration-500 hover:-translate-y-1 hover:rotate-1
        z-10
      `}>
         {/* Punch Holes for rings */}
         <div className="absolute top-3 md:top-5 w-full flex justify-around px-4 md:px-6">
            <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-[#333] opacity-10 shadow-inner"></div>
            <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-[#333] opacity-10 shadow-inner"></div>
         </div>

         {/* Text Content - Responsive text sizing */}
         <span className={`text-4xl md:text-6xl lg:text-[7rem] font-bold ${currentTheme.text} leading-none mt-2 select-none`}>
           {text}
         </span>
         
         {/* Subtle Paper Texture/Gloss */}
         <div className="absolute inset-0 rounded-xl md:rounded-3xl bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Shadow Reflection on the 'Table' */}
      <div className="w-[80%] h-4 bg-black/10 blur-md rounded-[100%] mt-2 md:mt-4"></div>
    </div>
  );

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${currentTheme.bg} ${fontClasses[fontStyle]}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gamja+Flower&family=Gowun+Batang&family=Jua&display=swap');
        
        .font-jua { font-family: 'Jua', sans-serif; }
        .font-gamja { font-family: 'Gamja Flower', cursive; }
        .font-gowun { font-family: 'Gowun Batang', serif; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>

      {/* Main Container */}
      <div className={`relative w-full max-w-7xl aspect-video max-h-[90vh] ${currentTheme.card} rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-[12px] ${currentTheme.border} flex flex-col justify-between overflow-hidden transition-all duration-300 p-8 md:p-12`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Decoration */}
        {decoration === 'cross' ? 
          <div className={`absolute top-10 right-10 ${currentTheme.accent} opacity-15`}><ChristianCross /></div> : 
          renderDecoration()
        }
        
        {/* Top Section: Name and Date Info */}
        <div className="flex justify-between items-start z-10 w-full mb-2">
            <div className="flex flex-col items-start">
                 <div className={`text-3xl md:text-5xl ${currentTheme.text} font-bold tracking-wide`}>
                    {babyName}
                </div>
                <div className={`text-lg md:text-2xl ${currentTheme.accent} opacity-80 mt-2 font-sans`}>
                    Since {birthDate}
                </div>
            </div>
        </div>

        {/* Center Section: Split Layout (Photo Left, Calendar Right) */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center z-10 w-full py-4 gap-6 md:gap-12">
             
             {/* Left: Photo Frame Area */}
             <div className="flex-shrink-0 md:w-1/3 flex justify-center md:justify-end w-full">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className={`
                    group relative 
                    w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72
                    bg-white rounded-3xl 
                    shadow-[0_10px_30px_rgba(0,0,0,0.1)] 
                    border-[8px] ${currentTheme.border}
                    flex items-center justify-center
                    overflow-hidden cursor-pointer
                    transition-transform hover:scale-105 hover:rotate-[-2deg]
                  `}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="Baby" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300 group-hover:text-gray-400 transition-colors">
                      <ImageIcon size={48} className="mb-2" />
                      <span className="text-sm font-medium">사진 추가하기</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Upload className="text-white drop-shadow-md" size={32} />
                  </div>
                </div>
                {/* Photo Tape Effect (Optional visual) */}
                {/* <div className="absolute top-0 w-24 h-8 bg-white/30 rotate-[-15deg] backdrop-blur-sm shadow-sm pointer-events-none"></div> */}
             </div>

             {/* Right: Flip Cards Calendar */}
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-end justify-center flex-wrap gap-y-4">
                    {displayData.cards.map((text, idx) => (
                      <FlipCard key={idx} text={text} index={idx} />
                    ))}
                </div>
                <div className={`text-xl md:text-3xl ${currentTheme.accent} font-medium mt-6 md:mt-10 opacity-90`}>
                    {displayData.label}
                </div>
             </div>
        </div>

        {/* Bottom Section: Quote */}
        <div className="z-10 w-full flex flex-col items-center justify-end pb-4 min-h-[60px]">
          {(quoteIndex === quotes.length - 1 || (quotes[quoteIndex] !== "(문구 없음)")) && (
            <div className={`text-xl md:text-3xl ${currentTheme.text} opacity-70 text-center max-w-4xl leading-relaxed`}>
               <span className="opacity-50 mr-2">❝</span>
               {quoteIndex === quotes.length - 1 ? (customQuote || "당신의 축복 문구를 설정에서 입력해주세요") : quotes[quoteIndex]}
               <span className="opacity-50 ml-2">❞</span>
            </div>
          )}
        </div>

        {/* Settings Toggle Button */}
        <button 
          onClick={() => setShowSettings(true)}
          className={`absolute bottom-8 right-8 p-4 rounded-full bg-white/50 hover:bg-white shadow-lg backdrop-blur-sm transition-all text-gray-400 hover:text-gray-600 z-50`}
        >
          <Settings size={28} />
        </button>

      </div>

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className={`p-4 flex justify-between items-center ${currentTheme.bg}`}>
              <h2 className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}>
                <Settings size={20} /> 설정
              </h2>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-black/5 rounded-full">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-sans">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 font-medium mb-1 block">아기 이름 (태명)</span>
                  <input 
                    type="text" 
                    value={babyName} 
                    onChange={(e) => setBabyName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-medium mb-1 block">생년월일</span>
                  <input 
                    type="date" 
                    value={birthDate} 
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </label>
              </div>

               <div className="h-px bg-gray-100" />

              {/* Quote Selection */}
              <div>
                <span className="text-gray-700 font-medium mb-3 block flex items-center gap-2"><Heart size={16}/> 축복 문구 (기독교 & 감성)</span>
                <select 
                    value={quoteIndex}
                    onChange={(e) => setQuoteIndex(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white mb-2"
                >
                    {quotes.map((q, idx) => (
                        <option key={idx} value={idx}>{q}</option>
                    ))}
                </select>
                
                {/* Custom Quote Input Area (Shows only if "직접 입력" is selected) */}
                {quoteIndex === quotes.length - 1 && (
                    <textarea 
                        value={customQuote}
                        onChange={(e) => setCustomQuote(e.target.value)}
                        placeholder="이곳에 원하시는 축복의 말을 적어주세요."
                        className="w-full p-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 bg-amber-50/50 text-sm h-24 resize-none"
                    />
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* Theme & Display Settings */}
              <div className="space-y-6">
                  {/* View Mode */}
                  <div>
                    <span className="text-gray-700 font-medium mb-3 block flex items-center gap-2"><Calendar size={16}/> 표시 형식</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'days', label: 'D-Day' },
                        { id: 'weeks', label: '주수' },
                        { id: 'months', label: '개월수' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`p-2 rounded-lg text-sm transition-all ${viewMode === mode.id ? `${currentTheme.button} text-white shadow-md` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <span className="text-gray-700 font-medium mb-3 block flex items-center gap-2"><Palette size={16}/> 컬러 테마</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'warm', color: '#fdf6e3', label: '웜 베이지' },
                        { id: 'cool', color: '#e0f7fa', label: '쿨 민트' },
                        { id: 'pink', color: '#fce4ec', label: '러블리 핑크' },
                        { id: 'mono', color: '#f5f5f5', label: '모던 그레이' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${theme === t.id ? `border-gray-400 bg-gray-50` : 'border-transparent hover:bg-gray-50'}`}
                        >
                          <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: t.color }}></div>
                          <span className="text-xs text-gray-500">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
              </div>

              {/* Decoration & Font */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-700 font-medium mb-3 block flex items-center gap-2"><Star size={16}/> 장식 아이콘</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['bear', 'star', 'cloud', 'crown', 'cross', 'dove'].map((deco) => (
                      <button
                        key={deco}
                        onClick={() => setDecoration(deco)}
                        className={`p-2 rounded-lg border transition-all flex items-center justify-center ${decoration === deco ? 'border-gray-400 bg-gray-100' : 'border-gray-200'}`}
                      >
                         {deco === 'bear' && <Smile size={20} />}
                         {deco === 'star' && <Star size={20} />}
                         {deco === 'cloud' && <Cloud size={20} />}
                         {deco === 'crown' && <Crown size={20} />}
                         {deco === 'cross' && <ChristianCross className="w-5 h-5" />}
                         {deco === 'dove' && <Bird size={20} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-700 font-medium mb-3 block flex items-center gap-2"><Type size={16}/> 폰트 스타일</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'rounded', label: '동글 (Jua)' }, 
                      { id: 'hand', label: '손글씨 (Gamja)' },  
                      { id: 'serif', label: '명조 (Gowun)' },   
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFontStyle(f.id)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all text-left ${fontStyle === f.id ? 'border-gray-400 bg-gray-100' : 'border-gray-200'}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 bg-gray-50 text-center">
              <button 
                onClick={() => setShowSettings(false)}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95 ${currentTheme.button}`}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BabyDdayApp;

