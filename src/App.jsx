import React, { useState, useEffect } from "react";

// =========================
// CSS גלובלי
// =========================
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800;900&display=swap');

  * { box-sizing: border-box; }
  body { 
    font-family: 'Rubik', sans-serif; 
    overflow-x: hidden; 
    width: 100%; 
    margin: 0; 
    padding: 0;
  }
  .rtl { direction: rtl; }

  /* === טיפה נופלת מהפיפטה === */
  @keyframes drop-fall {
    0%   { transform: translateY(0px) scaleY(0.4); opacity: 0; }
    15%  { transform: translateY(4px) scaleY(1); opacity: 1; }
    80%  { transform: translateY(40px) scaleY(1); opacity: 0.8; }
    100% { transform: translateY(50px) scaleY(0.3); opacity: 0; }
  }
  .falling-drop {
    position: absolute;
    top: 38px;
    left: calc(50% - 4.5px);
    width: 9px; height: 13px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    transform-origin: top center;
    animation: drop-fall 0.5s linear infinite;
    z-index: 20;
  }

  /* === פיפטה === */
  .pipette-tip {
    position: relative;
    width: 11px; height: 40px;
    background: linear-gradient(to bottom, #e2e8f0, #f8fafc);
    border: 1.5px solid #94a3b8;
    border-radius: 3px 3px 5px 5px;
    z-index: 40;
  }
  .pipette-liquid {
    position: absolute;
    bottom: 2px; left: 2px; right: 2px;
    border-radius: 0 0 3px 3px;
    transition: height 0.4s;
  }

  /* === זכוכית המבחנה === */
  .tube-glass {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.45);
    border-left: 3px solid #cbd5e1;
    border-right: 3px solid #cbd5e1;
    border-bottom: 3px solid #cbd5e1;
    border-radius: 0 0 22px 22px;
    box-shadow: inset 2px 0 6px rgba(0,0,0,0.04), inset -2px 0 6px rgba(0,0,0,0.04);
    overflow: hidden;
    z-index: 10;
  }
  /* ברק על הזכוכית */
  .tube-glass::after {
    content: '';
    position: absolute;
    top: 4px; left: 4px;
    width: 3px; height: 60%;
    background: rgba(255,255,255,0.6);
    border-radius: 2px;
  }

  /* === אדים === */
  @keyframes steam {
    0%   { transform: translateY(0) scale(0.7); opacity: 0; }
    20%  { opacity: 0.6; }
    100% { transform: translateY(-38px) scale(1.6); opacity: 0; }
  }
  .steam {
    position: absolute;
    width: 11px; height: 11px;
    border-radius: 999px;
    background: rgba(255,255,255,0.75);
    filter: blur(3px);
    animation: steam 2.2s ease-out infinite;
  }

  /* === רטט ערבוב === */
  @keyframes jiggle {
    0%, 100% { transform: rotate(0deg); }
    20%  { transform: rotate(5deg); }
    50%  { transform: rotate(-5deg); }
    80%  { transform: rotate(4deg); }
  }
  .animate-jiggle {
    animation: jiggle 0.45s ease-in-out infinite;
    transform-origin: center bottom;
  }

  /* === ג'ל מתקשה === */
  @keyframes setGel {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-set-gel { animation: setGel 1.2s ease-out forwards; }

  /* === תוצאה: ג'ל נקרש (pulse ירוק) === */
  @keyframes gelPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
  }
  .gel-pulse { animation: gelPulse 1.5s ease-in-out 3; }

  /* === כרטיס שאלה === */
  .question-card {
    border-radius: 1.5rem;
    border: 2px solid #fde68a;
    background: white;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s;
    max-width: 100%;
  }
  .question-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09); }

  /* === התאמה למובייל (Scalable Bath) === */
  .bath-scale-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: visible;
  }
  .bath-scale-content {
    transform-origin: top center;
    width: max-content;
    transition: transform 0.3s ease;
  }
  @media (max-width: 768px) {
    .bath-scale-content {
      transform: scale(0.85);
      margin-bottom: -30px;
    }
  }
  @media (max-width: 640px) {
    .bath-scale-content {
      transform: scale(0.75);
      margin-bottom: -50px;
    }
  }
  @media (max-width: 480px) {
    .bath-scale-content {
      transform: scale(0.55);
      margin-bottom: -90px;
    }
  }
  @media (max-width: 380px) {
    .bath-scale-content {
      transform: scale(0.48);
      margin-bottom: -105px;
    }
  }
