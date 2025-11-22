import React, { useState, useEffect, useRef } from 'react';
import { AppStep, AgentConfig, GeneratedArtifacts } from './types';
import { StepIndicator } from './components/StepIndicator';
import { CodeViewer } from './components/CodeViewer';
import { PixelBackground } from './components/PixelBackground';
import { ActionRecorder } from './components/ActionRecorder';
import { SplashScreen } from './components/SplashScreen';
import { HallOfFame } from './components/HallOfFame';
import { GalacticGame } from './components/GalacticGame';
import { generateAutomationArtifacts } from './services/geminiService';
import { generateDockerfile, generatePackageJson, generateCloudBuild, generateEntrypoint, generateSetupScript, generateLocalRunScript } from './utils/scaffold';
import { Bot, Zap, Coffee, Book, X, Clock, Cloud, Key, Mail, Phone, Upload, MousePointer, Send, Terminal, Github } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<AppStep>(AppStep.CONFIG);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<AgentConfig>({
    targetUrl: 'https://exemplo.com/login',
    taskDescription: "Acesse https://exemplo.com/login, faça login com o usuário teste@dominio.com e senha SenhaTeste123, e depois clique em 'Relatórios' para baixar o arquivo em PDF.",
    projectId: 'automacao-preguicosa-v1',
    region: 'us-central1',
    serviceName: 'robo-preguicoso',
    secretName: 'SEGREDOS_DO_ROBO',
    cronSchedule: '0 9 * * *',
    alertEmail: 'chefe@empresa.com',
    alertWhatsapp: '+5511999990000'
  });
  const [artifacts, setArtifacts] = useState<GeneratedArtifacts | null>(null);
  const [showDoc, setShowDoc] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // --- EASTER EGGS STATES ---
  const [partyMode, setPartyMode] = useState(false);
  const [mascotClicks, setMascotClicks] = useState(0);
  const [mascotMessage, setMascotMessage] = useState('');
  const konamiIndex = useRef(0);
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // --- EASTER EGG 4: SECRET CHAT (MOBILE) ---
  const [showSecretChat, setShowSecretChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: 'user' | 'bot', text: string}[]>([
    { sender: 'bot', text: '> preguiçoso.exe iniciado... 👾 Fale comigo (mas seja breve).' }
  ]);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const LAZY_RESPONSES = [
    "Digite devagar... estou pensando com calma.",
    "Sou um bot, mas também gosto de cochilar.",
    "Processando... mas só depois do café ☕.",
    "Você realmente quer automatizar isso? 😴",
    "Estou rodando em modo preguiçoso, tenha paciência...",
    "Zzz... Oi? Alguém chamou?",
    "Isso parece trabalho demais para mim hoje.",
    "Tente novamente mais tarde (bem mais tarde)."
  ];

  // --- EASTER EGG 3: SECRET CONSOLE ---
  useEffect(() => {
    const slothArt = `
       .  ..  .
       . .  .. .
      . ..   . .. .
     . .  ..  . . ..
      .  ..  . .  .
     .-'''-.
    /   _   \\
    |  (o)  |      PREGUIÇOSO DEVELOPER TOOLS
    |   _   |      --------------------------
    \\  (_)  /      "Por que codar se você pode descansar?"
     '-...-' 
    `;
    console.log(`%c${slothArt}`, 'font-family: monospace; color: #00baff; font-weight: bold;');
    console.log('%c👋 Achou o console secreto? Você é dos nossos!', 'background: #1a0033; color: #ff4ff0; font-size: 12px; padding: 4px; border-radius: 4px;');
  }, []);

  // --- EASTER EGG 1: KONAMI CODE ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          setPartyMode(prev => !prev);
          konamiIndex.current = 0;
          if(!partyMode) alert("🕺 MODO BALADA ATIVADO: QUEM DISSE QUE PREGUIÇOSO NÃO DANÇA?");
        }
      } else {
        konamiIndex.current = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [partyMode]);

  // --- EASTER EGG 2: ANGRY MASCOT ---
  const handleMascotClick = () => {
    setMascotClicks(prev => prev + 1);
    
    if (mascotClicks + 1 >= 5) {
       const messages = [
         "Ei! Tô de folga!",
         "Para de clicar e vai codar!",
         "Me deixa dormir...",
         "Vou chamar o Sindicato!",
         "Erro 418: Sou um bule (de café)"
       ];
       setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
       
       // Reset após um tempo
       setTimeout(() => {
         setMascotClicks(0);
         setMascotMessage('');
       }, 3000);
    }
  };

  // --- EASTER EGG 4 LOGIC: LONG PRESS ---
  const handlePressStart = () => {
    longPressTimer.current = setTimeout(() => {
        setShowSecretChat(true);
        navigator.vibrate?.(200); // Vibrar se for mobile
    }, 5000);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
    }
  };

  // --- CHAT LOGIC ---
  const handleChatSubmit = () => {
      if (!chatInput.trim()) return;
      
      const userMsg = chatInput;
      setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
      setChatInput('');

      // Scroll to bottom
      setTimeout(() => {
          if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }, 100);

      // Bot Response
      setTimeout(() => {
          const randomResponse = LAZY_RESPONSES[Math.floor(Math.random() * LAZY_RESPONSES.length)];
          setChatMessages(prev => [...prev, { sender: 'bot', text: randomResponse }]);
          
          setTimeout(() => {
            if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }, 100);
      }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setConfig(prev => ({ ...prev, taskDescription: content }));
    };
    reader.readAsText(file);
  };

  const handleRecordingComplete = (jsonActions: string) => {
    setConfig(prev => ({
      ...prev,
      taskDescription: `(Gravação Automática)\n${jsonActions}`
    }));
    alert("Ações gravadas com sucesso e transferidas para o campo de comando!");
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { script, playbook } = await generateAutomationArtifacts(config);
      
      const dockerfile = generateDockerfile();
      const packageJson = generatePackageJson(config.serviceName);
      const cloudBuild = generateCloudBuild(config);
      const entrypoint = generateEntrypoint(config);
      const setupScript = generateSetupScript(config);
      const localRunScript = generateLocalRunScript(config);

      setArtifacts({
        playwrightScript: script,
        playbookJson: JSON.stringify(playbook, null, 2),
        dockerfile,
        packageJson,
        cloudBuildYaml: cloudBuild,
        entrypoint,
        setupScript,
        localRunScript
      });

      setStep(AppStep.SCRIPT_GEN);
    } catch (error) {
      console.error(error);
      alert("O robô está muito preguiçoso hoje (Erro na API). Verifique sua chave e tente de novo.");
    } finally {
      setLoading(false);
    }
  };

  const renderDocModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
       <div className="bg-[#1a0033]/95 border-2 border-lazy-neonBlue w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl shadow-[0_0_40px_rgba(0,186,255,0.4)] relative flex flex-col">
          
          <div className="flex justify-between items-center p-6 border-b border-lazy-panel bg-lazy-panel/40 backdrop-blur sticky top-0 z-10">
             <h2 className="text-xl font-bold text-lazy-neonBlue flex items-center gap-3 tracking-wider">
                <Book className="text-lazy-neonBlue" size={24} /> 
                DOCUMENTAÇÃO DO PREGUIÇOSO
             </h2>
             <button 
                onClick={() => setShowDoc(false)} 
                className="text-lazy-text hover:text-lazy-neonPink hover:bg-lazy-panel/50 p-2 rounded-lg transition-all"
             >
                <X size={24} strokeWidth={3} />
             </button>
          </div>
  
          <div className="p-8 space-y-8 text-sm leading-relaxed text-lazy-text/90 font-mono overflow-y-auto custom-scrollbar">
             <section>
                <h3 className="text-lazy-neonPink font-bold text-base mb-4 uppercase tracking-widest border-l-4 border-lazy-neonPink pl-4 flex items-center gap-2">
                  O que é o Preguiçoso
                </h3>
                <div className="bg-lazy-panel/30 p-4 rounded-lg border border-lazy-text/10">
                   <p className="opacity-90">O Preguiçoso é um assistente de automação inteligente que grava suas ações no navegador e as repete automaticamente. Ideal para quem quer eliminar tarefas repetitivas de forma rápida e sem precisar programar uma linha de código sequer.</p>
                </div>
             </section>
  
             <section>
                <h3 className="text-lazy-yellow font-bold text-base mb-4 uppercase tracking-widest border-l-4 border-lazy-yellow pl-4 flex items-center gap-2">
                   Funcionalidades Principais
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <li className="bg-lazy-dark p-3 rounded border border-lazy-text/10 flex items-center gap-2 hover:border-lazy-yellow/50 transition-colors">
                      <span className="text-lazy-yellow">🎬</span> 
                      <span><strong>Gravar ações</strong> (cliques, inputs)</span>
                   </li>
                   <li className="bg-lazy-dark p-3 rounded border border-lazy-text/10 flex items-center gap-2 hover:border-lazy-yellow/50 transition-colors">
                      <span className="text-lazy-yellow">▶️</span> 
                      <span><strong>Player Local:</strong> Teste na hora</span>
                   </li>
                   <li className="bg-lazy-dark p-3 rounded border border-lazy-text/10 flex items-center gap-2 hover:border-lazy-yellow/50 transition-colors">
                      <span className="text-lazy-yellow">💾</span> 
                      <span><strong>Exportar</strong> para JSON/Playwright</span>
                   </li>
                   <li className="bg-lazy-dark p-3 rounded border border-lazy-text/10 flex items-center gap-2 hover:border-lazy-yellow/50 transition-colors">
                      <span className="text-lazy-yellow">☁️</span> 
                      <span><strong>Cloud Run:</strong> Agende 24/7</span>
                   </li>
                </ul>
             </section>
  
             <section>
                <h3 className="text-lazy-neonBlue font-bold text-base mb-4 uppercase tracking-widest border-l-4 border-lazy-neonBlue pl-4 flex items-center gap-2">
                   Como usar na forma real (v2.6)
                </h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-lazy-neonBlue text-lazy-dark font-bold w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs">1</div>
                        <p>Acesse a aba <strong>"KIT EXTENSÃO PRO"</strong> neste app e baixe o arquivo ZIP completo.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-lazy-neonBlue text-lazy-dark font-bold w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs">2</div>
                        <p>Instale no Chrome: Vá em <code>chrome://extensions</code>, ative o "Modo do desenvolvedor" e clique em "Carregar sem compactação" (selecione a pasta extraída).</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-lazy-neonBlue text-lazy-dark font-bold w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs">3</div>
                        <p>Navegue no site alvo. O robô grava tudo automaticamente em silêncio.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-lazy-neonBlue text-lazy-dark font-bold w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs">4</div>
                        <div>
                            <p className="mb-2">Clique no ícone da extensão para abrir o Painel:</p>
                            <ul className="list-disc pl-4 space-y-1 text-lazy-text/80">
                                <li>Aba <strong>GRAVAR</strong>: Clique em "Copiar JSON" para colar no App Preguiçoso e gerar o robô de nuvem.</li>
                                <li>Aba <strong>EXECUTAR</strong>: Cole um JSON e clique em "▶️ Rodar" para ver o robô controlando seu mouse na hora!</li>
                            </ul>
                        </div>
                    </div>
                </div>
             </section>
          </div>
       </div>
    </div>
  );

  const renderConfig = () => (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-12">
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        
        {/* Coluna 1: Entrada de Gravação */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-lazy-neonBlue rounded-2xl opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-lazy-panel/80 backdrop-blur-xl border-2 border-lazy-neonBlue/50 p-8 rounded-2xl h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-lazy-neonBlue flex items-center gap-3 tracking-wider">
                  <Coffee size={24} />
                  ENTRADAS DE GRAVAÇÃO
              </h3>
              <div className="px-2 py-1 bg-lazy-neonBlue/20 border border-lazy-neonBlue text-lazy-neonBlue text-[10px] font-bold uppercase rounded">
                  Input
              </div>
            </div>
            
            <div className="space-y-6 flex-grow flex flex-col">
              <div>
                <label className="block text-xs font-bold text-lazy-neonBlue mb-2 uppercase tracking-widest">URL Alvo</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-lazy-neonBlue rounded opacity-0 group-focus-within/input:opacity-100 blur transition duration-300"></div>
                  <input 
                    type="text" 
                    value={config.targetUrl}
                    onChange={(e) => setConfig({...config, targetUrl: e.target.value})}
                    className="relative w-full bg-lazy-dark border border-lazy-neonBlue/30 rounded px-4 py-3 text-lazy-text focus:outline-none focus:border-lazy-neonBlue focus:bg-lazy-base transition-all font-mono text-sm placeholder-lazy-text/30"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-lazy-neonBlue uppercase tracking-widest">Comando ou JSON</label>
                  <label className="cursor-pointer flex items-center gap-2 text-[10px] font-bold bg-lazy-neonBlue/10 hover:bg-lazy-neonBlue/20 px-2 py-1 rounded text-lazy-neonBlue transition-all border border-lazy-neonBlue/30 uppercase">
                    <Upload size={12} />
                    Carregar Arquivo
                    <input 
                      type="file" 
                      accept=".json,.js,.txt" 
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="relative group/area flex-grow h-full">
                  <div className="absolute -inset-0.5 bg-lazy-neonBlue rounded opacity-0 group-focus-within/area:opacity-100 blur transition duration-300"></div>
                  <textarea 
                    value={config.taskDescription}
                    onChange={(e) => setConfig({...config, taskDescription: e.target.value})}
                    className="relative w-full h-64 lg:h-full bg-lazy-dark border border-lazy-neonBlue/30 rounded px-4 py-4 text-lazy-text focus:outline-none focus:border-lazy-neonBlue focus:bg-lazy-base transition-all font-mono text-xs leading-relaxed resize-none placeholder-lazy-text/30"
                    placeholder='Cole seu JSON do Chrome Recorder ou descreva: "Acesse o site, clique no botão..."'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Agendamentos e Infra */}
        <div className="space-y-8">
          
          {/* Card Agendamento */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-lazy-neonPink rounded-2xl opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-lazy-panel/80 backdrop-blur-xl border-2 border-lazy-neonPink/50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-lazy-neonPink mb-6 flex items-center gap-3 tracking-wider">
                  <Clock size={24} />
                  AGENDAMENTOS & ALERTAS
              </h3>
              
              <div className="space-y-5">
                  <div>
                  <label className="block text-xs font-bold text-lazy-neonPink mb-2 uppercase tracking-widest">Cron Schedule</label>
                  <div className="relative group/input">
                      <div className="absolute -inset-0.5 bg-lazy-neonPink rounded opacity-0 group-focus-within/input:opacity-100 blur transition duration-300"></div>
                      <input 
                          type="text" 
                          value={config.cronSchedule}
                          onChange={(e) => setConfig({...config, cronSchedule: e.target.value})}
                          className="relative w-full bg-lazy-dark border border-lazy-neonPink/30 rounded px-4 py-3 text-lazy-text focus:outline-none focus:border-lazy-neonPink font-mono text-sm"
                          placeholder="0 9 * * *"
                      />
                  </div>
                  <p className="text-[10px] text-lazy-neonPink/70 mt-2 font-bold">ℹ️ Ex: 0 9 * * * (Todo dia às 09:00)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-lazy-neonPink mb-2 uppercase tracking-widest flex items-center gap-2"><Mail size={12}/> Email</label>
                      <input 
                          type="text" 
                          value={config.alertEmail}
                          onChange={(e) => setConfig({...config, alertEmail: e.target.value})}
                          className="w-full bg-lazy-dark border border-lazy-neonPink/30 rounded px-3 py-2 text-xs text-lazy-text focus:outline-none focus:border-lazy-neonPink transition-colors"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-lazy-neonPink mb-2 uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> WhatsApp</label>
                      <input 
                          type="text" 
                          value={config.alertWhatsapp}
                          onChange={(e) => setConfig({...config, alertWhatsapp: e.target.value})}
                          className="w-full bg-lazy-dark border border-lazy-neonPink/30 rounded px-3 py-2 text-xs text-lazy-text focus:outline-none focus:border-lazy-neonPink transition-colors"
                      />
                  </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Card Infraestrutura */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-lazy-yellow rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-lazy-panel/80 backdrop-blur-xl border-2 border-lazy-yellow/50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-lazy-yellow mb-6 flex items-center gap-3 tracking-wider">
                  <Cloud size={24} />
                  INFRAESTRUTURA (GCP)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-[10px] font-bold text-lazy-yellow mb-1 uppercase tracking-widest">Projeto ID</label>
                  <input 
                      type="text" 
                      value={config.projectId}
                      onChange={(e) => setConfig({...config, projectId: e.target.value})}
                      className="w-full bg-lazy-dark border border-lazy-yellow/30 rounded px-3 py-2 text-xs text-lazy-text focus:outline-none focus:border-lazy-yellow transition-colors"
                  />
                  </div>
                  <div>
                  <label className="block text-[10px] font-bold text-lazy-yellow mb-1 uppercase tracking-widest">Região</label>
                  <input 
                      type="text" 
                      value={config.region}
                      onChange={(e) => setConfig({...config, region: e.target.value})}
                      className="w-full bg-lazy-dark border border-lazy-yellow/30 rounded px-3 py-2 text-xs text-lazy-text focus:outline-none focus:border-lazy-yellow transition-colors"
                  />
                  </div>
                  <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-lazy-yellow mb-1 uppercase tracking-widest">Nome do Secret (Senha)</label>
                      <div className="flex items-center bg-lazy-dark border border-lazy-yellow/30 rounded px-3 py-2">
                          <Key size={12} className="text-lazy-yellow mr-2"/>
                          <input 
                              type="text" 
                              value={config.secretName}
                              onChange={(e) => setConfig({...config, secretName: e.target.value})}
                              className="w-full bg-transparent text-xs text-lazy-text focus:outline-none"
                          />
                      </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="relative w-full group overflow-hidden rounded-xl disabled:opacity-50"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-lazy-neonBlue via-purple-500 to-lazy-neonPink opacity-80 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative px-8 py-4 flex items-center justify-center gap-4 font-black text-white tracking-widest uppercase text-lg">
                   {loading ? (
                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                   ) : (
                       <>
                          <Zap className="animate-pulse" fill="currentColor" />
                          GERAR AGENTE AUTOMÁTICO
                       </>
                   )}
              </div>
          </button>
        </div>
      </div>

      {/* Gravador PRO (Embed) */}
      <ActionRecorder onRecordingComplete={handleRecordingComplete} />
    </div>
  );

  return (
    <div className="min-h-screen text-lazy-text font-mono relative overflow-hidden transition-all duration-500"
         style={{ filter: partyMode ? 'hue-rotate(90deg) invert(1)' : 'none' }}>
      
      {/* SPLASH SCREEN */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {showGame && <GalacticGame onClose={() => setShowGame(false)} />}

      <PixelBackground />
      {showDoc && renderDocModal()}

      {/* SECRET CHAT MODAL */}
      {showSecretChat && (
          <div id="chatPreguicoso" className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fade-in backdrop-blur-sm">
            <div className="bg-lazy-base/95 border-2 border-lazy-neonBlue rounded-xl shadow-[0_0_25px_#00baff] w-[90%] max-w-[400px] p-4 text-lazy-text font-mono relative flex flex-col h-[450px]">
                <button 
                    onClick={() => setShowSecretChat(false)} 
                    className="absolute top-2 right-3 text-lazy-neonBlue hover:text-lazy-neonPink transition-colors"
                >
                    <X size={20} />
                </button>
                <h2 className="text-lazy-neonBlue text-sm font-bold mb-2 border-b border-lazy-neonBlue/30 pb-2 flex items-center gap-2">
                    <Terminal size={14}/> preguiçoso.exe
                </h2>
                
                {/* Terminal Area */}
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-[#0e0022]/50 border border-lazy-neonBlue/30 rounded p-3 text-sm space-y-3 custom-scrollbar mb-3 shadow-inner">
                    {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`${msg.sender === 'bot' ? 'text-lazy-yellow' : 'text-white text-right'}`}>
                            <span className="opacity-50 text-[10px] block mb-0.5">
                                {msg.sender === 'bot' ? '> Preguiçoso:' : '> Você:'}
                            </span>
                            <span className="break-words">{msg.text}</span>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                    <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                        className="flex-1 bg-lazy-panel/60 border border-lazy-neonBlue/30 rounded p-2 text-sm text-white outline-none focus:border-lazy-neonBlue transition-all placeholder-lazy-text/30" 
                        placeholder="Digite aqui..." 
                        autoFocus
                    />
                    <button 
                        onClick={handleChatSubmit}
                        className="bg-lazy-neonBlue/20 hover:bg-lazy-neonBlue text-lazy-neonBlue hover:text-lazy-dark border border-lazy-neonBlue/50 px-3 rounded transition-all flex items-center justify-center"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
          </div>
      )}

      <div className="relative z-10 p-6 sm:p-12 flex flex-col min-h-screen">
        
        {/* Header REVERTED to Center Layout */}
        <header className="flex flex-col items-center mb-12 animate-float relative z-20">
            
            {/* Icon Container (Centered Box) */}
            <div 
                onClick={handleMascotClick}
                className="relative group cursor-pointer mb-8"
            >
                <div className="absolute inset-0 bg-lazy-neonBlue blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                <div className="relative border-4 border-lazy-neonBlue rounded-3xl p-6 bg-lazy-dark/50 backdrop-blur-sm shadow-[0_0_40px_rgba(0,186,255,0.3)] group-hover:scale-105 transition-transform duration-300">
                     <Bot size={80} className={`text-lazy-neonBlue ${mascotClicks >= 5 ? 'animate-spin duration-75' : ''}`} strokeWidth={1.5} />
                </div>
                
                {/* Easter Egg Bubble */}
                {mascotMessage && (
                     <div className="absolute -right-40 top-0 bg-white text-black text-xs p-3 rounded-xl font-bold animate-fade-in border-4 border-lazy-neonPink z-50 w-40 text-center shadow-2xl rotate-6">
                        {mascotMessage}
                        <div className="absolute top-6 -left-3 w-5 h-5 bg-white transform rotate-45 border-l-4 border-b-4 border-lazy-neonPink"></div>
                     </div>
                )}
            </div>

            {/* Title (Gradient & Big) */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lazy-neonBlue via-white to-lazy-neonBlue animate-pulse-slow">
                    Preguiçoso
                </span>
                <span className="text-lazy-neonPink">.</span>
            </h1>

            {/* Purple/Pink Slogan Banner with LONG PRESS Easter Egg */}
            <div className="w-full max-w-2xl border border-lazy-neonPink/30 bg-lazy-neonPink/10 rounded-none p-3 text-center mb-6 backdrop-blur-sm select-none active:scale-95 transition-transform -rotate-1">
                <p 
                    className="text-lazy-neonPink font-bold tracking-[0.2em] text-xs md:text-sm uppercase cursor-help"
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                >
                    Automatize tudo. Trabalhe menos. Codifique mais.
                </p>
            </div>

            {/* LazyTools Slogan */}
            <p className="text-sm md:text-base font-bold tracking-widest text-lazy-text/60 text-center max-w-3xl">
                 Muito mais que um <span className="line-through opacity-50 decoration-2">DevTools</span>... é um <span className="text-lazy-yellow animate-pulse text-lg">LazyTools</span>!
                 <br className="hidden md:block" />
                 <span className="text-xs opacity-70 mt-1 block md:inline md:mt-0 md:ml-2 font-bold text-lazy-neonPink">O ÚNICO QUE TRABALHA ENQUANTO VOCÊ DESCANSA.</span>
            </p>
        </header>

        <StepIndicator currentStep={step} />

        <main className="flex-grow">
          {step === AppStep.CONFIG && renderConfig()}
          
          {step === AppStep.SCRIPT_GEN && artifacts && (
            <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-lazy-panel/80 backdrop-blur border-2 border-lazy-neonBlue/50 rounded-xl overflow-hidden">
                             <div className="bg-lazy-dark px-6 py-4 border-b border-lazy-neonBlue/20 flex items-center gap-3">
                                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                 <span className="ml-4 font-mono text-xs text-lazy-text/50">playbook.json</span>
                             </div>
                             <div className="p-6">
                                <CodeViewer filename="playbook.json" code={artifacts.playbookJson} />
                             </div>
                        </div>
                        <CodeViewer filename="script.js" code={artifacts.playwrightScript} />
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-lazy-panel/50 rounded-xl p-6 border border-lazy-text/10">
                            <h3 className="text-lazy-neonPink font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                                <Cloud size={18}/> Deploy no Cloud Run
                            </h3>
                            <CodeViewer filename="Dockerfile" code={artifacts.dockerfile} />
                            <CodeViewer filename="cloudbuild.yaml" code={artifacts.cloudBuildYaml} />
                        </div>
                         <div className="bg-lazy-panel/50 rounded-xl p-6 border border-lazy-text/10">
                            <h3 className="text-lazy-yellow font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={18}/> Setup de Agendamento
                            </h3>
                            <CodeViewer filename="setup.sh" code={artifacts.setupScript} />
                        </div>
                    </div>
                </div>
            </div>
          )}
        </main>
        
        {/* Hall of Fame */}
        <HallOfFame />

        {/* Footer Credits */}
        <footer className="w-full text-center pb-8 pt-4 text-[10px] font-bold tracking-widest text-lazy-text/30 hover:text-lazy-text/60 transition-colors cursor-default select-none">
            FEITO COM <span className="text-lazy-neonPink animate-pulse">PREGUIÇA INTELIGENTE</span> POR <span className="text-lazy-neonBlue">LUCAS SANCHES</span> 🦜
        </footer>

        {/* HIDDEN EASTER EGG: Galactic Game Trigger (Sloth Character) */}
        <img 
            src="https://firebasestorage.googleapis.com/v0/b/volta-as-aulas-2026.firebasestorage.app/o/action-record%2FChatGPT%20Image%2022%20de%20nov.%20de%202025%2C%2014_25_55%20(2).png?alt=media&token=39c17e6b-51ce-42dd-893f-d472d2d9e75f"
            onClick={() => setShowGame(true)}
            className="fixed bottom-4 left-4 w-16 h-16 object-contain cursor-pointer opacity-30 hover:opacity-100 hover:scale-110 transition-all duration-500 z-50"
            title="Zzz... (Clique aqui)"
            alt="Segredo"
        />

        {/* Footer Buttons Container */}
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-3">
            
            {/* GitHub Button */}
            <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-lazy-dark hover:bg-lazy-panel text-lazy-neonPink p-3 rounded-lg shadow-[0_0_15px_rgba(255,79,240,0.2)] hover:shadow-[0_0_25px_rgba(255,79,240,0.4)] transition-all duration-300 border border-lazy-neonPink/30 hover:border-lazy-neonPink group"
                title="GitHub"
            >
               <Github size={24} className="group-hover:scale-110 transition-transform" />
            </a>

            {/* Docs Button */}
            <button 
               onClick={() => setShowDoc(true)}
               className="bg-lazy-neonBlue hover:bg-lazy-neonPink text-lazy-dark font-bold px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,186,255,0.5)] hover:shadow-[0_0_30px_rgba(255,79,240,0.6)] transition-all duration-300 flex items-center gap-2 border-2 border-white/20 group"
            >
               <Book className="group-hover:rotate-12 transition-transform" size={20} />
               📘 Documentação
            </button>
        </div>
      </div>
    </div>
  );
}