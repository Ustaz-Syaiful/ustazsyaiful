import React, { useState } from 'react';
import { quickQuizQuestions } from '../data/mockData';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = quickQuizQuestions[currentIndex] || quickQuizQuestions[0] || {
    id: 1,
    question: 'Soalan kuiz',
    options: [],
    correctIndex: 0,
    explanation: ''
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quickQuizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-4 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Kuiz Interaktif Pendidikan Islam</h3>
              <p className="text-xs text-emerald-200">Uji Minda Tajwid, Ibadah & Sirah Murid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-5">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Soalan {currentIndex + 1} daripada {quickQuizQuestions.length}</span>
                <span className="text-amber-400 font-bold">Markah: {score}</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / quickQuizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <h4 className="text-base font-bold text-slate-100 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isCorrect = idx === currentQ.correctIndex;
                  const isChosen = idx === selectedOption;

                  let btnStyle = 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-900/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-900/60 border-rose-500 text-rose-200 font-semibold';
                    } else {
                      btnStyle = 'bg-slate-800/30 text-slate-500 border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between text-xs sm:text-sm ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {isAnswered && (
                <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                    <HelpCircle className="w-4 h-4" />
                    <span>Penerangan Guru:</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg"
                >
                  {currentIndex < quickQuizQuestions.length - 1 ? 'Soalan Seterusnya →' : 'Lihat Keputusan Akhir'}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-400/30">
                <Trophy className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-white">Tahniah! Kuiz Selesai</h4>
              <p className="text-sm text-slate-300">
                Anda mendapat skor <span className="font-bold text-amber-300 text-lg">{score}</span> daripada{' '}
                <span className="font-bold text-white text-lg">{quickQuizQuestions.length}</span> soalan.
              </p>

              <div className="p-3 bg-slate-800/80 rounded-xl max-w-xs mx-auto text-xs text-emerald-300 border border-emerald-700/50">
                {score === quickQuizQuestions.length
                  ? '🌟 Mumtaz! Penguasaan tajwid & fardhu ain yang sangat cemerlang.'
                  : score >= 2
                  ? '👍 Jayyid Jiddan! Teruskan usaha dan tasmik bersama guru.'
                  : '📖 Perlu lebih banyak latihan dan rujukan DSKP.'}
              </div>

              <div className="flex items-center justify-center space-x-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulang Kuiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Tutup Kuiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