`;

// =========================
// כלי עזר
// =========================
const cx = (...cls) => cls.filter(Boolean).join(' ');

// =========================
// איור אננס
// =========================
const PineappleSVG = () => (
  <svg viewBox="0 0 120 180" className="w-32 md:w-48 h-auto drop-shadow-xl" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.15))' }}>
    <g fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" strokeLinejoin="round">
      <path d="M60 80 Q30 30 10 20 Q35 45 45 80 Z" />
      <path d="M60 80 Q90 30 110 20 Q85 45 75 80 Z" />
      <path d="M60 80 Q40 15 25 10 Q45 35 50 80 Z" fill="#43A047" />
      <path d="M60 80 Q80 15 95 10 Q75 35 70 80 Z" fill="#43A047" />
      <path d="M60 85 Q50 5 60 0 Q70 5 60 85 Z" fill="#2E7D32" />
      <path d="M60 85 Q35 40 20 45 Q40 60 52 85 Z" fill="#66BB6A" />
      <path d="M60 85 Q85 40 100 45 Q80 60 68 85 Z" fill="#66BB6A" />
    </g>
    <g transform="translate(60, 125)">
      <ellipse rx="42" ry="52" fill="#FBC02D" stroke="#E65100" strokeWidth="3"/>
      <g stroke="#E65100" strokeWidth="2" opacity="0.6">
        <line x1="-28" y1="-35" x2="28" y2="35" />
        <line x1="-10" y1="-48" x2="40" y2="15" />
        <line x1="-40" y1="-15" x2="10" y2="48" />
        <line x1="28" y1="-35" x2="-28" y2="35" />
        <line x1="10" y1="-48" x2="-40" y2="15" />
        <line x1="40" y1="-15" x2="-10" y2="48" />
      </g>
      <g fill="#F57F17">
        <circle cx="0" cy="0" r="2.5" />
        <circle cx="-18" cy="-24" r="2.5" />
        <circle cx="18" cy="24" r="2.5" />
        <circle cx="18" cy="-24" r="2.5" />
        <circle cx="-18" cy="24" r="2.5" />
        <circle cx="0" cy="-48" r="2" />
        <circle cx="0" cy="48" r="2" />
        <circle cx="-35" cy="0" r="2" />
        <circle cx="35" cy="0" r="2" />
      </g>
    </g>
  </svg>
);

// =========================
// איור 1
// =========================
const proteinPaths = [
  "M18,25 C18,5 40,5 45,25 C50,45 25,50 30,70 C35,90 55,75 65,90 C75,105 95,85 85,65 C75,45 55,60 50,40 C45,20 75,20 70,5 C65,-10 35,-5 40,15 C45,35 25,45 15,35 C5,25 15,40 18,25",
  "M85,35 C100,45 85,65 75,50 C65,35 85,10 65,15 C45,20 50,45 35,35 C20,25 5,45 15,65 C25,85 5,95 20,105 C35,115 55,90 45,70 C35,50 65,45 75,65 C85,85 105,85 95,65 C85,45 100,35 85,35",
  "M35,60 C45,75 30,95 15,85 C0,75 25,60 20,45 C15,30 35,20 45,35 C55,50 75,35 85,45 C95,55 75,80 65,70 C55,60 45,80 35,60"
];

const crossLinks = [
  {x1: 28, y1: 28, x2: 40, y2: 24},
  {x1: 22, y1: 52, x2: 32, y2: 62},
  {x1: 42, y1: 75, x2: 50, y2: 86},
  {x1: 55, y1: 52, x2: 65, y2: 62},
  {x1: 68, y1: 18, x2: 78, y2: 32},
  {x1: 75, y1: 48, x2: 85, y2: 60},
  {x1: 42, y1: 38, x2: 52, y2: 45},
  {x1: 20, y1: 78, x2: 32, y2: 72},
  {x1: 62, y1: 82, x2: 72, y2: 75}
];

const RenderProteins = ({ withLinks }) => (
  <svg viewBox="0 0 100 110" className="w-full h-full opacity-95 drop-shadow-md p-1">
    {proteinPaths.map((d, i) => (
      <path key={`out-${i}`} d={d} fill="none" stroke="#333333" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    ))}
    {proteinPaths.map((d, i) => (
      <path key={`in-${i}`} d={d} fill="none" stroke="#F8F9FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    ))}
    {proteinPaths.map((d, i) => (
      <path key={`str-${i}`} d={d} fill="none" stroke="#555555" strokeWidth="3" strokeDasharray="1 5" strokeLinecap="round" strokeLinejoin="round" />
    ))}
    {withLinks && crossLinks.map((link, i) => (
      <line key={`link-${i}`} x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
    ))}
  </svg>
);

const Figure1 = () => (
  <div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-xl flex flex-col items-center shadow-lg border border-stone-200">
    <h3 className="font-black text-stone-800 mb-6 text-base md:text-lg text-center">איור 1: השפעת הטמפרטורה על קרישה של תמיסת ג'לטין</h3>
    <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300 text-orange-900 font-black px-6 py-2 rounded-full mb-8 z-10 text-sm shadow-sm text-center">
      תמיסת החלבון ג'לטין
    </div>
    <div className="flex w-full justify-between relative px-2">
      <div className="flex flex-col items-center w-1/2 relative px-1 md:px-2">
        <div className="text-xs md:text-sm text-stone-700 font-bold text-center h-10 leading-tight">בטמפרטורה<br/>הנמוכה מ- 10°C</div>
        <div className="flex flex-col items-center my-3 text-blue-500">
           <svg width="24" height="40" viewBox="0 0 24 40">
             <path d="M12 0 L12 35" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" fill="none"/>
             <path d="M4 27 L12 38 L20 27" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <div className="bg-blue-100 border-2 border-blue-400 text-blue-900 font-black px-3 md:px-5 py-1.5 rounded-full shadow-sm mb-5 text-[11px] md:text-sm">נקרשת</div>
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#E1EFFE] to-[#BFDBFE] border-4 border-[#93C5FD] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner shrink-0">
          <RenderProteins withLinks={true} />
        </div>
        <div className="mt-3 text-center text-[10px] md:text-xs font-bold text-stone-600 leading-tight">
          קשרים בין<br/>שרשרות החלבון
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-stone-200 -translate-x-1/2"></div>
      <div className="flex flex-col items-center w-1/2 relative px-1 md:px-2">
        <div className="text-xs md:text-sm text-stone-700 font-bold text-center h-10 leading-tight">בטמפרטורה<br/>הגבוהה מ- 10°C</div>
        <div className="flex flex-col items-center my-3 text-orange-500">
           <svg width="24" height="40" viewBox="0 0 24 40">
             <path d="M12 0 L12 35" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" fill="none"/>
             <path d="M4 27 L12 38 L20 27" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <div className="bg-orange-100 border-2 border-orange-400 text-orange-900 font-black px-3 md:px-5 py-1.5 rounded-full shadow-sm mb-5 text-[11px] md:text-sm">לא נקרשת</div>
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#FFEDD5] to-[#FDBA74] border-4 border-[#F97316] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner shrink-0">
          <RenderProteins withLinks={false} />
        </div>
        <div className="mt-3 text-center text-[10px] md:text-xs font-bold text-stone-600 leading-tight">
          שרשרות<br/>חלבון
        </div>
      </div>
    </div>
  </div>
);

// =========================
// איור 2: פירוק ג'לטין
// =========================
const Figure2 = () => (
  <div className="bg-white p-6 rounded-2xl mb-8 w-full max-w-lg mx-auto flex flex-col items-center border border-stone-200 shadow-sm">
    <h3 className="text-center font-bold text-stone-800 mb-6 text-base">
      איור 2: פירוק הג'לטין לפפטידים באמצעות אנזימים
    </h3>
    <div className="flex flex-row items-center justify-center w-full max-w-sm flex-wrap md:flex-nowrap gap-2 md:gap-0">
      <div className="bg-white border border-stone-800 text-stone-800 px-4 py-1.5 text-sm whitespace-nowrap text-center">
        החלבון ג'לטין
      </div>
      <div className="flex flex-col items-center justify-center flex-1 px-2 relative md:-top-3 min-w-[120px]">
        <span className="text-sm text-stone-800 mb-1 whitespace-nowrap">אנזים מפרק חלבון</span>
        <div className="flex items-center w-full">
           <div className="flex-1 h-[1px] bg-stone-800"></div>
           <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-stone-800 border-b-[4px] border-b-transparent"></div>
        </div>
      </div>
      <div className="bg-white border border-stone-800 text-stone-800 px-4 py-1.5 text-sm whitespace-nowrap text-center">
        פפטידים
      </div>
    </div>
  </div>
);

const InfoBox = ({ title, children }) => (
  <div className="bg-yellow-50 border-r-8 border-yellow-400 p-5 rounded-2xl mb-8 shadow-sm">
    <h3 className="font-black text-yellow-900 text-base mb-2">{title}</h3>
    <div className="text-stone-800 text-sm leading-relaxed font-medium">{children}</div>
  </div>
);

// =========================
// רכיב מבחנה אוניברסלי
// =========================
const Tube = ({
  label, phase,
  pour1Phase, pour1Color, pour1Vol = 30, pour1DropColor, pour1Drops = 3,
  pour2Phase, pour2Color, pour2Vol = 30, pour2DropColor, pour2Drops = 3,
  pour3Phase, pour3Color, pour3Vol = 0, pour3DropColor, pour3Drops = 3,
  mixPhase, tiltPhase, gelPhase = 5,
  gelHeight,
  contents,
}) => {
  const isPouring1 = phase === pour1Phase;
  const isPouring2 = pour2Phase && phase === pour2Phase;
  const isPouring3 = pour3Phase && phase === pour3Phase;
  const isMixing   = phase === mixPhase;
  const isTilted   = phase >= tiltPhase;

  let fillPct = 0;
  if (phase >= pour1Phase) fillPct += pour1Vol;
  if (pour2Phase && phase >= pour2Phase) fillPct += pour2Vol;
  if (pour3Phase && phase >= pour3Phase) fillPct += pour3Vol;

  const isGelled = phase >= gelPhase && gelHeight > 0;
  const isFullyGelled = isGelled && gelHeight >= fillPct - 1; 
  
  const liquidHeight = (phase >= tiltPhase && isGelled && !isFullyGelled) ? Math.max(0, fillPct - gelHeight) : fillPct;
  const liquidBottom = (phase >= tiltPhase && isGelled && !isFullyGelled) ? gelHeight : 0;
  const liquidOpacity = isFullyGelled ? 0 : (liquidHeight > 0 ? 0.88 : 0);
  
  let finalColor = pour1Color;
  if (pour2Phase && phase >= pour2Phase) finalColor = pour2Color;
  if (pour3Phase && phase >= pour3Phase) finalColor = pour3Color;

  let gelStatusStr = '';
  if (phase >= gelPhase) {
    if (gelHeight >= 58) gelStatusStr = 'נקרש';
    else if (gelHeight > 0) gelStatusStr = 'נקרש חלקית';
    else gelStatusStr = 'לא נקרש';
  }

  const tiltDeg = isTilted ? 45 : 0;

  const [dropsVisible, setDropsVisible] = useState(false);
  const [dropColor, setDropColor] = useState(pour1Color);
  const [dropCount, setDropCount] = useState(3);

  useEffect(() => {
    if (isPouring1) { setDropColor(pour1DropColor || pour1Color); setDropCount(pour1Drops); setDropsVisible(true); }
    else if (isPouring2) { setDropColor(pour2DropColor || pour2Color); setDropCount(pour2Drops); setDropsVisible(true); }
    else if (isPouring3) { setDropColor(pour3DropColor || pour3Color); setDropCount(pour3Drops); setDropsVisible(true); }
    else { setDropsVisible(false); }

    if (isPouring1 || isPouring2 || isPouring3) {
      const t = setTimeout(() => setDropsVisible(false), 1400); 
      return () => clearTimeout(t);
    }
  }, [phase, isPouring1, isPouring2, isPouring3, pour1Color, pour2Color, pour3Color, pour1DropColor, pour2DropColor, pour3DropColor, pour1Drops, pour2Drops, pour3Drops]);

  return (
    <div className="flex flex-col items-center relative w-[56px] mb-6 shrink-0">
      <div className="relative w-full h-[155px] flex justify-center">
        <div
          className={cx(
            'absolute inset-0 origin-[50%_72%] transition-transform duration-[1400ms] ease-in-out',
            isMixing ? 'animate-jiggle' : ''
          )}
          style={{ transform: `rotate(${tiltDeg}deg)` }}
        >
          {dropsVisible && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-40 flex flex-col items-center transition-opacity duration-200">
              <div className="pipette-tip">
                <div className={cx('pipette-liquid', dropColor)} style={{ height: '55%' }} />
              </div>
              {[...Array(dropCount)].map((_, i) => (
                <div key={i} className={cx('falling-drop', dropColor)} style={{ animationDelay: `${i * 0.3}s`, animationIterationCount: 1, animationFillMode: 'forwards' }} />
              ))}
            </div>
          )}

          <div className="tube-glass">
            <div
              className={cx('absolute bottom-0 w-full z-10 duration-1000 ease-in-out', isGelled && isTilted ? 'gel-pulse' : '')}
              style={{ transitionProperty: 'opacity', height: `${gelHeight}%`, opacity: isGelled ? 1 : 0 }}
            >
              <div className={cx('w-full h-full border-t-[3px] border-white/60 brightness-95 contrast-125', finalColor)} />
            </div>
            <div
              className="absolute w-full z-0 overflow-visible duration-1000 ease-in-out"
              style={{ transitionProperty: 'opacity, height, bottom', bottom: `${liquidBottom}%`, height: `${liquidHeight}%`, opacity: liquidOpacity }}
            >
              <div
                className="absolute origin-top transition-transform duration-[1400ms]"
                style={{ width: '300px', height: '300px', left: '50%', transform: isTilted ? `translateX(-50%) rotate(${-tiltDeg}deg) translateY(-8px)` : 'translateX(-50%) rotate(0deg)' }}
              >
                <div className={cx('w-full h-full', finalColor)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[162px] bg-white border border-stone-200 rounded-xl p-2 shadow-sm w-[100px] md:w-[115px] flex flex-col items-center gap-1 z-30">
        <div className="font-black text-amber-950 text-xs border-b border-amber-200 w-full text-center pb-1 mb-1">
          מבחנה {label}
        </div>
        <div className="text-[9px] text-stone-600 font-bold text-center leading-[1.2] min-h-[32px] flex flex-col justify-center">
          {phase >= pour1Phase && <span>{contents[0]}</span>}
          {pour2Phase && phase >= pour2Phase && <span>{contents[1]}</span>}
          {pour3Phase && phase >= pour3Phase && <span>{contents[2]}</span>}
        </div>
        {phase >= tiltPhase && gelStatusStr && (
          <span className={cx(
            'mt-1 w-full px-1 py-1 rounded-xl text-[10px] font-black border text-center block',
            gelStatusStr === 'נקרש' ? 'bg-lime-100 text-lime-900 border-lime-400' : gelStatusStr === 'נקרש חלקית' ? 'bg-yellow-100 text-yellow-900 border-yellow-400' : 'bg-rose-100 text-rose-900 border-rose-400'
          )}>
            {gelStatusStr === 'נקרש' ? 'נקרש ✓' : gelStatusStr === 'נקרש חלקית' ? 'נקרש חלקית' : 'לא נקרש ✗'}
          </span>
        )}
      </div>
    </div>
  );
};

// =========================
// רכיב אמבט (תומך הקטנה במובייל)
// =========================
const BathContainer = ({ phase, bathPhase1, bathPhase2, children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (phase === bathPhase1) setTimeLeft(5 * 60); 
    else if (phase === bathPhase2) setTimeLeft(8 * 60); 
    else setTimeLeft(0);
  }, [phase, bathPhase1, bathPhase2]);
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => { setTimeLeft(t => Math.max(0, t - 15)); }, 100);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <div className="relative w-full max-w-5xl mx-auto bg-stone-50 border-4 border-stone-200 rounded-3xl overflow-hidden shadow-inner flex flex-col items-center">
      <div className="bath-scale-wrapper">
        <div className="bath-scale-content flex flex-col items-center relative pb-[185px] px-2 md:px-12">
          
          <div className="h-16 w-full flex flex-col items-center justify-center mt-4 z-30">
            {phase === bathPhase1 && (
              <>
                <span className="text-orange-900 text-base font-black bg-white/95 px-7 py-1.5 rounded-full shadow border-2 border-orange-300 mb-1">🌡 אמבט 1 — 37°C–40°C</span>
                <div className="text-xl font-mono font-black text-orange-700 bg-orange-100 px-4 py-0.5 rounded-full border border-orange-300">⏱️ {formatTime(timeLeft)}</div>
              </>
            )}
            {phase === bathPhase2 && (
              <>
                <span className="text-sky-900 text-base font-black bg-white/95 px-7 py-1.5 rounded-full shadow border-2 border-sky-300 mb-1">❄ אמבט 2 — קירור מתחת ל-10°C</span>
                <div className="text-xl font-mono font-black text-sky-700 bg-sky-100 px-4 py-0.5 rounded-full border border-sky-300">⏱️ {formatTime(timeLeft)}</div>
              </>
            )}
          </div>
          
          <div className="relative flex justify-center gap-6 md:gap-12 pt-3 z-10 w-full">
            {children}
          </div>
          
          <div className={cx('absolute left-0 right-0 bottom-[185px] transition-all duration-1000 z-0', phase === bathPhase1 ? 'bg-orange-400/20 border-t-[3px] border-orange-300 opacity-100' : phase === bathPhase2 ? 'bg-sky-500/20 border-t-[3px] border-sky-300 opacity-100' : 'opacity-0 pointer-events-none')} style={{ height: (phase === bathPhase1 || phase === bathPhase2) ? '110px' : '0' }}>
            {phase === bathPhase1 && (
              <>
                <div className="steam" style={{ left: '20%', top: '8%' }} />
                <div className="steam" style={{ left: '50%', top: '4%', animationDelay: '0.9s' }} />
                <div className="steam" style={{ left: '78%', top: '12%', animationDelay: '1.7s' }} />
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// =========================
// MCQ Component
// =========================
const MCQ = ({ qNum, points, question, options, correctIndex, explanation, onScore }) => {
  const [selected, setSelected]   = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected === correctIndex;
  const submit = () => { if (selected === null) return; setSubmitted(true); onScore?.(qNum, isCorrect ? points : 0, points); };
  return (
    <div className="question-card">
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <span className="bg-amber-500 text-white px-3 py-1 rounded-xl text-sm font-black shadow-sm shrink-0">שאלה {qNum}</span>
        <div className="flex-1 font-bold text-stone-800 text-sm md:text-base leading-relaxed whitespace-pre-line">{question}</div>
        <span className="bg-orange-100 text-orange-900 px-3 py-1 rounded-full text-xs font-black shrink-0 self-start">{points} נק'</span>
      </div>
      <div className="flex flex-col gap-2.5 mb-4">
        {options.map((opt, i) => {
          let cls = 'text-right p-3.5 rounded-xl border-2 text-sm leading-relaxed transition-all ';
          if (!submitted) { cls += selected === i ? 'bg-yellow-50 border-yellow-400 font-bold text-yellow-900 shadow-sm' : 'bg-stone-50 border-stone-200 hover:bg-yellow-50/50 cursor-pointer hover:border-yellow-300'; }
          else { if (i === correctIndex) cls += 'bg-lime-50 border-lime-500 font-bold text-lime-900'; else if (i === selected) cls += 'bg-rose-50 border-rose-400 font-bold text-rose-900'; else cls += 'bg-stone-50/30 border-stone-100 opacity-50 text-stone-400'; }
          return (
            <button key={i} className={cls} onClick={() => !submitted && setSelected(i)} disabled={submitted}>
              <span className="font-black text-stone-400 ml-2">{['א', 'ב', 'ג', 'ד'][i]}.</span> {opt}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={submit} disabled={selected === null} className="px-7 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:bg-stone-300 transition-colors shadow-sm text-sm">
          בדוק תשובה
        </button>
      )}
      {submitted && (
        <div className={cx('mt-4 p-4 rounded-2xl border-2', isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-rose-50 border-rose-300')}>
          <div className={cx('font-black mb-2', isCorrect ? 'text-lime-800' : 'text-rose-800')}>{isCorrect ? '✅ תשובה נכונה! כל הכבוד.' : '❌ תשובה שגויה — הסבר:'}</div>
          <div className="text-stone-700 text-sm leading-relaxed font-medium whitespace-pre-line">{explanation}</div>
        </div>
      )}
    </div>
  );
};

const MeasuringCylinder = ({ label, volume, isVisible }) => {
  const maxVol = 3.0; 
  const heightPct = volume > 0 ? (volume / maxVol) * 100 : 0;
  return (
    <div className={cx('flex flex-col items-center transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
      <div className="text-xs font-black text-amber-900 mb-2 bg-white px-2.5 py-1 rounded-full shadow-sm border border-stone-200">משורה {label}</div>
      <div className="relative w-11 h-36 border-x-[3px] border-b-[3px] border-stone-400 bg-white/80 flex flex-col justify-end overflow-hidden rounded-b-lg shadow-inner">
        <div className="absolute inset-y-1 left-0 w-2 flex flex-col justify-between py-1 z-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full border-t border-stone-300" />
          ))}
        </div>
        <div className="w-full bg-amber-300 border-t-4 border-amber-400 transition-all duration-[1800ms] ease-out" style={{ height: isVisible ? `${heightPct}%` : '0%' }} />
      </div>
      <div className="mt-2.5 font-black text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full text-xs border border-amber-300 shadow-sm">{volume} מ"ל</div>
    </div>
  );
};

const PhaseText = ({ text }) => ( <div className="bg-amber-100 text-amber-950 rounded-2xl px-4 md:px-6 py-3.5 font-bold text-sm md:text-base text-center mb-8 border border-amber-300 shadow-sm">{text}</div> );

const StepBtn = ({ label, onClick, disabled, color = 'stone' }) => {
  const colors = { amber: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300', sky: 'bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300', orange: 'bg-orange-400 hover:bg-orange-500 text-orange-950 border-orange-500', blue: 'bg-blue-200 hover:bg-blue-300 text-blue-950 border-blue-400', emerald: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-400', lime: 'bg-lime-400 hover:bg-lime-500 text-lime-950 border-lime-600', rose: 'bg-stone-800 hover:bg-stone-900 text-white border-stone-700', stone: 'bg-stone-200 hover:bg-stone-300 text-stone-900 border-stone-400' };
  return ( <button onClick={onClick} disabled={disabled} className={cx('px-3 md:px-4 py-2 rounded-xl font-bold border-2 text-xs transition-colors shadow-sm disabled:opacity-35 disabled:cursor-not-allowed', colors[color] || colors.stone)}>{label}</button> );
};

// =========================
// חלק א'
// =========================
const PartA = ({ onScore }) => {
  const [phase, setPhase] = useState(0);
  const phaseLabels = [
    'לחצו על השלבים כדי להתחיל את הניסוי.',
    'שלב 1: הוספת 2 מ"ל תמיסת ג\'לטין (חסרת צבע) לכל אחת ממבחנות A, B, C.',
    'שלב 2: הוספת 1 מ"ל טריפסין ל-A | 1 מ"ל מיצוי אננס ל-B | 1 מ"ל מים ל-C. שימו לב לשינוי הצבע במבחנה B.',
    'שלב 3: ערבוב כל המבחנות בטלטול קל.',
    'שלב 4: הכנסת המבחנות לאמבט 1 (37°C–40°C) למשך 5 דקות — פעילות אנזימטית.',
    'שלב 5: העברה לאמבט 2 (קירור, מתחת ל-10°C) למשך 8 דקות — קרישת ג\'לטין.',
    'שלב 6: הטיית כל המבחנות בזווית 45 מעלות כדי לבדוק באיזה מבחנה נקרש הנוזל.',
  ];

  return (
    <section className="mb-16">
      <h2 className="text-xl md:text-2xl font-black mb-6 text-amber-900 border-b-4 border-amber-300 pb-2 inline-block">חלק א' — השפעת מיצוי אננס על החלבון ג'לטין</h2>
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-100 mb-6 text-stone-800 text-sm md:text-base leading-relaxed font-medium shadow-sm">
        <p className="mb-3">בתעשיית המזון משתמשים בחלבון ג'לטין להכנת קינוחים, שכן הג'לטין נקרש בטמפרטורה הנמוכה מ-10°C ויוצר מרקם ג'לי. בטמפרטורות נמוכות נוצרים קשרים בין שרשרות החלבון עד שנוצר מבנה רשת, כפי שמתואר באיור 1.</p>
        <p>בניסוי זה נבדוק את השפעת אנזימים מפרקי חלבון (פרוטאזות) על תהליך הקרישה.</p>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-amber-100 mb-6 max-w-4xl mx-auto shadow-sm flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex-shrink-0 flex justify-center w-24 md:w-48"><PineappleSVG /></div>
        <div className="flex-1 w-full max-w-lg flex justify-center"><Figure1 /></div>
      </div>
      <InfoBox title="💡 לידיעתך:">טריפסין הוא אנזים המזרז פירוק חלבונים, ובהם ג'לטין, לשרשרות קצרות הנקראות <strong>פפטידים. הפפטידים אינם נקרשים בטמפרטורה הנמוכה מ-10°C</strong> (שכן הם קצרים מדי ליצירת מבנה רשת).</InfoBox>
      <Figure2 />
      <div className="bg-white border-2 border-amber-200 rounded-3xl shadow-md p-4 md:p-8 mb-8">
        <h3 className="font-black text-amber-900 text-lg mb-5 text-center">מעבדת הניסוי — חלק א'</h3>
        <PhaseText text={phaseLabels[phase]} />
        <BathContainer phase={phase} bathPhase1={4} bathPhase2={5}>
          <Tube label="C" phase={phase} gelPhase={5}
            pour1Phase={1} pour1Color="bg-blue-200" pour1Vol={40}
            pour2Phase={2} pour2Color="bg-blue-200" pour2Vol={20}
            mixPhase={3} tiltPhase={6} gelHeight={60}
            contents={['2 מ"ל ג\'לטין', '1 מ"ל מים']}
          />
          <Tube label="B" phase={phase} gelPhase={5}
            pour1Phase={1} pour1Color="bg-blue-200" pour1Vol={40}
            pour2Phase={2} pour2Color="bg-yellow-400" pour2Vol={20}
            mixPhase={3} tiltPhase={6} gelHeight={0}
            contents={['2 מ"ל ג\'לטין', '1 מ"ל מיצוי אננס']}
          />
          <Tube label="A" phase={phase} gelPhase={5}
            pour1Phase={1} pour1Color="bg-blue-200" pour1Vol={40}
            pour2Phase={2} pour2Color="bg-blue-200" pour2Vol={20}
            mixPhase={3} tiltPhase={6} gelHeight={0}
            contents={['2 מ"ל ג\'לטין', '1 מ"ל טריפסין']}
          />
        </BathContainer>
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <StepBtn label="1: ג'לטין" onClick={() => setPhase(1)} disabled={phase >= 1} color="amber" />
          <StepBtn label="2: הוספת חומרים" onClick={() => setPhase(2)} disabled={phase < 1 || phase >= 2} color="sky" />
          <StepBtn label="3: ערבוב" onClick={() => setPhase(3)} disabled={phase < 2 || phase >= 3} color="stone" />
          <StepBtn label="4: אמבט חם" onClick={() => setPhase(4)} disabled={phase < 3 || phase >= 4} color="orange" />
          <StepBtn label="5: קירור" onClick={() => setPhase(5)} disabled={phase < 4 || phase >= 5} color="blue" />
          <StepBtn label="6: הטיה" onClick={() => setPhase(6)} disabled={phase < 5 || phase >= 6} color="emerald" />
          <StepBtn label="↺ איפוס" onClick={() => setPhase(0)} color="rose" />
        </div>
        <div className="w-full max-w-full">
          <div className="mt-10 overflow-x-auto bg-amber-50/40 p-4 md:p-5 rounded-2xl border border-amber-100 max-w-full">
            <h4 className="font-black text-center text-amber-900 mb-1 text-base">טבלה 1</h4>
            <p className="text-center text-xs text-stone-500 mb-3">הטבלה מתמלאת אוטומטית לפי שלבי הניסוי</p>
            <table className="w-full text-center border-collapse bg-white rounded-2xl overflow-hidden text-xs md:text-sm border border-amber-200 shadow-sm" style={{ minWidth: '550px' }}>
              <thead className="bg-stone-100 text-stone-700 font-bold">
                <tr>
                  <th className="p-2.5 border border-stone-200">מבחנה</th>
                  <th className="p-2.5 border border-stone-200">ג'לטין (מ"ל)</th>
                  <th className="p-2.5 border border-stone-200">מיצוי אננס (מ"ל)</th>
                  <th className="p-2.5 border border-stone-200">טריפסין (מ"ל)</th>
                  <th className="p-2.5 border border-stone-200">מים (מ"ל)</th>
                  <th className="p-2.5 border border-stone-200 bg-amber-100 text-amber-900 font-black">תוצאת קרישה</th>
                </tr>
              </thead>
              <tbody className="text-stone-700 font-medium">
                {[
                  { id: 'A', j: '2', p: '0', t: '1', w: '0', r: 'לא נקרש / −', rc: 'text-rose-600' },
                  { id: 'B', j: '2', p: '1', t: '0', w: '0', r: 'לא נקרש / −', rc: 'text-rose-600' },
                  { id: 'C', j: '2', p: '0', t: '0', w: '1', r: 'נקרש / +',    rc: 'text-lime-700' },
                ].map(row => (
                  <tr key={row.id} className="border-b border-amber-50 hover:bg-amber-50 transition-colors">
                    <td className="p-2.5 border border-stone-100 font-black bg-stone-50">{row.id}</td>
                    <td className="p-2.5 border border-stone-100">{phase >= 1 ? row.j : '—'}</td>
                    <td className="p-2.5 border border-stone-100">{phase >= 2 ? row.p : '—'}</td>
                    <td className="p-2.5 border border-stone-100">{phase >= 2 ? row.t : '—'}</td>
                    <td className="p-2.5 border border-stone-100">{phase >= 2 ? row.w : '—'}</td>
                    <td className={cx('p-2.5 border border-stone-100 font-bold', row.rc)}>{phase >= 6 ? row.r : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MCQ qNum="61א" points={5} onScore={onScore}
        question="מהי הכותרת המתאימה לטבלה 1?"
        options={[
          "תיאור השפעת נפח המים, תמיסת הטריפסין ומיצוי האננס על קצב הקרישה של חלבון הג'לטין.",
          "השפעת נוכחות אנזימים (טריפסין ומיצוי אננס) על קרישת הג'לטין.",
          "השפעת טמפרטורת האמבט החם (37 מעלות) וזמן השהייה בו על צבע תמיסת הג'לטין במבחנות השונות.",
          "מעקב אחר שינוי נפח תמיסת הג'לטין במבחנות כתוצאה מהוספה של מיצוי אננס לאורך זמן ממושך."
        ]}
        correctIndex={1}
        explanation={`כותרת טבלה תקינה בביולוגיה צריכה לכלול את המשתנה הבלתי תלוי (החומרים שהוספו - טריפסין/אננס/מים) והמשתנה התלוי (התוצאה הנמדדת - קרישת הג'לטין).`}
      />
      <MCQ qNum="61ב" points={5} onScore={onScore}
        question="על סמך תוצאות שלב 6, איזה מהמשפטים הבאים מתאר נכונה את מצב הקרישה בכל אחת מהמבחנות A, B, C?"
        options={["A - לא נקרש, B - לא נקרש, C - נקרש.", "A - נקרש, B - לא נקרש, C - נקרש.", "A - נקרש, B - נקרש, C - לא נקרש.", "A - לא נקרש, B - נקרש, C - נקרש."]}
        correctIndex={0}
        explanation={`מבחנה A (טריפסין) ומבחנה B (ברומלין מאננס) מכילות אנזימים שמפרקים את הג'לטין - לכן הוא לא נקרש. מבחנה C (מים) משמשת כבקרה ובה החלבון נשאר שלם ונקרש.`}
      />
      <MCQ qNum="62א" points={5} onScore={onScore}
        question="מהי החשיבות של שהיית המבחנות באמבט 1 (37°C-40°C) לפני העברתן לאמבט הקירור (אמבט 2)?"
        options={["הטמפרטורה הגבוהה גורמת לדנטורציה מהירה של האנזימים, ומבטיחה שהג'לטין יישאר שלם לחלוטין וייקרש.", "הטמפרטורה באמבט 1 מתאימה ומאפשרת לפירוק אנזימטי יעיל ומיטבי של החלבון / ג'לטין על ידי האנזימים.", "השהייה באמבט החם נחוצה על מנת לאדות את עודפי המים מן התמיסה, תהליך שמעלה את ריכוז הג'לטין לפני הקירור.", "הטמפרטורה החמימה גורמת לחלבון הג'לטין להיקרש באופן מיידי, כך ששלב הקירור נועד רק לשמר את המצב המוצק."]}
        correctIndex={1}
        explanation={`אמבט 1 (37-40 מעלות) מספק טמפרטורה מתאימה לפירוק אנזימתי של החלבון / ג'לטין. בטמפרטורה זו האנזימים פועלים בקצב טוב כדי להספיק ולפרק את מולקולות החלבון לפני שמקררים.`}
      />
      <MCQ qNum="62ב" points={6} onScore={onScore}
        question="מהו ההסבר להבדל בתוצאות הקרישה בין מבחנה C (מים) לבין מבחנות A (טריפסין) ו-B (מיצוי אננס)?"
        options={["תוספת המים במבחנה C ממיסה לחלוטין את הג'לטין ומונעת יצירת רשת, בעוד שהאנזימים שבמבחנות A ו-B מעודדים ומזרזים את תהליך יצירת קשרי החלבון.", "במבחנות A ו-B מולקולות האנזים ספחו אליהן את כל תמיסת המים ביעילות, וכך למעשה לא נותרה תמיסת ג'לטין חופשית שתוכל לעבור תהליך קרישה לאחר שלב החימום.", "הטריפסין ומיצוי האננס משנים לחלוטין את התכונות הפיזיקליות של התמיסה ומורידים את טמפרטורת הקרישה הטבעית שלה אל הרבה מתחת לאפס מעלות ולכן היא נוזלית.", "למבחנות A ו-B הוספו אנזימים (טריפסין ומיצוי אננס) המזרזים את פירוק החלבון ג'לטין לשרשראות קצרות (פפטידים) שאינן נקרשות. במבחנה C אין אנזים ולכן הג'לטין נקרש."]}
        correctIndex={3}
        explanation={`למבחנה A הוסף האנזים טריפסין המזרז פירוק ג'לטין ולכן אין קרישה. למבחנה B הוספנו מיצוי אננס המזרז פירוק חלבון, ותוצרי הפירוק (פפטידים) לא נקרשים. במבחנה C לא היה אנזים ולכן הג'לטין נקרש.`}
      />
    </section>
  );
};

