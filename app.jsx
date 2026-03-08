import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  ArrowRight,
  CheckCircle2,
  Trash2,
  MoveHorizontal,
  CornerDownLeft,
  Delete as BackspaceIcon,
  ArrowUp,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Info,
  Copy,
  ClipboardPaste,
  Star,
  Sparkles,
  AlertCircle,
  Zap,
  Target,
  ShieldAlert,
  Sword
} from 'lucide-react';

// --- 이미지 자산 ---
const SHIN_IMG = "https://i.ibb.co/Q3yff3rD/image.png";
const ACTION_MASK_IMG = "https://i.ibb.co/XrK5k4sV/1.png";
const VILLAIN_IMG = "https://i.ibb.co/kgLsW9KH/image.png"; // 원장 선생님(두목님)

// --- 데이터 정의 ---
const KEYBOARD_THEORY = [
  {
    id: 'basic',
    title: '공격과 방어 (삭제/입력)',
    keys: [
      { name: 'Backspace', desc: '커서 앞글자를 지워요. 오타 빌런을 물리칠 때 기본이죠!', icon: <BackspaceIcon size={20} /> },
      { name: 'Delete', desc: '커서 뒷글자를 지워요. 자리에 서서 뒤를 공격!', icon: <Trash2 size={20} /> },
      { name: 'Enter', desc: '결정타를 날리거나 다음 줄로 이동할 때 쾅!', icon: <CornerDownLeft size={20} /> },
    ]
  },
  {
    id: 'special',
    title: '변신 기술 (조합/이동)',
    keys: [
      { name: 'Shift', desc: '쌍자음 파워! 누른 채로 자음을 누르면 강해져요.', icon: <ArrowUp size={20} /> },
      { name: 'Home / End', desc: '줄의 처음과 끝으로 순간이동하는 고급 기술!', icon: <MoveHorizontal size={20} /> },
    ]
  },
  {
    id: 'shortcut',
    title: '마법의 복제술 (단축키)',
    keys: [
      { name: 'Ctrl + C / V', desc: '에너지를 복사해서 무한으로 붙여넣는 마법!', icon: <Copy size={20} /> },
      { name: 'Ctrl + A', desc: '화면의 모든 에너지를 한꺼번에 선택해요.', icon: <Target size={20} /> },
    ]
  }
];

