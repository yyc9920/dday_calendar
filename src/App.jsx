import React, { useRef } from 'react';
import { Settings, Calendar, Heart, Star, Smile, Crown, Cloud, Bird, Image as ImageIcon, Upload, X, Palette, Type, PenTool, Minus, Plus } from 'lucide-react';
import useLocalStorage from './hooks/useLocalStorage';
import { compressImage } from './utils/imageCompressor';

// --- Sub-components defined outside to prevent re-creation ---

const Sticker = ({ children, className }) => (
  <div className={`sticker absolute top-[-20px] right-[-20px] animate-pendulum hover:scale-110 transition-transform ${className}`}>
    {children}
  </div>
);

const Decoration = ({ type, currentTheme }) => {
  const iconProps = { size: 90, className: `${currentTheme.accent} fill-current opacity-90` }; 
  switch (type) {
    case 'bear': return <Sticker><Smile {...iconProps} /></Sticker>;
    case 'star': return <Sticker><Star {...iconProps} /></Sticker>;
    case 'cloud': return <Sticker><Cloud {...iconProps} /></Sticker>;
    case 'crown': return <Sticker><Crown {...iconProps} /></Sticker>;
    case 'cross': return (
      <Sticker>
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconProps.className} width="90" height="90">
          <path d="M11 2v6H5v4h6v10h2V12h6V8h-6V2h-2z" />
        </svg>
      </Sticker>
    );
    case 'dove': return <Sticker><Bird {...iconProps} /></Sticker>;
    default: return null;
  }
};

const FlipCard = ({ text, currentTheme, fontScale = 1 }) => {
  // Adjust font size based on text length to keep "Day" or long numbers fitting nicely
  const isLongText = text.toString().length > 2;
  const fontSizeClass = isLongText 
    ? "text-4xl md:text-6xl lg:text-[5rem]" 
    : "text-5xl md:text-7xl lg:text-[7rem]";

  return (
    <div className="flex flex-col items-center mx-1 md:mx-3 group relative">
      {/* Binding Rings */}
      <div className="absolute -top-4 w-full flex justify-around px-4 z-20">
         <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${currentTheme.ringColor} shadow-sm ring-1 ring-black/20`}></div>
         <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${currentTheme.ringColor} shadow-sm ring-1 ring-black/20`}></div>
      </div>
      
      {/* Card Body */}
      <div className={`
        relative bg-[#fffdf9]
        min-w-[70px] md:min-w-[120px] lg:min-w-[160px]
        h-[100px] md:h-[160px] lg:h-[220px]
        rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
        border border-gray-200
        flex items-center justify-center
        transform transition-transform duration-300 hover:rotate-1
      `}>
         {/* Holes */}
         <div className="absolute top-4 w-full flex justify-around px-4">
            <div className="w-4 h-4 rounded-full bg-[#444] shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]"></div>
            <div className="w-4 h-4 rounded-full bg-[#444] shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]"></div>
         </div>
         
         {/* Center Crease */}
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 z-0"></div>
         <div className="absolute top-1/2 left-0 w-full h-[2px] card-crease z-0"></div>

         {/* Text */}
         <span 
           className={`${fontSizeClass} font-bold ${currentTheme.text} leading-none mt-4 z-10 drop-shadow-sm transition-transform duration-200`}
           style={{ transform: `scale(${fontScale})` }}
         >
           {text}
         </span>
      </div>
    </div>
  );
};