// =========================
// חלק ב'
// =========================
const PartB = ({ onScore }) => {
  const [phase, setPhase] = useState(0);
  const phaseLabels = [
    'לחצו כדי להתחיל את ניסוי העיכוב.',
    'שלב 1: הוספת 1 מ"ל מיצוי אננס למבחנות 1-4 | הוספת 1 מ"ל מים למבחנה 5.',
    'שלב 2: הוספת 2 טיפות מעכב (נחושת גופרתית) בריכוזים יורדים למבחנות 1-3 | טיפות מים ל-4-5.',
    'שלב 3: הוספת 2 מ"ל תמיסת ג\'לטין לכל המבחנות. (טיפות תכלת)',
    'שלב 4: ערבוב כל החומרים.',
    'שלב 5: אמבט 1 (37°C–40°C) — 5 דקות. (קווי קרישה לא נראים עדיין)',
    'שלב 6: אמבט 2 (קירור מתחת ל-10°C) — 8 דקות. (הקרישה מתחילה)',
    'שלב 7: הטיית כל המבחנות 45°. שימו לב להבדלים בכמות הנוזל שנותרה ישרה לעומת הג\'ל שנוטה.',
    'שלב 8: איסוף הנוזל שלא נקרש (הפפטידים) מכל מבחנה אל המשורה למדידת נפחו.',
  ];

  const gelHeights = [60, 40, 20, 0, 60];

  const q63Question = (
    <div className="flex flex-col gap-3">
      <div>ריכוז התחלתי של תמיסת נחושת גופרתית הוא 2%. החישוב של תמיסת נחושת גופרתית שהתקבל מפורט בטבלה 2.</div>
      <div className="overflow-x-auto w-full my-2">
        <h4 className="font-black text-amber-900 mb-2 text-base text-right">טבלה 2</h4>
        <table className="w-full text-center border-collapse bg-white rounded-xl overflow-hidden text-xs md:text-sm border border-amber-200 shadow-sm">
          <thead className="bg-amber-100 text-amber-900 font-bold">
            <tr>
              <th className="p-2 border border-amber-200">המבחנה</th>
              <th className="p-2 border border-amber-200">נפח תמיסת נחושת גופרתית</th>
              <th className="p-2 border border-amber-200">נפח המים (מ"ל)</th>
              <th className="p-2 border border-amber-200">ריכוז תמיסת נחושת גופרתית</th>
            </tr>
          </thead>
          <tbody className="text-stone-700 font-medium">
            <tr className="border-b border-amber-50">
              <td className="p-2 border border-amber-100 font-bold bg-stone-50">a</td>
              <td className="p-2 border border-amber-100">1 מ"ל תמיסת נחושת גופרתית 2%</td>
              <td className="p-2 border border-amber-100">9</td>
              <td className="p-2 border border-amber-100 font-bold text-amber-600">?</td>
            </tr>
            <tr>
              <td className="p-2 border border-amber-100 font-bold bg-stone-50">b</td>
              <td className="p-2 border border-amber-100 font-bold">1 מ"ל תמיסת נחושת גופרתית ממבחנה a</td>
              <td className="p-2 border border-amber-100">9</td>
              <td className="p-2 border border-amber-100 font-bold text-amber-600">?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="font-bold">מהו הריכוז של תמיסת נחושת גופרתית שהתקבל במבחנות a ו- b?</div>
    </div>
  );

  return (
    <section className="mb-16">
      <h2 className="text-xl md:text-2xl font-black mb-6 text-amber-900 border-b-4 border-amber-300 pb-2 inline-block">חלק ב' — עיכוב פעילות האנזים ממיצוי אננס</h2>
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-100 mb-6 text-stone-800 text-sm md:text-base leading-relaxed font-medium shadow-sm">
        <p>בחלק זה נבדוק כיצד ריכוזים שונים של <strong>נחושת גופרתית</strong> (מעכב) משפיעים על פעילות האנזים ממיצוי האננס. ככל שהמעכב יעיל יותר — כך יישאר יותר ג'לטין שלם שייקרש, ופחות פפטידים יווצרו.</p>
      </div>
      <InfoBox title="🧪 לידיעתך 2:">נחושת גופרתית מעכבת את פעילות האנזים המפרק חלבון. <strong>המדד לפעילות האנזים: נפח הנוזל (פפטידים) שאינו נקרש ונאסף מהמבחנה.</strong></InfoBox>
      
      <MCQ qNum="63" points={6} onScore={onScore}
        question={q63Question}
        options={["מבחנה a: 0.5%, מבחנה b: 0.05% מתוך הנפח הכולל במבחנות האחרות.", "מבחנה a: 0.2%, מבחנה b: 0.02% לאחר מיהול עשרוני חוזר בכל שלב.", "מבחנה a: 1.0%, מבחנה b: 0.10% מכיוון שהוספנו מ\"ל אחד בכל פעם.", "מבחנה a: 0.02%, מבחנה b: 0.2% ביחס הפוך לכמות המים שהוספנו."]}
        correctIndex={1}
        explanation={`בכל שלב מבצעים מיהול עשרוני (פי 10). \nמבחנה a: 1 מ"ל (מתוך 10 מ"ל סה"כ) שווה למיהול 1:10 מהתמיסה המקורית (2%) ולכן 2% / 10 = 0.2%.\nמבחנה b: 1 מ"ל ממבחנה a (מתוך 10 מ"ל סה"כ) שווה למיהול 1:10 מריכוז a (0.2%) ולכן 0.2% / 10 = 0.02%.`}
      />
      
      <div className="bg-white border-2 border-amber-200 rounded-3xl shadow-md p-4 md:p-8 mb-8 mt-8">
        <h3 className="font-black text-amber-900 text-lg mb-5 text-center">מעבדת הניסוי — חלק ב'</h3>
        <PhaseText text={phaseLabels[phase]} />
        <BathContainer phase={phase} bathPhase1={5} bathPhase2={6}>
          <Tube label="1" phase={phase} gelPhase={6}
            pour1Phase={1} pour1Color="bg-yellow-400" pour1Vol={20}
            pour2Phase={2} pour2Color="bg-yellow-400" pour2Vol={10} pour2DropColor="bg-blue-600" pour2Drops={2}
            pour3Phase={3} pour3Color="bg-yellow-400" pour3Vol={30} pour3DropColor="bg-blue-200"
            mixPhase={4} tiltPhase={7} gelHeight={gelHeights[0]} contents={['1 מ"ל אננס', 'טיפות מעכב 2%', '2 מ"ל ג\'לטין']}
          />
          <Tube label="2" phase={phase} gelPhase={6}
            pour1Phase={1} pour1Color="bg-yellow-400" pour1Vol={20}
            pour2Phase={2} pour2Color="bg-yellow-400" pour2Vol={10} pour2DropColor="bg-blue-600" pour2Drops={2}
            pour3Phase={3} pour3Color="bg-yellow-400" pour3Vol={30} pour3DropColor="bg-blue-200"
            mixPhase={4} tiltPhase={7} gelHeight={gelHeights[1]} contents={['1 מ"ל אננס', 'טיפות מעכב 0.2%', '2 מ"ל ג\'לטין']}
          />
          <Tube label="3" phase={phase} gelPhase={6}
            pour1Phase={1} pour1Color="bg-yellow-400" pour1Vol={20}
            pour2Phase={2} pour2Color="bg-yellow-400" pour2Vol={10} pour2DropColor="bg-blue-600" pour2Drops={2}
            pour3Phase={3} pour3Color="bg-yellow-400" pour3Vol={30} pour3DropColor="bg-blue-200"
            mixPhase={4} tiltPhase={7} gelHeight={gelHeights[2]} contents={['1 מ"ל אננס', 'טיפות מעכב 0.02%', '2 מ"ל ג\'לטין']}
          />
          <Tube label="4" phase={phase} gelPhase={6}
            pour1Phase={1} pour1Color="bg-yellow-400" pour1Vol={20}
            pour2Phase={2} pour2Color="bg-yellow-400" pour2Vol={10} pour2DropColor="bg-blue-200" pour2Drops={2}
            pour3Phase={3} pour3Color="bg-yellow-400" pour3Vol={30} pour3DropColor="bg-blue-200"
            mixPhase={4} tiltPhase={7} gelHeight={gelHeights[3]} contents={['1 מ"ל אננס', 'טיפות מים', '2 מ"ל ג\'לטין']}
          />
          <Tube label="5" phase={phase} gelPhase={6}
            pour1Phase={1} pour1Color="bg-blue-200" pour1Vol={20}
            pour2Phase={2} pour2Color="bg-blue-200" pour2Vol={10} pour2DropColor="bg-blue-200" pour2Drops={2}
            pour3Phase={3} pour3Color="bg-blue-200" pour3Vol={30} pour3DropColor="bg-blue-200"
            mixPhase={4} tiltPhase={7} gelHeight={gelHeights[4]} contents={['1 מ"ל מים', 'טיפות מים', '2 מ"ל ג\'לטין']}
          />
        </BathContainer>
        {phase >= 8 && (
          <div className="rounded-3xl border-4 border-stone-200 bg-stone-50 shadow-inner flex flex-wrap justify-center items-end py-10 gap-4 sm:gap-8 mb-6 mt-8">
            {[{ l: '1', v: 0.0 }, { l: '2', v: 1.0 }, { l: '3', v: 2.0 }, { l: '4', v: 3.0 }, { l: '5', v: 0.0 }].map(m => (
              <MeasuringCylinder key={m.l} label={m.l} volume={m.v} isVisible={phase >= 8} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <StepBtn label="1: מיצוי אננס / מים" onClick={() => setPhase(1)} disabled={phase >= 1} color="sky" />
          <StepBtn label="2: הוספת מעכב" onClick={() => setPhase(2)} disabled={phase < 1 || phase >= 2} color="blue" />
          <StepBtn label="3: ג'לטין" onClick={() => setPhase(3)} disabled={phase < 2 || phase >= 3} color="amber" />
          <StepBtn label="4: ערבוב" onClick={() => setPhase(4)} disabled={phase < 3 || phase >= 4} color="stone" />
          <StepBtn label="5: אמבט חם" onClick={() => setPhase(5)} disabled={phase < 4 || phase >= 5} color="orange" />
          <StepBtn label="6: קירור" onClick={() => setPhase(6)} disabled={phase < 5 || phase >= 6} color="blue" />
          <StepBtn label="7: הטיה" onClick={() => setPhase(7)} disabled={phase < 6 || phase >= 7} color="lime" />
          <StepBtn label="8: משורה" onClick={() => setPhase(8)} disabled={phase < 7 || phase >= 8} color="emerald" />
          <StepBtn label="↺ איפוס" onClick={() => setPhase(0)} color="rose" />
        </div>
        <div className="w-full max-w-full">
          <div className="mt-10 overflow-x-auto bg-amber-50/40 p-4 md:p-5 rounded-2xl border border-amber-100 max-w-full">
            <h4 className="font-black text-center text-amber-900 mb-4 text-base">טבלה 3</h4>
            <p className="text-center text-xs text-stone-500 mb-3">הטבלה מתמלאת אוטומטית לפי שלבי הניסוי</p>
            <table className="w-full text-center border-collapse bg-white rounded-2xl overflow-hidden text-xs md:text-sm border border-amber-200 shadow-sm" style={{ minWidth: '650px' }}>
              <thead className="bg-amber-100 text-amber-900 font-bold text-[11px]">
                <tr>
                  <th rowSpan="3" className="p-2 border border-amber-200 align-middle">המבחנה</th>
                  <th colSpan="3" className="p-2 border border-amber-200">שאלה 63</th>
                  <th className="p-2 border border-amber-200">סעיף כג</th>
                  <th className="p-2 border border-amber-200">סעיף כו</th>
                  <th className="p-2 border border-amber-200">סעיף כח</th>
                </tr>
                <tr>
                  <th className="p-1 border border-amber-200 font-medium">א</th>
                  <th className="p-1 border border-amber-200 font-medium">ב</th>
                  <th className="p-1 border border-amber-200 font-medium">ג</th>
                  <th className="p-1 border border-amber-200 font-medium">ד</th>
                  <th className="p-1 border border-amber-200 font-medium">ה</th>
                  <th className="p-1 border border-amber-200 font-medium">ו</th>
                </tr>
                <tr>
                  <th className="p-2 border border-amber-200 font-bold w-24">ריכוז התחלתי של תמיסת נחושת גופרתית (%)</th>
                  <th className="p-2 border border-amber-200 font-bold w-20">נפח מיצוי האננס (מ"ל)</th>
                  <th className="p-2 border border-amber-200 font-bold w-16">נפח מים (מ"ל)</th>
                  <th className="p-2 border border-amber-200 font-bold w-20">נפח תמיסת הג'לטין (מ"ל)</th>
                  <th className="p-2 border border-amber-200 font-bold w-32">תוצאות: מידת הקרישה בטמפרטורה נמוכה מ-10°C (נקרש/נקרש חלקית/לא נקרש)</th>
                  <th className="p-2 border border-amber-200 font-bold w-32">תוצאות: נפח תמיסת הפפטידים (תוצר פירוק הג'לטין) (מ"ל)</th>
                </tr>
              </thead>
              <tbody className="text-stone-700 font-medium">
                {[
                  { id: 1, c: '2',    p: '1', w: '0', g: '2', status: 'נקרש',       r: '0' },
                  { id: 2, c: '0.2',  p: '1', w: '0', g: '2', status: 'נקרש חלקית', r: '1' },
                  { id: 3, c: '0.02', p: '1', w: '0', g: '2', status: 'נקרש חלקית', r: '2' },
                  { id: 4, c: '0',    p: '1', w: '0', g: '2', status: 'לא נקרש',    r: '3' },
                  { id: 5, c: '0',    p: '0', w: '1', g: '2', status: 'נקרש',       r: '0' },
                ].map(row => (
                  <tr key={row.id} className="border-b border-amber-50 hover:bg-amber-50 transition-colors text-[11px]">
                    <td className="p-2 border border-amber-100 font-black bg-stone-50">{row.id}</td>
                    <td className="p-2 border border-amber-100">{phase >= 2 ? row.c : '—'}</td>
                    <td className="p-2 border border-amber-100">{phase >= 1 ? row.p : '—'}</td>
                    <td className="p-2 border border-amber-100">{phase >= 1 ? row.w : '—'}</td>
                    <td className="p-2 border border-amber-100">{phase >= 3 ? row.g : '—'}</td>
                    <td className="p-2 border border-amber-100 font-bold">{phase >= 6 ? row.status : '—'}</td>
                    <td className="p-2 border border-amber-100 font-black text-amber-700">{phase >= 8 ? row.r : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MCQ qNum="64ב" points={5} onScore={onScore}
        question="מהי כותרת מתאימה לטבלה 3 (תוצאות ניסוי העיכוב)?"
        options={["השפעת הנפח ההתחלתי של תמיסת הג'לטין על מהירות הקרישה של התמיסות, כאשר הן מועברות לטמפרטורות שונות.", "בחינה השוואתית מקיפה בין רמת הפעילות של אנזים הטריפסין לבין האנזים ברומלין, בסביבה בעלת ריכוזי מלחים.", "השפעת ריכוז הנחושת הגופרתית על עיכוב קרישת הג'לטין (או פעילות האנזים מפרק החלבון) מפרי האננס.", "השפעת הכמות המוספת של מיצוי האננס על עצמת שינוי הצבע בתמיסות נחושת גופרתית שונות לאחר שלב הקירור."]}
        correctIndex={2}
        explanation={`הכותרת צריכה לכלול התייחסות למשתנה הבלתי תלוי (השפעת ריכוז הנחושת הגופרתית), למשתנה התלוי (עיכוב קרישת הג'לטין / פעילות האנזים) ולאורגניזם (אננס).`}
      />
      <MCQ qNum="65" points={5} onScore={onScore}
        question="מהו המשתנה הבלתי תלוי בניסוי שערכת (ניסוי העיכוב בחלק ב')?"
        options={["הנפח ההתחלתי של תמיסת הג'לטין שהוסף לכל אחת מהמבחנות בניסוי המעבדה.", "ריכוז תמיסת נחושת גופרתית (המעכב).", "הטמפרטורה הקבועה שנקבעה מראש באמבט המים הקרים עבור כל הטיפולים.", "הנפח הסופי של תמיסת הפפטידים שנאסף לתוך המשורות בתום תהליך הקירור."]}
        correctIndex={1}
        explanation={`המשתנה הבלתי תלוי הוא הגורם שהחוקר משנה במכוון. בניסוי זה שינינו את ריכוז תמיסת נחושת גופרתית (המעכב) כדי לבדוק את השפעתו.`}
      />
      <MCQ qNum="66א" points={5} onScore={onScore}
        question="מהו המשתנה התלוי בניסוי שערכת?"
        options={["מידת הקרישה של תמיסת הג'לטין.", "נפח תמיסת הג'לטין.", "מידת פעילות האנזים מפרק החלבון.", "ריכוז מיצוי האננס."]}
        correctIndex={2}
        explanation={`התשובה הנכונה לפי המבחן היא III: מידת פעילות האנזים מפרק החלבון. זהו הגורם המושפע מריכוז המעכב.`}
      />
      <MCQ qNum="66ב" points={6} onScore={onScore}
        question="מהי דרך המדידה של המשתנה התלוי, ומהו ההסבר לכך שהיא מתאימה למדידתו?"
        options={["מדידה של שינויי הטמפרטורה במבחנה. ככל שהאנזים פועל מהר יותר, הוא מייצר אנרגיית חום רבה יותר שמשנה את צבע הג'לטין לחלוטין ולכן מתאימה.", "מדידת כמות המשקע שנוצר במבחנה. חלבון ג'לטין אשר מתפרק הופך למשקע מוצק בתחתית המבחנה, ולכן שקילת המשקע מהווה מדד אידיאלי לקצב הפעילות.", "מדידת נפח תמיסת הפפטידים (תוצרי פירוק הג'לטין שלא נקרשו). ככל שיהיה יותר עיכוב של פעילות האנזים, פחות ג'לטין יתפרק ומידת הקרישה תגדל.", "מדידת משך הזמן הדרוש להתמוססות המעכב במים החמים. מעכב יעיל יותר מתמוסס לאט יותר, מה שמעיד על כך שהוא נקשר אל האנזים ומונע ממנו לפרק את החלבון."]}
        correctIndex={2}
        explanation={`דרך המדידה: נפח תמיסת הפפטידים / נפח תוצרי פירוק הג'לטין שלא נקרשו. הסבר: ככל שיהיה יותר עיכוב של פעילות האנזים, פחות ג'לטין יתפרק לפפטידים, יווצרו פחות פפטידים ומידת הקרישה תגדל.`}
      />
      <MCQ qNum="67א" points={6} onScore={onScore}
        question="בניסוי זה נשמר ריכוז הג'לטין קבוע בכל המבחנות 1-4. מדוע חשוב לשמור דווקא על גורם זה קבוע במערך הניסוי?"
        options={["שמירה על ריכוז קבוע נועדה להבטיח שצבע התמיסות יישאר אחיד לחלוטין, על מנת שלא לבלבל את הצופה בעת רישום התוצאות.", "ריכוז קבוע מבטיח שהג'לטין, בהיותו חלבון, לא ינטרל באופן מוחלט את ההשפעה המעכבת של יוני הנחושת הגופרתית בתמיסה.", "ריכוז משתנה או גבוה מדי של ג'לטין עלול לגרום להתפשטות החומר וליצור לחץ רב שיוביל לשבירת המבחנות באמבט הקירור.", "ריכוז הג'לטין משפיע על קצב פעילות אנזים ופירוק החלבון. בניסוי זה אנו בודקים את השפעת ריכוז המעכב, ולכן עלינו לבודד משתנים."]}
        correctIndex={3}
        explanation={`ריכוז הג'לטין משפיע על קצב פעילות האנזים (מספר המפגשים בין אנזים למצע). מכיוון שבניסוי זה אנו בודקים את השפעת המעכב, עלינו לשמור על שאר הגורמים קבועים כדי לבודד את המשתנה הבלתי תלוי.`}
      />
      <MCQ qNum="67ב" points={5} onScore={onScore}
        question="איזה מהגורמים הבאים הוא גורם נוסף שנשמר קבוע במערך הניסוי?"
        options={["הריכוז הסופי של תמיסת הנחושת הגופרתית בכל אחת ממערכות הניסוי.", "מידת הקרישה המדויקת של תמיסת הג'לטין בסיומו המוחלט של הניסוי.", "הנפח המצטבר של תמיסת הפפטידים שנאסף לתוך המשורות בשלב הסופי.", "טמפרטורת האמבטים בכל הטיפולים."]}
        correctIndex={3}
        explanation={`גורמים נוספים שנשמרו קבועים: הטמפרטורה באמבט 1 ובאמבט 2, נפח מיצוי האננס (1 מ"ל), סוג האננס, רמת ה-pH, והנפח הכולל של התמיסה.`}
      />
      <MCQ qNum="68" points={6} onScore={onScore}
        question="מהי המסקנה שאפשר להסיק מתוצאות הניסוי שהתקבלו במבחנות 1-4 לגבי השפעת הנחושת הגופרתית?"
        options={["לנוכחות של נחושת גופרתית אין כל השפעה מהותית על פעילות האנזים, וההבדלים הנובעים בתוצאות מקריים בלבד.", "ככל שריכוז תמיסת הנחושת גופרתית גבוה יותר בטווח שנבדק, כך מידת העיכוב של האנזימים עולה ופירוק החלבון יורד.", "נחושת גופרתית פועלת כזרז ומאיצה את פעילות האנזים: ככל שריכוז הנחושת עולה, כך קצב פירוק החלבון עולה בהתאמה.", "האנזים שבמיצוי פעיל באופן בלעדי רק בנוכחות של נחושת גופרתית; ללא נוכחות חומר זה הוא כלל אינו מסוגל לפרק ג'לטין."]}
        correctIndex={1}
        explanation={`המסקנה היא שככל שריכוז תמיסת הנחושת הגופרתית גבוה יותר (בטווח שנבדק), כך מידת העיכוב של האנזימים עולה, ופירוק הג'לטין לפפטידים יורד.`}
      />
    </section>
  );
};

// =========================
// חלק ג'
// =========================
const PartC = ({ onScore }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl md:text-2xl font-black mb-6 text-amber-900 border-b-4 border-amber-300 pb-2 inline-block">חלק ג' — ניתוח ניסויים: שימוש בפטרייה להדברת מזיקים</h2>
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-100 mb-6 text-stone-800 text-sm md:text-base leading-relaxed font-medium shadow-sm">
        <p className="mb-3">חרקים מסוימים גורמים נזקים לגידולים חקלאיים. בשל המודעות הגוברת לאיכות הסביבה ולבריאות האדם, מדענים מנסים למצוא דרכים להדביר מזיקים באמצעים ידידותיים לסביבה. אחת הדרכים היא שימוש בפטרייה <em>Beauveria bassiana</em>. הפטרייה מייצרת אנזימים מפרקי חלבונים הגורמים לפירוק המעטה הקשיח של גוף החרקים, המורכב מרב-סוכר ומחלבון. באמצעות הפירוק האנזימטי של המעטה הפטרייה חודרת לגופו של החרק, מפרישה חומרים רעילים הגורמים למותו.</p>
      </div>
      <div className="bg-white border-2 border-amber-200 rounded-3xl shadow-md p-4 md:p-8 mb-8">
        <h4 className="font-black text-amber-900 text-lg mb-4">ניסוי 1: השוואת שני זני הפטרייה</h4>
        <p className="text-stone-700 text-sm mb-5 leading-relaxed font-medium">חוקרים חשפו שתי קבוצות של חרקים לנוזל המכיל תאי פטרייה משני זנים. כל קבוצה של חרקים נחשפה לזן אחר של הפטרייה. במשך 18 ימים בדקו החוקרים את שיעור תמותת החרקים משתי הקבוצות.<br/>(בנוסף, נערך טיפול בקרה שבו חרקים לא נחשפו לפטרייה כלל).</p>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-full">
            <div className="overflow-x-auto w-full max-w-lg mx-auto">
              <h5 className="font-bold text-center text-amber-900 mb-3 text-sm">טבלה 4: תוצאות הניסוי</h5>
              <table className="w-full text-center border-collapse bg-white rounded-xl overflow-hidden text-xs md:text-sm border border-amber-200 shadow-sm">
                <thead className="bg-amber-100 text-amber-900 font-bold">
                  <tr>
                    <th className="p-3 border border-amber-200">הזמן שעבר מן החשיפה (ימים)</th>
                    <th className="p-3 border border-amber-200 text-rose-700">שיעור תמותת החרקים (%)<br/>פטרייה מזן א'</th>
                    <th className="p-3 border border-amber-200 text-sky-700">שיעור תמותת החרקים (%)<br/>פטרייה מזן ב'</th>
                  </tr>
                </thead>
                <tbody className="text-stone-700 font-bold">
                  {[[4,15,30],[8,35,60],[12,45,90],[16,60,97],[18,62,97]].map(([d,a,b]) => (
                    <tr key={d} className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                      <td className="p-2.5 border border-amber-100 bg-amber-50">{d}</td>
                      <td className="p-2.5 border border-amber-100 text-rose-600">{a}</td>
                      <td className="p-2.5 border border-amber-100 text-sky-600">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <MCQ qNum="69א" points={5} onScore={onScore}
        question="אילו משתנים יופיעו על צירי הגרף שיציג את הנתונים מטבלה 4?"
        options={["ציר ה-X: שיעור תמותת החרקים באחוזים (משתנה תלוי); ציר ה-Y: הזמן שחלף בימים (משתנה בלתי תלוי).", "ציר ה-X: זן הפטרייה הספציפי (משתנה בלתי תלוי); ציר ה-Y: שיעור תמותת החרקים.", "ציר ה-X: הזמן (בימים) מהחשיפה (משתנה בלתי תלוי); ציר ה-Y: שיעור תמותת החרקים באחוזים (משתנה תלוי).", "ציר ה-X: טמפרטורת הסביבה; ציר ה-Y: הזמן שעבר מתחילת הניסוי."]}
        correctIndex={2}
        explanation={`המשתנה הבלתי תלוי הוא הזמן שחלף מהחשיפה (ציר X), והמשתנה התלוי הוא התוצאה הנמדדת - שיעור תמותת החרקים (ציר Y).`}
      />
      <MCQ qNum="69ב" points={5} onScore={onScore}
        question="איזה סוג של הצגה גרפית הוא המתאים ביותר לתיאור התוצאות בטבלה 4, ומדוע?"
        options={["דיאגרמת עמודות נפרדות, משום שהזמן נמדד בימים מוגדרים בלבד.", "דיאגרמת עוגה, משום שסוג זה של גרף נועד להציג את החלק היחסי של התמותה.", "גרף פיזור (נקודות ללא קו מחבר), כיוון שאין כל קשר ישיר בין הימים החולפים לתמותה.", "גרף קו (רציף) / עקום, משום שהמשתנה הבלתי תלוי (הזמן בימים) הוא רציף וכמותי."]}
        correctIndex={3}
        explanation={`הזמן הוא משתנה כמותי רציף, לכן הצגה בעזרת גרף רציף היא המתאימה ביותר כדי לראות מגמות ושינויים לאורך רצף הזמן.`}
      />
      <MCQ qNum="70א" points={6} onScore={onScore}
        question="איזה מהמשפטים הבאים מתאר נכונה את התוצאות המוצגות בטבלה לגבי שיעור תמותת החרקים בשני הזנים?"
        options={["לאורך כל ימי הניסוי ניתן לראות בבירור שזן א' גורם לתמותה מוקדמת וגבוהה באופן משמעותי מאשר זן ב' בכל שלבי הניסוי.", "שיעור התמותה בשני הזנים נותר אפסי לחלוטין בשבועיים הראשונים לאחר החשיפה, ורק לאחריהם מתחילה עלייה חדה בתמותה.", "לאחר החשיפה לזני הפטריות, שיעור התמותה עלה במשך הזמן בשניהם. עם זאת, קצב התמותה בחשיפה לזן ב' היה תמיד גבוה יותר.", "ניתן לראות בבירור כי בשני הזנים שיעור התמותה הולך ויורד באופן הדרגתי עם הזמן, כיוון שהחרקים מפתחים עמידות כנגדם."]}
        correctIndex={2}
        explanation={`הנתונים בטבלה מראים עלייה בתמותה לאורך זמן בשני הזנים, אך ערכי התמותה וקצב העלייה של זן ב' גבוהים יותר בכל נקודת זמן שנמדדה.`}
      />
      <MCQ qNum="70ב" points={6} onScore={onScore}
        question="בטיפול בקרה (שלא הוצג בטבלה) בדקו חרקים שלא נחשפו לפטרייה כלל. מהי חשיבות טיפול זה?"
        options={["מטרת טיפול הבקרה היא לבחון באיזו מהירות מתרבים החרקים באופן טבעי וללא כל איום בסביבת הגידול שלהם.", "טיפול הבקרה מאפשר לדעת מהו אחוז התמותה הטבעי ולוודא שהחשיפה לפטרייה היא זו שגרמה לעלייה בתמותה.", "טיפול זה נועד לבדוק האם זני הפטרייה מסוגלים להתפתח, לשרוד ולהתרבות ביעילות גם ללא הימצאות חרקים.", "הטיפול נערך אך ורק כדי להבטיח שמספר החרקים הכולל בניסוי יהיה שווה לחלוטין, לשם השוואה סטטיסטית."]}
        correctIndex={1}
        explanation={`חשיבות הבקרה היא לשמש בסיס להשוואה. כך ניתן לוודא שהתמותה נגרמה מהטיפול (הפטרייה) ולא מגורמים חיצוניים אחרים או מוות טבעי.`}
      />
      <div className="bg-yellow-50 p-4 md:p-5 rounded-3xl mb-8 border-2 border-yellow-200 shadow-sm mt-8">
        <h4 className="font-black text-amber-900 text-lg mb-3">ניסוי 2:</h4>
        <p className="text-stone-800 text-sm md:text-base leading-relaxed font-medium">החוקרים רצו לבדוק ממה נובעים ההבדלים שנמצאו בשיעור תמותת החרקים. לשם כך, החוקרים גידלו את שני הזנים של הפטרייה, כל זן בנפרד, על מצע גידול ובו החלבון ג'לטין. החוקרים מדדו את רמת הפירוק של החלבון.<br/><strong>נמצא כי רמת הפירוק של החלבון ג'לטין בנוכחות זן ב' הייתה גבוהה יותר מרמת הפירוק שלו בנוכחות זן א'.</strong></p>
      </div>
      <MCQ qNum="71" points={7} onScore={onScore}
        question="בניסוי 2 נמצא שזן ב' מפרק ג'לטין ביעילות גבוהה מזן א'. על סמך נתון זה, מהו ההסבר לכך שזן ב' קטלני יותר לחרקים?"
        options={["זן א' מפרק רק רב-סוכר בעוד זן ב' מפרק חלבונים. היות וחרקים מכילים בעיקר חלבון, הוא יעיל יותר.", "זן ב' אינו מסתמך על פירוק כימי אלא חודר אל החרק ישירות דרך הנשימה, ולכן פועל במהירות רבה יותר.", "זן א' אינו מייצר אנזימים מפרקים כלל, בעוד זן ב' מייצר רעלנים שחודרים מיד ללא צורך בפירוק מקדים.", "מכיוון שמעטה החרקים מכיל חלבון, זן ב' בעל האנזים היעיל יותר מפרק מהר יותר את המעטה וחודר לחרק."]}
        correctIndex={3}
        explanation={`המעטה הקשיח של החרק מכיל חלבון. מאחר שזן ב' מייצר אנזימים מפרקי חלבון (פרוטאזות) יעילים יותר, הוא מצליח לחדור לחרק מהר יותר ולגרום למותו.`}
      />
      <MCQ qNum="72" points={6} onScore={onScore}
        question="האנזימים מפרקי החלבון מצויים בתאי האננס בתוך אברונים. מדוע זה יתרון עבור תאי האננס?"
        options={["האברון מתפקד כמבודד תרמי מיוחד השומר על האנזימים בטמפרטורה נמוכה למניעת הרס של הפעילות הקטליטית שלהם.", "אם האנזימים היו חופשיים בציטופלסמה הם היו גורמים לפירוק חלבונים חיוניים בתא האננס עצמו וגורמים לנזק.", "האברונים בתא משמשים אך ורק כמאגרים זמניים המאפשרים הפרשה מהירה של האנזימים אל מחוץ לתא בזמן מתקפה.", "אנזימים מפרקי חלבון מסוג זה דורשים סביבה יבשה לחלוטין, והאברון הסגור מספק את התנאים הייחודיים הללו."]}
        correctIndex={1}
        explanation={`מידור (Compartmentalization) מגן על התא. ללא האברונים, האנזימים מפרקי החלבון היו מעכלים את חלבוני התא עצמו (אוטוליזה).`}
      />
    </section>
  );
};

// =========================
// Score Summary
// =========================
const ScoreSummary = ({ scores }) => {
  const entries = Object.values(scores);
  const answered = entries.length;
  const totalQ   = 18;
  const earned   = entries.reduce((s, e) => s + e.earned, 0);
  const possible = 100;
  const pct = Math.round((earned / possible) * 100);
  return (
    <div className="bg-white border-4 border-amber-300 p-8 rounded-3xl shadow-xl mt-12 text-center relative overflow-hidden w-full">
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-400 via-amber-400 to-lime-400" />
      <h2 className="text-2xl md:text-3xl font-black text-amber-900 mb-5">סיכום הניקוד</h2>
      <div className="text-6xl md:text-7xl font-black text-stone-800 mb-1">{earned}</div>
      <div className="text-base text-stone-500 font-bold mb-5">מתוך {possible} נקודות | ענית על {answered}/{totalQ} שאלות</div>
      <div className="w-full max-w-md mx-auto bg-stone-100 rounded-full h-5 overflow-hidden border-2 border-stone-200 relative shadow-inner mb-4">
        <div className={cx('h-full transition-all duration-1000 rounded-full', pct >= 70 ? 'bg-lime-500' : pct >= 45 ? 'bg-amber-400' : 'bg-rose-400')} style={{ width: `${(answered / totalQ) * 100}%` }} />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-stone-700">{Math.round((answered / totalQ) * 100)}% הושלם</div>
      </div>
      {answered === totalQ && ( <div className="mt-4 text-xl font-black text-lime-700">🎉 סיימת את המעבדה! ציון סופי: {pct}%</div> )}
    </div>
  );
};

export default function App() {
  const [scores, setScores] = useState({});
  const totalEarned = Object.values(scores).reduce((s, e) => s + e.earned, 0);
  const handleScore = (qNum, earned, max) => setScores(prev => ({ ...prev, [qNum]: { earned, max } }));
  return (
    <div dir="rtl" className="rtl min-h-screen w-full overflow-x-hidden bg-[#f5f3ef] text-stone-900 p-2 md:p-6 pb-28 relative">
      <style>{customStyles}</style>
      <div className="fixed bottom-5 left-5 bg-white/90 backdrop-blur-md border-4 border-amber-400 p-3.5 rounded-2xl shadow-2xl z-50 flex flex-col items-center min-w-[90px] hover:scale-105 transition-transform cursor-default">
        <span className="text-[10px] text-stone-500 font-black mb-0.5 uppercase tracking-wide">ניקוד</span>
        <span className="text-3xl font-black text-amber-700">{totalEarned}</span>
      </div>
      <div className="max-w-5xl w-full mx-auto bg-white/85 backdrop-blur-sm rounded-[2rem] shadow-xl overflow-hidden border border-amber-100">
        <header className="bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 text-white p-7 md:p-11 text-center relative overflow-hidden w-full">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent" />
          <h1 className="text-2xl md:text-4xl font-black mb-3 relative z-10 leading-tight">מעבדה אינטראקטיבית בביולוגיה</h1>
          <div className="text-yellow-300 text-xl md:text-3xl font-black mb-4 relative z-10">בגרות תשע"ח 2018 — בעיה 6</div>
          <div className="text-amber-200 text-xs md:text-sm bg-white/10 inline-block px-5 py-2 rounded-full border border-white/20 font-bold relative z-10">אנזימים מפרקי חלבון • עיכוב אנזימטי • יישומים בחקלאות</div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-6 mt-5 text-amber-200 text-xs font-bold relative z-10"><span>100 נקודות סה"כ</span><span className="hidden md:inline">•</span><span>18 שאלות</span><span className="hidden md:inline">•</span><span>3 חלקים</span></div>
        </header>
        <main className="p-3 md:p-10 text-right w-full">
          <PartA onScore={handleScore} />
          <div className="w-full h-px bg-amber-200 my-12 opacity-60" />
          <PartB onScore={handleScore} />
          <div className="w-full h-px bg-amber-200 my-12 opacity-60" />
          <PartC onScore={handleScore} />
          <ScoreSummary scores={scores} />
        </main>
        <footer className="bg-amber-950 text-amber-300 p-6 text-center text-xs font-medium w-full">
          <p className="mb-1">מבוסס על שאלון בחינת הבגרות במעבדה לביולוגיה (43386), קיץ תשע"ח — כל הזכויות למשרד החינוך.</p>
          <p>נערכת על ידי רבקה פרידלנד כהן</p>
        </footer>
      </div>
    </div>
  );
}