const STAGES = [
  {
    id: 1,
    level: '기초',
    title: "두목님의 젤리 가로채기",
    charSay: "짱구야! 두목님이 젤리를 다 가져가기 전에 쌍자음을 입력해!",
    villainSay: "흐흐흐... 쌍자음을 쓸 줄 모르면 젤리는 내 것이다!",
    instruction: "Shift를 누른 채 자음을 써서 단어를 완성해!",
    type: 'typing',
    targets: ['토끼', '뿌리', '아빠', '코끼리', '쓱싹쓱싹'],
    failMsg: "정확히 입력해야 해! Shift 키를 잊지 마!"
  },
  {
    id: 2,
    level: '기초',
    title: "오타 폭탄 해체",
    charSay: "액션가면! 폭탄 글자 사이에 '꽝'이 섞여있어! 지워줘!",
    villainSay: "어디 한번 'Delete' 키로 '꽝'만 쏙 지워보시지!",
    instruction: "커서를 잘 옮겨서 '꽝' 글자만 Delete로 지워봐!",
    type: 'edit',
    text: '액션가면은 꽝최고!',
    targetText: '액션가면은 최고!',
    hint: "커서를 '은'과 '꽝' 사이에 두고 Delete를 눌러!",
    failMsg: "틀렸어! '꽝' 뒤에서 Backspace를 쓰거나 앞에서 Delete를 써야지!"
  },
  {
    id: 3,
    level: '심화',
    title: "두목님의 비밀 문서 복제",
    charSay: "두목님의 비밀 작전을 복사해서 액션본부에 알려야 해!",
    villainSay: "내 작전은 너무 길어서 복사 못 할걸? 하하하!",
    instruction: "문장을 선택하고 Ctrl+C 한 뒤, 입력창에 Ctrl+V 해!",
    type: 'shortcut',
    text: '비밀작전: 유치원 간식은 내가 다 먹는다!',
    targetAction: 'paste',
    hint: "Ctrl+A로 선택 -> Ctrl+C 복사 -> Ctrl+V 붙여넣기",
    failMsg: "단축키는 Ctrl 키를 먼저 누른 상태에서 다른 키를 눌러야 해!"
  },
  {
    id: 4,
    level: '심화',
    title: "순간이동 탈출 미션",
    charSay: "두목님이 쫓아와! 커서를 문장 맨 앞으로 순간이동시켜!",
    villainSay: "어딜 도망가! 마우스 없이 맨 앞으로 갈 수 있을까?",
    instruction: "Home 키를 눌러 맨 앞으로 가서 '탈출!'을 적어줘!",
    type: 'nav',
    text: '짱구 성공',
    targetText: '탈출!짱구 성공',
    hint: "Home 키로 커서를 맨 앞으로 보내고 '탈출!'을 써봐.",
    failMsg: "Home 키를 누르면 한 번에 맨 앞으로 갈 수 있어. 다시 해봐!"
  },
  {
    id: 5,
    level: '마스터',
    title: "최종 결전: 키보드 마스터",
    charSay: "이제 마지막이야! 모든 기술을 써서 두목님을 설득하자!",
    villainSay: "이 긴 문장을 오타 없이 고칠 수 있다면 항복하마!",
    instruction: "오타 지우기, 줄 바꾸기, 쌍자음까지 모두 사용해!",
    type: 'edit',
    text: '유치원은 즐거워용',
    targetText: '유치원은\n정말 즐거워!!',
    hint: "Enter로 줄 바꾸기, Delete로 지우기, Shift로 쌍자음!!",
    failMsg: "포기하지 마! 모든 키를 조합해서 완성하는 거야!"
  }
];