const Polaroid = ({ currentTheme, photoUrl, birthDate, onPhotoClick }) => (
  <div className="relative group perspective-1000">
    {/* Washi Tape */}
    <div className={`washi-tape -top-4 left-1/2 -translate-x-1/2 z-20 ${currentTheme.tape}`}></div>
    
    <div 
      onClick={onPhotoClick}
      className={`
        relative
        w-56 h-64 md:w-72 md:h-80 lg:w-80 lg:h-96
        bg-white p-3 pb-12
        shadow-xl transform rotate-[-3deg] transition-all duration-300
        hover:scale-105 hover:rotate-0 hover:z-10 hover:shadow-2xl
        cursor-pointer
        flex flex-col
        border border-gray-100
      `}
    >
      <div className="w-full h-full bg-gray-100 overflow-hidden relative shadow-inner">
         {photoUrl ? (
           <img src={photoUrl} alt="Baby" className="w-full h-full object-cover filter contrast-[1.05] brightness-[1.05] sepia-[0.1]" />
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-gray-300">
             <ImageIcon size={48} className="mb-2 opacity-50" />
             <span className="font-handwriting text-sm">Tap to add photo</span>
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-blue-500/10 mix-blend-overlay pointer-events-none"></div>
      </div>
      
      {/* Handwritten Date Label */}
      <div className={`absolute bottom-3 right-4 font-handwriting text-gray-400 rotate-[-1deg] text-lg md:text-xl`}>
        {birthDate.replaceAll('-', '.')}
      </div>
    </div>
  </div>
);


const BabyDdayApp = () => {
  // --- State Management with Local Storage ---
  const [babyName, setBabyName] = useLocalStorage('babyName', '사랑스런 아기');
  const [birthDate, setBirthDate] = useLocalStorage('birthDate', new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useLocalStorage('viewMode', 'days'); 
  const [theme, setTheme] = useLocalStorage('theme', 'warm'); 
  const [decoration, setDecoration] = useLocalStorage('decoration', 'bear'); 
  const [fontStyle, setFontStyle] = useLocalStorage('fontStyle', 'rounded'); 
  const [quoteIndex, setQuoteIndex] = useLocalStorage('quoteIndex', 0);
  const [customQuote, setCustomQuote] = useLocalStorage('customQuote', ''); 
  const [photoUrl, setPhotoUrl] = useLocalStorage('photoUrl', null); 
  const [fontScale, setFontScale] = useLocalStorage('fontScale', 1);
  
  // Settings visibility doesn't need persistence
  const [showSettings, setShowSettings] = React.useState(false);
  const fileInputRef = useRef(null);

  // --- Constants & Themes ---
  const themes = {
    warm: {
      id: 'warm',
      containerBg: 'bg-paper-warm',
      card: 'bg-[#fffdf5]',
      text: 'text-[#5c4b43]',
      accent: 'text-[#8d6e63]',
      border: 'border-[#d7ccc8]',
      tape: 'bg-[#d7ccc8]',
      button: 'bg-[#8d6e63] hover:bg-[#795548]',
      ringColor: 'from-amber-700 to-amber-900',
    },
    cool: {
      id: 'cool',
      containerBg: 'bg-paper-cool',
      card: 'bg-[#ffffff]',
      text: 'text-[#455a64]',
      accent: 'text-[#607d8b]',
      border: 'border-[#cfd8dc]',
      tape: 'bg-[#90a4ae]',
      button: 'bg-[#607d8b] hover:bg-[#546e7a]',
      ringColor: 'from-slate-600 to-slate-800',
    },
    pink: {
      id: 'pink',
      containerBg: 'bg-paper-pink',
      card: 'bg-[#fff5f8]',
      text: 'text-[#880e4f]',
      accent: 'text-[#ad1457]',
      border: 'border-[#f48fb1]',
      tape: 'bg-[#f48fb1]',
      button: 'bg-[#ec407a] hover:bg-[#d81b60]',
      ringColor: 'from-pink-600 to-pink-800',
    },
    mono: {
      id: 'mono',
      containerBg: 'bg-paper-mono',
      card: 'bg-[#ffffff]',
      text: 'text-[#212121]',
      accent: 'text-[#424242]',
      border: 'border-[#9e9e9e]',
      tape: 'bg-[#bdbdbd]',
      button: 'bg-[#616161] hover:bg-[#424242]',
      ringColor: 'from-gray-700 to-gray-900',
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
    "직접 입력" 
  ];

  const currentTheme = themes[theme] || themes.warm;

  const fontClasses = {
    rounded: 'font-jua',
    hand: 'font-gamja', 
    serif: 'font-gowun',
  };

  // --- Logic ---
  const calculateDday = () => {
    const start = new Date(birthDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDisplayData = () => {
    const days = calculateDday();
    if (days < 0) return { cards: ['D', '-', `${-days}`], label: '세상으로 나올 준비 중' };
    if (days === 0) return { cards: ['D', '-', 'Day'], label: '반가워, 아가야❤️' };
    
    if (viewMode === 'days') {
      return { cards: ['D', '+', `${days}`], label: '일째 만남' };
    } else if (viewMode === 'weeks') {
      const weeks = Math.floor(days / 7);
      const remainDays = days % 7;
      return { cards: [`${weeks}주`, `${remainDays}일`], label: '무럭무럭 자라는 중' };
    } else if (viewMode === 'months') {
      const start = new Date(birthDate);
      const today = new Date();
      let months = (today.getFullYear() - start.getFullYear()) * 12;
      months -= start.getMonth();
      months += today.getMonth();
      if (today.getDate() < start.getDate()) months--;
      return { cards: [`${months}`, '개월'], label: '함께한 시간' };
    }
    return { cards: [], label: '' };
  };

  const displayData = getDisplayData();

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 2); 
        setPhotoUrl(compressedDataUrl);
      } catch (error) {
        console.error("Image upload error:", error);
        alert("이미지 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 ${currentTheme.containerBg} ${fontClasses[fontStyle]} transition-colors duration-500`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gamja+Flower&family=Gowun+Batang&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        .font-gamja { font-family: 'Gamja Flower', cursive; }
        .font-gowun { font-family: 'Gowun Batang', serif; }
        .font-handwriting { font-family: 'Gamja Flower', cursive; }
      `}</style>

      {/* Main Board/Planner */}
      <div className={`
        relative w-full max-w-7xl 
        ${currentTheme.card} 
        rounded-[4px] md:rounded-[12px]
        shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] 
        flex flex-col md:flex-row
        overflow-visible
        p-6 md:p-12 gap-8 md:gap-16
        min-h-[80vh]
      `}>
        {/* Book Spine / Binding visual for desktop */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-r from-black/5 to-transparent -ml-[1px]"></div>
        
        {/* Left Page: Photo & Info */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 relative">
           <Polaroid 
             currentTheme={currentTheme} 
             photoUrl={photoUrl} 
             birthDate={birthDate} 
             onPhotoClick={() => fileInputRef.current?.click()} 
           />
           <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
           
           <div className="mt-12 text-center z-10">
             <h1 className={`text-4xl md:text-6xl ${currentTheme.text} font-bold tracking-tight mb-2 drop-shadow-sm`}>
               {babyName}
             </h1>
             <p className={`text-xl md:text-2xl ${currentTheme.accent} font-serif italic opacity-80`}>
               Since {birthDate}
             </p>
           </div>
        </div>

        {/* Right Page: Calendar & Quote */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
           {/* Sticker Decoration */}
           <div className="absolute top-0 right-0 z-20">
              <Decoration type={decoration} currentTheme={currentTheme} />
           </div>

           {/* Calendar Flip Cards */}
           <div className="flex items-end justify-center flex-nowrap gap-x-1 md:gap-x-2 mb-12 mt-12 md:mt-0">
               {displayData.cards.map((text, idx) => (
                 <FlipCard key={idx} text={text} currentTheme={currentTheme} fontScale={fontScale} />
               ))}
           </div>
           
           <div 
             className={`text-2xl md:text-4xl ${currentTheme.accent} font-medium mb-16 border-b-2 border-dotted ${currentTheme.border} pb-2 transition-transform duration-200`}
             style={{ transform: `scale(${fontScale})` }}
           >
               {displayData.label}
           </div>

           {/* Handwritten Quote */}
           <div className="w-full max-w-md relative p-6">
              <span className="absolute top-0 left-0 text-6xl opacity-10 font-serif">"</span>
              <p 
                className={`text-xl md:text-2xl ${currentTheme.text} text-center leading-relaxed font-handwriting transition-transform duration-200`}
                style={{ transform: `scale(${fontScale})` }}
              >
                 {quoteIndex === quotes.length - 1 ? (customQuote || "당신의 축복 문구를 적어주세요...") : quotes[quoteIndex]}
              </p>
              <span className="absolute bottom-0 right-0 text-6xl opacity-10 font-serif">"</span>
           </div>
        </div>

        {/* Settings Button (Styled as a tab) */}
        <button 
          onClick={() => setShowSettings(true)}
          className={`
            absolute -right-3 top-12 
            bg-white border border-l-0 ${currentTheme.border} 
            p-3 rounded-r-lg shadow-sm 
            hover:translate-x-1 transition-transform
            text-gray-400 hover:text-gray-600
            z-0
          `}
        >
          <Settings size={24} />
        </button>

      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="bg-[#fffbf0] w-full max-w-lg rounded-sm shadow-2xl relative border-8 border-white transform rotate-1">
             {/* Tape on settings */}
             <div className="washi-tape -top-3 left-1/2 -translate-x-1/2 w-32 bg-red-100/50"></div>

             <div className="p-6 md:p-8 space-y-8 max-h-[85vh] overflow-y-auto">
               <div className="flex justify-between items-center border-b-2 border-dashed border-gray-200 pb-4">
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                   <PenTool size={20}/> 기록 설정
                 </h2>
                 <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-red-400 transition-colors">
                   <X size={28} />
                 </button>
               </div>

               <div className="space-y-6">
                 {/* Inputs */}
                 <div className="space-y-4">
                    <div className="relative">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                      <input 
                        type="text" 
                        value={babyName} 
                        onChange={(e) => setBabyName(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-gray-300 focus:border-gray-800 py-2 text-xl outline-none transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 block">Date</label>
                      <input 
                        type="date" 
                        value={birthDate} 
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-gray-300 focus:border-gray-800 py-2 text-xl outline-none transition-colors font-mono"
                      />
                    </div>
                 </div>

                 {/* Quote Selector */}
                 <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                       Message
                    </label>
                    <select 
                      value={quoteIndex}
                      onChange={(e) => setQuoteIndex(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded shadow-sm outline-none focus:ring-1 focus:ring-gray-400 mb-2"
                    >
                      {quotes.map((q, idx) => (
                        <option key={idx} value={idx}>{q}</option>
                      ))}
                    </select>
                    {quoteIndex === quotes.length - 1 && (
                      <textarea 
                        value={customQuote}
                        onChange={(e) => setCustomQuote(e.target.value)}
                        placeholder="직접 입력하세요..."
                        className="w-full p-3 bg-yellow-50/50 border-2 border-yellow-100 rounded-lg focus:border-yellow-300 outline-none text-sm resize-none h-20"
                      />
                    )}
                 </div>

                 {/* Theme Grid */}
                 <div>
                   <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Theme</label>
                   <div className="grid grid-cols-4 gap-3">
                     {Object.values(themes).map((t) => (
                       <button
                         key={t.id}
                         onClick={() => setTheme(t.id)}
                         className={`
                           h-12 rounded-lg border-2 transition-all shadow-sm
                           ${theme === t.id ? 'border-gray-800 scale-105' : 'border-transparent hover:scale-105'}
                         `}
                         style={{ backgroundColor: t.id === 'warm' ? '#fdf6e3' : t.id === 'cool' ? '#e0f7fa' : t.id === 'pink' ? '#fce4ec' : '#f5f5f5' }}
                       />
                     ))}
                   </div>
                 </div>
                 
                 {/* Decoration & Font Grid */}
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Sticker</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['bear', 'star', 'cloud', 'crown', 'cross', 'dove'].map((deco) => (
                          <button
                            key={deco}
                            onClick={() => setDecoration(deco)}
                            className={`p-2 rounded border hover:bg-gray-50 flex justify-center ${decoration === deco ? 'border-gray-800 bg-gray-50' : 'border-gray-200'}`}
                          >
                            {deco === 'bear' && <Smile size={18} />}
                            {deco === 'star' && <Star size={18} />}
                            {deco === 'cloud' && <Cloud size={18} />}
                            {deco === 'crown' && <Crown size={18} />}
                            {deco === 'cross' && <span>✝</span>}
                            {deco === 'dove' && <Bird size={18} />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Font</label>
                      <div className="flex flex-col gap-2">
                        {[
                           { id: 'rounded', label: '동글' },
                           { id: 'hand', label: '손글씨' },
                           { id: 'serif', label: '명조' }
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFontStyle(f.id)}
                            className={`px-3 py-2 text-sm text-left rounded border ${fontStyle === f.id ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-200 hover:border-gray-400'}`}
                          >
                            {f.label}
                          </button>
                        ))}
                        
                        {/* Font Size Control */}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-1">
                             <span className="text-xs font-bold text-gray-400">SIZE</span>
                             <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-200">
                                <button 
                                  onClick={() => setFontScale(prev => Math.max(0.5, Number(prev) - 0.1))}
                                  className="p-1 rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-xs font-mono w-10 text-center font-bold text-gray-600">
                                  {Math.round(fontScale * 100)}%
                                </span>
                                <button 
                                  onClick={() => setFontScale(prev => Math.min(2.0, Number(prev) + 0.1))}
                                  className="p-1 rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                                >
                                  <Plus size={14} />
                                </button>
                             </div>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* View Mode */}
                 <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 block">Format</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'days', label: 'D-Day' },
                        { id: 'weeks', label: 'Weeks' },
                        { id: 'months', label: 'Months' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`flex-1 py-2 text-sm rounded border ${viewMode === mode.id ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 hover:border-gray-400'}`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                 </div>

               </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BabyDdayApp;
