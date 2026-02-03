
import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import * as Lucide from 'lucide-react';

interface ProjectData {
  id: number | string;
  phase: number;
  title: string;
  dateRange: string;
  hardware: string;
  emotionState: string;
  description: string;
  tags: string[];
  images: string[];
}

interface PreviewProps {
  config: SiteConfig;
}

const Preview: React.FC<PreviewProps> = ({ config }) => {
  const [crtOn, setCrtOn] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [lang, setLang] = useState<'CHN' | 'EN'>('CHN');
  const [selectedProjectId, setSelectedProjectId] = useState<number | string | null>(null);
  
  // 動態項目數據，預設為空，等待 Wix 傳入
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. 處理導航指令
      if (typeof event.data === 'string' && ['Home', 'Project', 'Personal Work', 'About'].includes(event.data)) {
        setActiveTab(event.data);
        setSelectedProjectId(null);
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
      }
      
      // 2. 接收來自 Wix CMS 的數據包
      if (event.data && event.data.type === 'CMS_DATA') {
        setProjects(event.data.payload);
        setLoading(false);
      }
    };
    window.addEventListener('message', handleMessage);
    
    // 模擬：如果 3 秒內沒收到 Wix 消息，使用本地預設數據（開發預覽用）
    const timer = setTimeout(() => {
      if (projects.length === 0) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [projects.length]);

  const getIcon = (iconName: string) => {
    const Icon = Lucide[iconName as keyof typeof Lucide] as React.ElementType;
    return Icon || Lucide.Zap;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="w-16 h-16 border-4 border-black border-t-[#FF5722] animate-spin"></div>
          <div className="font-mono-retro text-xl font-black uppercase tracking-widest animate-pulse">
            Syncing_From_Wix_CMS...
          </div>
        </div>
      );
    }

    if (activeTab === 'Project' && selectedProjectId !== null) {
      const p = projects.find(item => item.id === selectedProjectId);
      if (!p) return null;
      return (
        <div className="animate-in fade-in zoom-in-95 duration-300 max-w-6xl mx-auto pb-40 px-4">
          <button 
            onClick={() => setSelectedProjectId(null)}
            className="mb-8 flex items-center gap-2 px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5722] transition-colors shadow-[4px_4px_0px_#FF5722]"
          >
            <Lucide.ArrowLeft className="w-4 h-4" /> BACK_TO_LOGS
          </button>
          
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_black] relative mb-12">
             <div className="absolute top-0 right-0 bg-black text-white px-4 md:px-6 py-2 text-[10px] font-black uppercase font-mono-retro">PHASE_{p.phase}</div>
             <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase leading-tight">{p.title}</h3>
             <div className="text-sm font-mono-retro text-[#FF5722] mb-10 font-bold uppercase tracking-widest">{p.hardware}</div>
             <p className="text-xl md:text-2xl leading-relaxed font-medium text-black/80 italic mb-12">"{p.description}"</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono-retro text-xs border-t-4 border-black pt-8">
               <div><span className="opacity-40 uppercase">Timestamp:</span> {p.dateRange}</div>
               <div><span className="opacity-40 uppercase">Emotion_State:</span> {p.emotionState}</div>
             </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Lucide.Camera className="w-6 h-6 text-[#FF5722]" />
              <h4 className="text-2xl font-black uppercase italic tracking-tighter">視覺證據庫 ({p.images.length})</h4>
              <div className="flex-1 h-1 bg-black"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {p.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#E8E6D9]/80 backdrop-blur-sm border border-black/5 z-10 rotate-2 group-hover:rotate-0 transition-transform"></div>
                  <div className="bg-white p-4 pb-12 border-2 border-black/10 shadow-[10px_10px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[15px_15px_30px_rgba(0,0,0,0.2)] transition-all group-hover:-translate-y-2 group-hover:rotate-1">
                    <div className="aspect-square bg-black overflow-hidden border border-black/5 mb-4">
                      <img src={img} className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700" alt="Evidence" />
                    </div>
                    <div className="font-mono-retro text-[10px] font-black text-black/30 uppercase text-center tracking-widest">FILE_REF_{idx+1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Home':
        return (
          <div className="animate-in fade-in duration-500 space-y-24 max-w-6xl mx-auto">
            <header className="relative pt-8">
              <div className="inline-block bg-black text-white px-3 py-1 text-[10px] font-black uppercase mb-4">檔案回放</div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
                <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none relative">
                  HONG: <span className="text-[#FF5722]">LAM_ARCHIVE</span>
                  <span className="absolute -bottom-4 -right-4 text-black/5 text-9xl -z-10 select-none uppercase hidden md:block">HONG</span>
                </h2>
                <div className="font-mono-retro text-xs font-black opacity-40 uppercase tracking-widest pb-2">REC_DATE: 2025-11-14</div>
              </div>
              <div className="bg-[#FFB300] border-4 border-black p-3 shadow-[6px_6px_0px_black] inline-block w-full">
                <div className="text-xs font-black uppercase tracking-[0.2em]">LOGGED BY: {config.companyName}</div>
              </div>
            </header>

            <section className="relative flex flex-col items-center py-10">
              <div className="w-full flex items-center gap-4 mb-16">
                <div className="w-4 h-4 bg-black"></div>
                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-center md:text-left">Memory_Showreel_Wide</h3>
                <div className="flex-1 border-t-4 border-black"></div>
              </div>
              <div className="relative rotate-1 hover:rotate-0 transition-transform duration-500 group w-full max-w-4xl">
                <div className="bg-white p-4 md:p-6 pb-24 border-4 border-black shadow-[20px_20px_0px_black] flex flex-col">
                  <div className="bg-black aspect-video relative overflow-hidden border-4 border-black shadow-inner mb-8">
                    <video className="w-full h-full object-cover contrast-110" autoPlay loop muted playsInline src="https://assets.mixkit.co/videos/preview/mixkit-glitch-effect-on-a-digital-screen-34440-large.mp4" />
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-4 gap-6">
                    <div className="space-y-2">
                      <div className="font-mono-retro text-2xl md:text-4xl font-black text-black tracking-tighter leading-none">WIX_DYNAMIC_FEED // 001</div>
                      <div className="font-mono-retro text-sm font-bold text-[#FF5722] uppercase tracking-widest border-b-2 border-[#FF5722] inline-block">Observer: {config.companyName}</div>
                    </div>
                  </div>
                </div>
                <button className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#FF5722] border-4 border-black text-black flex items-center justify-center hover:bg-black hover:text-[#FF5722] transition-all shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
                  <Lucide.Play className="w-10 h-10 fill-current" />
                </button>
              </div>
            </section>
          </div>
        );
      case 'Project':
        return (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pt-8 pb-32 px-4">
             <div className="mb-16">
                <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6 relative">
                  PROJECT <span className="text-black">JOURNAL</span>
                </h2>
                <div className="bg-[#FFB300] border-4 border-black p-3 shadow-[8px_8px_0px_black] inline-block w-full">
                  <div className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">資料庫狀態: {projects.length > 0 ? '已聯接' : '預覽模式'}</div>
                </div>
             </div>

             <div className="relative pl-8 md:pl-24">
                <div className="absolute left-[1.4rem] md:left-[5.15rem] top-0 bottom-0 w-1.5 bg-black"></div>
                <div className="space-y-16">
                  {projects.length > 0 ? projects.map((p) => (
                    <div key={p.id} className="relative group">
                      <div className="absolute -left-[1.85rem] md:-left-[2.1rem] top-12 w-8 h-8 rounded-full border-4 border-black bg-[#E8E6D9] z-10 group-hover:bg-[#FF5722] transition-colors"></div>
                      <div onClick={() => setSelectedProjectId(p.id)} className="bg-white border-4 border-black p-6 md:p-8 relative shadow-[10px_10px_0px_black] hover:shadow-[10px_10px_0px_#FF5722] transition-all cursor-pointer">
                         <h4 className="text-2xl md:text-4xl font-black mb-4 italic tracking-tight">{p.title}</h4>
                         <p className="text-sm text-black/60 font-medium leading-relaxed mb-6 line-clamp-2">{p.description}</p>
                         <div className="flex items-center justify-between pt-6 border-t border-dashed border-black/20">
                            <div className="font-mono-retro text-xs font-black uppercase tracking-widest">[查看 {p.images.length} 張證物照片]</div>
                         </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-black/20 font-black uppercase tracking-widest py-20 text-center">目前沒有檔案記錄...</div>
                  )}
                </div>
             </div>
          </div>
        );
      case 'Personal Work':
        return (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pt-8 px-4">
             <div className="flex items-center gap-4 mb-12">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Creative_Nodes</h2>
                <div className="flex-1 h-1 bg-black/10"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {config.features.map((f, i) => {
                 const Icon = getIcon(f.icon);
                 return (
                   <div key={i} className="bg-white border-4 border-black p-10 shadow-[10px_10px_0px_black]">
                      <Icon className="w-12 h-12 mb-6 text-[#FF5722]" />
                      <h4 className="text-3xl font-black mb-4 uppercase italic leading-tight">{f.title}</h4>
                      <p className="text-sm text-black/60 font-medium leading-relaxed">{f.description}</p>
                   </div>
                 );
               })}
             </div>
          </div>
        );
      case 'About':
        return (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white border-4 border-black shadow-[20px_20px_0px_black] overflow-hidden">
               <div className="bg-[#121212] p-8 md:p-12 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                  <div className="flex flex-col md:flex-row gap-10 items-end">
                     <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-400 border-4 border-white overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80" className="w-full h-full object-cover grayscale contrast-125" alt="Profile" />
                     </div>
                     <div className="mb-2">
                        <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none mb-4">林曉</h2>
                        <div className="text-white/60 font-black uppercase tracking-[0.3em] text-sm">ARCHITECT / OBSERVER</div>
                     </div>
                  </div>
               </div>
               <div className="p-8 md:p-12">
                  <p className="text-lg md:text-xl leading-relaxed text-black/80 font-medium mb-10">{config.aboutText}</p>
                  <div className="border-t-2 border-dashed border-black/10 pt-8 flex flex-wrap gap-4">
                     {[ '#CODE', '#DESIGN', '#ARCHIVE' ].map(tag => <span key={tag} className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono-retro">{tag}</span>)}
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden relative ${crtOn ? 'scanline-overlay' : ''} bg-[#E8E6D9]`}>
      <nav className="h-24 bg-[#F2F2F2] border-b-4 border-black flex items-center px-4 md:px-8 z-40 shrink-0 shadow-[0px_4px_10px_rgba(0,0,0,0.1)] overflow-x-auto no-scrollbar">
        <div className="bg-[#FF5722] border-4 border-black h-12 md:h-16 px-4 md:px-6 flex items-center gap-4 cursor-pointer hover:bg-black group transition-colors shadow-[4px_4px_0px_black] shrink-0">
           <span className="text-xl md:text-3xl font-black tracking-tighter text-black group-hover:text-white uppercase leading-none">HONG LAM</span>
        </div>
        <div className="flex-1 flex justify-center gap-1 md:gap-2 px-4">
           {[ { label: 'Home', icon: Lucide.MousePointer2 }, { label: 'Project', icon: Lucide.Layout }, { label: 'Personal Work', icon: Lucide.Globe }, { label: 'About', icon: Lucide.Info } ].map((item) => (
             <button key={item.label} onClick={() => { setActiveTab(item.label); setSelectedProjectId(null); }} className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 text-[10px] md:text-xs font-black uppercase transition-all border-b-4 shrink-0 ${activeTab === item.label ? 'text-black border-black bg-white shadow-inner' : 'text-black/40 border-transparent hover:text-black hover:border-black/20'}`}>
               <item.icon className="w-3 h-3 md:w-4 md:h-4" /><span className="tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
           <button onClick={() => setCrtOn(!crtOn)} className={`p-2 border-2 border-black ${crtOn ? 'bg-[#7DB52F]' : 'bg-white opacity-40'}`}><Lucide.Monitor className="w-4 h-4 text-black" /></button>
        </div>
      </nav>
      <main className="flex-1 archive-grid relative overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-20">{renderContent()}</main>
    </div>
  );
};

export default Preview;