export default function App() {
  const [view, setView] = useState('main');
  const [currentStage, setCurrentStage] = useState(0);
  const [gameState, setGameState] = useState({
    input: '',
    completed: false,
    message: '',
    targetIdx: 0,
    isCtrlPressed: false,
    clipboard: '',
    showError: false
  });

  const startLevel = (idx) => {
    setCurrentStage(idx);
    const stage = STAGES[idx];
    setGameState({
      input: (stage.type === 'typing' || stage.type === 'shortcut') ? '' : stage.text,
      completed: false,
      message: '',
      targetIdx: 0,
      isCtrlPressed: false,
      clipboard: '',
      showError: false
    });
    setView('game');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view !== 'game') return;
      if (e.ctrlKey) {
        setGameState(prev => ({ ...prev, isCtrlPressed: true }));
        const stage = STAGES[currentStage];
        if (stage.type === 'shortcut') {
          const key = e.key.toLowerCase();
          if (key === 'c') {
            e.preventDefault();
            setGameState(prev => ({ ...prev, message: '📋 복사 성공! 이제 붙여넣어!', clipboard: stage.text }));
          } else if (key === 'v') {
            e.preventDefault();
            if (gameState.clipboard === stage.text) {
              setGameState(prev => ({ ...prev, input: stage.text, completed: true }));
            } else {
              setGameState(prev => ({ ...prev, showError: true, message: stage.failMsg }));
            }
          }
        }
      }
    };
    const handleKeyUp = (e) => { if (e.key === 'Control') setGameState(prev => ({ ...prev, isCtrlPressed: false })); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [view, currentStage, gameState.clipboard]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    const stage = STAGES[currentStage];
    setGameState(prev => ({ ...prev, showError: false }));

    if (stage.type === 'typing') {
      const currentTarget = stage.targets[gameState.targetIdx];
      setGameState(prev => ({ ...prev, input: val }));

      if (val === currentTarget) {
        if (gameState.targetIdx < stage.targets.length - 1) {
          setGameState(prev => ({ ...prev, input: '', targetIdx: prev.targetIdx + 1, message: '정답이야! 다음 단어!' }));
        } else {
          setGameState(prev => ({ ...prev, completed: true }));
        }
      } else if (val.length >= currentTarget.length && val !== currentTarget) {
        setGameState(prev => ({ ...prev, showError: true, message: stage.failMsg }));
      }
    } else {
      setGameState(prev => ({ ...prev, input: val }));
      if (val.replace(/\r/g, "") === stage.targetText) {
        setGameState(prev => ({ ...prev, completed: true }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-800 font-sans selection:bg-blue-200">
      {/* 네비게이션 */}
      <nav className="bg-white border-b-4 border-yellow-400 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('main')}>
          <div className="relative">
            <img src={ACTION_MASK_IMG} alt="Action" className="w-10 h-10" />
            <img src={SHIN_IMG} alt="Shin" className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white" />
          </div>
          <span className="font-black text-xl text-yellow-600 tracking-tight italic">KEYBOARD DEFENSE</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('theory')} className="px-4 py-2 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm">비밀 지도</button>
          <button onClick={() => startLevel(0)} className="px-4 py-2 rounded-xl font-bold bg-yellow-500 text-white shadow-md hover:bg-yellow-600 text-sm">연습 게임</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* 메인 화면 */}
        {view === 'main' && (
          <div className="text-center py-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-center items-center gap-4">
              <img src={SHIN_IMG} alt="Shin" className="w-24 h-24 drop-shadow-lg" />
              <div className="bg-white p-4 rounded-3xl border-4 border-yellow-400 font-black shadow-lg relative">
                "두목님! 아니, 원장 선생님을 이겨보자!"
                <div className="absolute -left-3 top-4 w-4 h-4 bg-white border-l-4 border-t-4 border-yellow-400 rotate-[-45deg]"></div>
              </div>
            </div>

            <div className="relative inline-block">
              <img src={ACTION_MASK_IMG} alt="Hero" className="w-40 h-40 animate-bounce duration-[3000ms] drop-shadow-2xl" />
              <img src={VILLAIN_IMG} alt="Boss" className="w-32 h-32 absolute -right-24 bottom-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight">키보드 수호대:<br /><span className="text-yellow-500">두목님의 습격!</span></h1>
              <p className="text-lg text-slate-500 font-bold">"액션가면과 함께 키보드 기술을 완벽하게 익히자!"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <button onClick={() => setView('theory')} className="bg-white p-8 rounded-[40px] border-4 border-slate-100 hover:border-blue-400 text-left transition-all hover:-translate-y-2 shadow-xl group">
                <BookOpen className="text-blue-500 mb-4 group-hover:scale-125 transition-transform" size={40} />
                <h3 className="text-2xl font-black mb-1">마법 지도 공부</h3>
                <p className="text-slate-400 font-bold">버튼들의 비밀을 그림으로 배워요.</p>
              </button>
              <button onClick={() => startLevel(0)} className="bg-white p-8 rounded-[40px] border-4 border-slate-100 hover:border-yellow-400 text-left transition-all hover:-translate-y-2 shadow-xl group">
                <Sword className="text-red-500 mb-4 group-hover:scale-125 transition-transform" size={40} />
                <h3 className="text-2xl font-black mb-1">두목님과 대결</h3>
                <p className="text-slate-400 font-bold">기초부터 심화까지! 실전 대결!</p>
              </button>
            </div>
          </div>
        )}

        {/* 이론 공부 */}
        {view === 'theory' && (
          <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <h2 className="text-4xl font-black text-center text-blue-600 mb-10 underline underline-offset-8 decoration-blue-200">키보드 비밀 지도 🗺️</h2>
            <div className="grid gap-6">
              {KEYBOARD_THEORY.map(section => (
                <div key={section.id} className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-slate-50 overflow-hidden relative">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" /> {section.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {section.keys.map(k => (
                      <div key={k.name} className="flex gap-4 p-5 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-blue-200 hover:bg-white transition-all">
                        <div className="bg-white w-14 h-14 rounded-2xl shadow-md border-2 border-slate-200 flex items-center justify-center font-black text-blue-600 text-xs uppercase shrink-0">
                          {k.name.split(' ')[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 flex items-center gap-1">{k.icon} {k.name}</p>
                          <p className="text-sm text-slate-500 mt-1 font-bold leading-relaxed">{k.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-6">
              <button onClick={() => startLevel(0)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-5 rounded-[30px] font-black text-2xl shadow-xl transition-all hover:scale-105">대결 시작! 하하하!</button>
            </div>
          </div>
        )}

        {/* 게임 화면 */}
        {view === 'game' && (
          <div className="animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            {/* 상단 대화 영역 */}
            <div className="flex items-start justify-between mb-8 gap-4">
              <div className="flex-1 space-y-4">
                <div className="bg-white px-6 py-4 rounded-3xl border-4 border-blue-400 relative shadow-md">
                  <div className="absolute -left-3 top-4 w-4 h-4 bg-white border-l-4 border-t-4 border-blue-400 rotate-[-45deg]"></div>
                  <p className="font-black text-blue-700 text-sm leading-tight italic">"{STAGES[currentStage].charSay}"</p>
                </div>
                <div className="bg-red-50 px-6 py-4 rounded-3xl border-4 border-red-400 relative shadow-md self-end ml-10">
                  <div className="absolute -right-3 top-4 w-4 h-4 bg-red-50 border-r-4 border-t-4 border-red-400 rotate-[45deg]"></div>
                  <p className="font-black text-red-700 text-sm leading-tight">"{STAGES[currentStage].villainSay}"</p>
                </div>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <img src={VILLAIN_IMG} alt="Villain" className="w-20 h-20 rounded-2xl shadow-xl border-4 border-white mb-2" />
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">BOSS</span>
              </div>
            </div>

            <div className="bg-white rounded-[50px] p-8 md:p-12 shadow-2xl border-b-[16px] border-slate-200 relative overflow-hidden">
              <div className="absolute top-4 left-6">
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Level {STAGES[currentStage].level}</span>
              </div>

              <div className="text-center space-y-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{STAGES[currentStage].title}</h3>
                  <p className="text-lg font-bold text-yellow-600">{STAGES[currentStage].instruction}</p>
                </div>

                <div className="min-h-[140px] flex flex-col justify-center items-center">
                  {STAGES[currentStage].type === 'typing' ? (
                    <div className="space-y-4">
                      <div className="text-7xl font-black text-slate-900 tracking-tight drop-shadow-sm">
                        {STAGES[currentStage].targets[gameState.targetIdx]}
                      </div>
                      <div className="flex justify-center gap-2">
                        {STAGES[currentStage].targets.map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full ${i === gameState.targetIdx ? 'bg-yellow-500 w-10' : i < gameState.targetIdx ? 'bg-green-400' : 'bg-slate-200'} transition-all duration-300`} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="text-3xl font-black text-slate-700 bg-slate-50 p-8 rounded-[35px] border-4 border-dashed border-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {STAGES[currentStage].targetText || STAGES[currentStage].text}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  {/* 반복 숙달 안내 (에러 메시지) */}
                  {gameState.showError && (
                    <div className="absolute -top-20 left-0 right-0 flex justify-center animate-in slide-in-from-top-4 duration-300">
                      <div className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 border-4 border-white">
                        <img src={VILLAIN_IMG} className="w-8 h-8 rounded-full" alt="" />
                        {gameState.message}
                      </div>
                    </div>
                  )}

                  <div className={`absolute -top-12 left-6 flex gap-2 transition-all ${gameState.isCtrlPressed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <div className="bg-blue-600 text-white px-5 py-1.5 rounded-xl font-black text-sm shadow-lg border-2 border-white">Ctrl 기술 발동!</div>
                  </div>

                  {STAGES[currentStage].type === 'edit' || STAGES[currentStage].id === 5 ? (
                    <textarea
                      value={gameState.input}
                      onChange={handleInputChange}
                      disabled={gameState.completed}
                      autoFocus
                      spellCheck={false}
                      className={`w-full text-3xl p-8 rounded-[35px] border-[6px] transition-all text-center outline-none shadow-inner font-black h-40 resize-none leading-relaxed ${gameState.completed
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : gameState.showError ? 'border-red-500 bg-red-50 shake' : 'border-slate-100 focus:border-yellow-400 bg-slate-50 focus:bg-white'
                        }`}
                      placeholder="정확하게 입력해줘!"
                    />
                  ) : (
                    <input
                      type="text"
                      value={gameState.input}
                      onChange={handleInputChange}
                      disabled={gameState.completed}
                      autoFocus
                      spellCheck={false}
                      className={`w-full text-4xl p-10 rounded-[45px] border-[6px] transition-all text-center outline-none shadow-inner font-black ${gameState.completed
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : gameState.showError ? 'border-red-500 bg-red-50 shake' : 'border-slate-100 focus:border-yellow-400 bg-slate-50 focus:bg-white'
                        }`}
                      placeholder="여기에 입력!"
                    />
                  )}

                  {!gameState.showError && gameState.message && !gameState.completed && (
                    <div className="mt-6 font-black text-blue-600 text-xl flex justify-center items-center gap-2 animate-pulse">
                      <Sparkles size={24} /> {gameState.message}
                    </div>
                  )}
                </div>

                {STAGES[currentStage].hint && (
                  <div className="bg-amber-50 px-6 py-3 rounded-2xl border-2 border-amber-100 inline-block">
                    <p className="text-amber-700 font-bold text-sm flex items-center gap-2">
                      <Info size={18} /> 액션 힌트: {STAGES[currentStage].hint}
                    </p>
                  </div>
                )}
              </div>

              {/* 성공 결과 */}
              {gameState.completed && (
                <div className="absolute inset-0 bg-yellow-400/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 p-8 text-center z-50 rounded-[50px]">
                  <img src={ACTION_MASK_IMG} alt="Happy" className="w-56 h-56 mb-4 animate-bounce" />
                  <h3 className="text-6xl font-black text-white mb-2 italic drop-shadow-lg tracking-tighter">"으하하! 정의의 승리다!"</h3>
                  <p className="text-2xl text-yellow-900 font-bold mb-10">두목님도 네 실력에 깜짝 놀랐을 거야!</p>

                  <div className="flex gap-4">
                    {currentStage < STAGES.length - 1 ? (
                      <button
                        onClick={() => startLevel(currentStage + 1)}
                        className="bg-white text-yellow-600 px-12 py-6 rounded-[30px] font-black text-3xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-2xl active:scale-95 border-b-8 border-slate-200"
                      >
                        다음 미션 <ArrowRight size={32} />
                      </button>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xl shadow-xl">🏆 당신은 유치원 키보드 마스터!</div>
                        <button
                          onClick={() => setView('main')}
                          className="bg-white text-slate-900 px-12 py-6 rounded-[30px] font-black text-3xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-2xl mx-auto border-b-8 border-slate-200"
                        >
                          처음으로 <RotateCcw size={32} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-center gap-4">
              {STAGES.map((s, i) => (
                <div key={i} className={`h-4 rounded-full transition-all duration-700 ${i === currentStage ? 'w-24 bg-yellow-500 shadow-lg shadow-yellow-200' : (i < currentStage ? 'bg-green-400 w-8' : 'w-8 bg-slate-200')}`} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t-4 border-yellow-200 py-16 px-6 bg-white text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200"><img src={VILLAIN_IMG} className="w-6 h-6 rounded-full" alt="" /></div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200"><img src={ACTION_MASK_IMG} className="w-6 h-6" alt="" /></div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-yellow-200"><img src={SHIN_IMG} className="w-6 h-6" alt="" /></div>
          </div>
          <p className="text-slate-400 font-black text-sm uppercase tracking-widest italic">Action Mask Keyboard Master Training v3.0</p>
          <p className="text-slate-300 text-xs font-bold leading-relaxed">
            두목님의 오타 공격을 피하고 완벽한 타이핑을 익히세요!<br />
            반복 숙달만이 키보드 마스터가 되는 유일한 길입니다.
          </p>
        </div>
      </footer>

      {/* Shake 애니메이션 스타일 */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}