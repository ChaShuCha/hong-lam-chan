
import React, { useState } from 'react';
import { AppStatus, SiteConfig } from './types';
import Preview from './components/Preview';
import { Terminal, Power, X, Copy, Check, Info, Zap, Database, Code } from 'lucide-react';

const INITIAL_CONFIG: SiteConfig = {
  companyName: "Hong Lam",
  tagline: "Classified Archive Log",
  heroHeadline: "PROJECT JOURNAL",
  heroSubheadline: "REC_DATE: 2025-11-14",
  primaryColor: "#FF5722",
  secondaryColor: "#E8E6D9",
  fontStyle: "classic",
  aboutText: "記錄人與算法融合過程的觀察者。擅長捕捉技術變革下個體的過時悲劇。",
  features: [
    { title: "生存壓力", description: "失業、經濟危機，以及人類獨特性被取代的恐懼。", icon: "Zap" },
    { title: "身份認同", description: "技能貶值帶來的自我懷疑。「我的存在價值由什麼來衡量？」", icon: "Shield" },
    { title: "人機邊界", description: "與機器建立親密關係。在沈溺於合成愛意的同時，恐懼失去聯接。", icon: "Star" }
  ],
  testimonials: [],
  ctaText: "INITIATE_CONTACT"
};

const VELO_CMS_BRIDGE = `// 1. 在 Wix CMS 建立一個集合 "Projects"
// 2. 在 Wix 頁面代碼中貼入以下內容：

import wixData from 'wix-data';

$w.onReady(async function () {
  // 從 Wix 資料庫抓取所有項目
  const results = await wixData.query("Projects").find();
  const projects = results.items.map(item => ({
    id: item._id,
    phase: item.phase,
    title: item.title,
    dateRange: item.dateRange,
    hardware: item.hardware,
    emotionState: item.emotionState,
    description: item.description,
    images: item.gallery.map(img => img.src), // 假設使用 Media Gallery 欄位
    tags: item.tags || []
  }));

  // 將數據發送給 HTML 元件
  $w("#htmlArchive").postMessage({
    type: 'CMS_DATA',
    payload: projects
  });
});`;

const App: React.FC = () => {
  const [siteConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState<'CMS' | 'HTML'>('CMS');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <header className="h-10 bg-black border-b-2 border-black flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <Terminal className="text-[#FF5722] text-xs" />
          <h1 className="font-black text-white text-[9px] tracking-[0.4em] uppercase font-mono-retro">WIX_DYNAMIC_INTEGRATOR</h1>
        </div>
        <button 
          onClick={() => setShowExportModal(true)} 
          className="bg-[#FF5722] text-black px-4 py-1 text-[9px] font-black uppercase font-mono-retro flex items-center gap-2 hover:bg-white transition-colors border-x-2 border-black"
        >
          <Database className="w-3 h-3" /> 如何輕鬆管理內容？
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        <Preview config={siteConfig} />
      </div>

      {showExportModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 md:p-12 backdrop-blur-md">
           <div className="bg-[#1A1A1A] border-4 border-black shadow-[15px_15px_0px_#FF5722] w-full max-w-4xl flex flex-col animate-in zoom-in-95 duration-300">
              <div className="flex border-b-4 border-black p-5 bg-[#FF5722] items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setExportTab('CMS')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest ${exportTab === 'CMS' ? 'bg-black text-white shadow-[4px_4px_0px_white]' : 'text-black opacity-60'}`}>第一步：設置 CMS</button>
                    <button onClick={() => setExportTab('HTML')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest ${exportTab === 'HTML' ? 'bg-black text-white shadow-[4px_4px_0px_white]' : 'text-black opacity-60'}`}>第二步：獲取 HTML</button>
                 </div>
                 <button onClick={() => setShowExportModal(false)} className="text-black"><X /></button>
              </div>
              
              <div className="p-10 flex flex-col gap-6">
                 {exportTab === 'CMS' ? (
                   <div className="space-y-6">
                      <div className="bg-blue-900/10 p-4 border-l-4 border-blue-500 flex gap-4">
                        <Info className="text-blue-400 w-6 h-6 shrink-0" />
                        <p className="text-white/80 text-xs font-mono-retro leading-relaxed">
                          這是最專業的做法。你在 Wix 後台建立一個「資料庫（CMS）」，然後用下面的代碼把數據連到這個網頁。
                          這樣你以後**不用改 HTML 代碼**，只需要在 Wix 後台加照片和改文字就行了。
                        </p>
                      </div>
                      <div className="bg-black p-4 border-2 border-white/10 text-[#7DB52F] font-mono text-[10px] h-60 overflow-y-auto custom-scrollbar">
                        <pre>{VELO_CMS_BRIDGE}</pre>
                      </div>
                      <button onClick={() => copyToClipboard(VELO_CMS_BRIDGE)} className="px-8 py-3 bg-white text-black border-2 border-black font-black uppercase text-[10px] self-end flex items-center gap-2">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} 複製 Velo 代碼
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <p className="text-white/60 text-[10px] uppercase font-black">這是靜態網頁容器代碼，請一次性貼入 Wix HTML 嵌入組件中：</p>
                      <div className="bg-black p-4 border-2 border-white/10 text-[#FF5722] font-mono text-[10px] h-40">
                        {`<!-- BUNDLED_REACT_APP -->\n<div id="root"></div>\n<script type="module">...</script>`}
                      </div>
                      <p className="text-white/40 text-[9px] italic">注意：確保在 Wix 嵌入設置中開啟了「與站點通信」選項。</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
