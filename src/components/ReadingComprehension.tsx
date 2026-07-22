import React, { useState } from "react";
import { BookOpen, HelpCircle, Check, AlertCircle, RefreshCw, Trophy, Sparkles } from "lucide-react";

export default function ReadingComprehension() {
  // Simple interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const handleCheckAnswers = () => {
    let currentScore = 0;
    if (q1 === "B") currentScore += 50;
    if (q2 === "C") currentScore += 50;
    setScore(currentScore);
    setShowQuizResult(true);
  };

  const handleResetQuiz = () => {
    setQ1(null);
    setQ2(null);
    setScore(null);
    setShowQuizResult(false);
  };

  return (
    <div className="bg-[#121214] border border-white/10 p-6 sm:p-8 space-y-6 text-white text-left animate-fadeIn">
      
      {/* Decorative Top Line */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              EASY GUIDE: HOW DOES CHATMINT WORK?
            </h3>
            <p className="text-[10px] text-white/40 font-mono">
              Written at a 6th-Grade Reading Level • Interactive Learning Section
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-widest font-black">
          Education Center
        </span>
      </div>

      {/* THE PROCESS STORYTELLING SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Story explanation */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-black text-[#7C3AED] uppercase tracking-wider">
            📖 The Story of Your Trading Card
          </h4>
          
          <div className="space-y-3.5 text-xs text-white/70 leading-relaxed">
            <p>
              Imagine if you had a super-smart computer friend and you designed an amazing invention together. You would want to show the whole world, right? <strong>ChatMint</strong> helps you do exactly that! We turn your smart conversations into digital trading cards called <strong>NFTs</strong>.
            </p>
            <p>
              An <strong>NFT</strong> is like a unique, unbreakable toy on the internet. Once you make it, it belongs to you and only you. Nobody can copy it, change it, or steal it.
            </p>
            <p className="p-3 bg-white/5 border-l-2 border-purple-500 font-mono text-[11px] text-purple-300">
              💡 <strong>What is a Blockchain?</strong> Think of a blockchain as a giant, magical notebook shared by millions of computers. Once a rule is written in this notebook, it can never be erased or scribbled over. It is there forever!
            </p>
          </div>
        </div>

        {/* Right Side: Step-by-Step Directions */}
        <div className="space-y-3 font-mono text-[10.5px]">
          <h4 className="text-xs font-sans font-black text-[#F472B6] uppercase tracking-wider">
            🚦 Step-by-Step Directions
          </h4>

          <div className="space-y-2 text-white/80">
            {/* Step 1 */}
            <div className="p-2.5 bg-black/40 border border-white/5 flex gap-2.5">
              <span className="text-[#7C3AED] font-black shrink-0">1.</span>
              <div>
                <strong className="text-white uppercase block mb-0.5">SHARE THE CHAT (INPUT)</strong>
                You paste a text conversation or upload a screenshot of your AI talks.
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 bg-black/40 border border-white/5 flex gap-2.5">
              <span className="text-[#7C3AED] font-black shrink-0">2.</span>
              <div>
                <strong className="text-white uppercase block mb-0.5">THE COMPUTER READS IT (ANALYZE)</strong>
                The AI brain scans your text to find the smartest ideas and designs your card's text.
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-2.5 bg-black/40 border border-white/5 flex gap-2.5">
              <span className="text-[#7C3AED] font-black shrink-0">3.</span>
              <div>
                <strong className="text-white uppercase block mb-0.5">SAFETY TEST (SECURITY CHECK)</strong>
                Our robotic helpers inspect the code to verify it is safe and ready.
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-2.5 bg-black/40 border border-white/5 flex gap-2.5">
              <span className="text-[#7C3AED] font-black shrink-0">4.</span>
              <div>
                <strong className="text-white uppercase block mb-0.5">STAMP IT ON BITCOIN L2 (MINT)</strong>
                We write the card's details onto a blockchain network called <strong>Stacks</strong>. Stacks is super-fast but stays as safe as <strong>Bitcoin</strong>!
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MINI READING COMPREHENSION QUIZ */}
      <div className="bg-black/40 border border-white/10 p-5 rounded-none space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-purple-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-white">
            🎓 Fun Quiz: Did You Learn the Process?
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-left">
          
          {/* Question 1 */}
          <div className="space-y-2">
            <p className="font-bold text-white/90">
              Q1: What is a "Blockchain" in simple terms?
            </p>
            <div className="space-y-1.5 font-mono text-[10px]">
              <button
                type="button"
                id="btn-quiz-q1-a"
                onClick={() => !showQuizResult && setQ1("A")}
                className={`w-full text-left p-2 border transition-all ${
                  q1 === "A" ? "bg-purple-950/20 border-purple-500 text-white" : "bg-black/40 border-white/5 text-white/60 hover:border-white/15"
                } ${showQuizResult && q1 === "A" && "border-rose-500 text-rose-300"}`}
                disabled={showQuizResult}
              >
                A) A heavy chain made of metal toy blocks.
              </button>
              <button
                type="button"
                id="btn-quiz-q1-b"
                onClick={() => !showQuizResult && setQ1("B")}
                className={`w-full text-left p-2 border transition-all ${
                  q1 === "B" ? "bg-purple-950/20 border-purple-500 text-white" : "bg-black/40 border-white/5 text-white/60 hover:border-white/15"
                } ${showQuizResult && q1 === "B" && "border-emerald-500 text-emerald-300"}`}
                disabled={showQuizResult}
              >
                B) A shared digital notebook that can never be erased or changed.
              </button>
              <button
                type="button"
                id="btn-quiz-q1-c"
                onClick={() => !showQuizResult && setQ1("C")}
                className={`w-full text-left p-2 border transition-all ${
                  q1 === "C" ? "bg-purple-950/20 border-purple-500 text-white" : "bg-black/40 border-white/5 text-white/60 hover:border-white/15"
                }`}
                disabled={showQuizResult}
              >
                C) A game you play on a playground.
              </button>
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <p className="font-bold text-white/90">
              Q2: Why do we mint our NFT cards on Stacks L2?
            </p>
            <div className="space-y-1.5 font-mono text-[10px]">
              <button
                type="button"
                id="btn-quiz-q2-a"
                onClick={() => !showQuizResult && setQ2("A")}
                className={`w-full text-left p-2 border transition-all ${
                  q2 === "A" ? "bg-purple-950/20 border-purple-500 text-white" : "bg-black/40 border-white/5 text-white/60 hover:border-white/15"
                } ${showQuizResult && q2 === "A" && "border-rose-500 text-rose-300"}`}
                disabled={showQuizResult}
              >
                A) To store them inside our physical pocket wallets.
              </button>
              <button
                type="button"
                id="btn-quiz-q2-b"
                onClick={() => !showQuizResult && setQ2("B")}
                className={`w-full text-left p-2 border transition-all ${
                  q2 === "B" ? "bg-purple-950/20 border-purple-500 text-white" : "bg-black/40 border-white/5 text-white/60 hover:border-white/15"
                }`}
                disabled={showQuizResult}
              >
                B) Because we want our cards to dissolve after 24 hours.
              </button>
              <button
                type="button"
                id="btn-quiz-q2-c"
                onClick={() => !showQuizResult && setQ2("C")}
                className={`w-full text-left p-2 border transition-all ${
                  q2 === "C" ? "bg-purple-950/20 border-purple-500 text-white" : "bg-black/40 border-white/5 text-white/60 hover:border-white/15"
                } ${showQuizResult && q2 === "C" && "border-emerald-500 text-emerald-300"}`}
                disabled={showQuizResult}
              >
                C) To make them fast, cheap, and as safe as the grand Bitcoin network.
              </button>
            </div>
          </div>

        </div>

        {/* QUIZ CONTROLS & RESULT DISPLAY */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            {!showQuizResult ? (
              <p className="text-white/40 italic">Select answers for both questions to check your score!</p>
            ) : (
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span>
                  Quiz Score:{" "}
                  <strong className={score === 100 ? "text-emerald-400 text-xs" : "text-amber-400 text-xs"}>
                    {score}/100
                  </strong>
                </span>
                {score === 100 && (
                  <span className="text-emerald-400 text-[10px] uppercase font-black tracking-wider flex items-center gap-1 ml-1">
                    <Sparkles size={11} /> 6th Grade Master Certificate Verified!
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!showQuizResult ? (
              <button
                type="button"
                id="btn-quiz-check-answers"
                onClick={handleCheckAnswers}
                disabled={!q1 || !q2}
                className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-white/5 disabled:text-white/20 text-white uppercase font-black tracking-widest text-[9px] cursor-pointer"
              >
                Check Answers
              </button>
            ) : (
              <button
                type="button"
                id="btn-quiz-retry"
                onClick={handleResetQuiz}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 uppercase font-black tracking-widest text-[9px] cursor-pointer"
              >
                Retry Quiz
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
