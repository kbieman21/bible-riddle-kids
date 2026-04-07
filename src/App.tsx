import { useState, useEffect } from 'react';
import riddlesData from './data/riddles.json';
import { getVerse } from './lib/bible';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

type Riddle = {
  id: number;
  category: string;
  riddle: string;
  answer: string;
  verseReference: string;
  explanation: string;
};

function App() {
  const [riddles] = useState<Riddle[]>(riddlesData);
  const [selectedRiddle, setSelectedRiddle] = useState<Riddle | null>(null);
  const [verse, setVerse] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Test: Load a random riddle on start
  useEffect(() => {
    if (riddles.length > 0) {
      setSelectedRiddle(riddles[Math.floor(Math.random() * riddles.length)]);
    }
  }, [riddles]);

  const loadVerse = async (reference: string) => {
    setLoadingVerse(true);
    const verseData = await getVerse(reference);
    setVerse(verseData);
    setLoadingVerse(false);
  };

  const revealAnswer = (riddle: Riddle) => {
    setSelectedRiddle(riddle);
    setShowAnswer(true);
    loadVerse(riddle.verseReference);
    setShowConfetti(true);
    
    // Stop confetti after 4 seconds
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 drop-shadow-lg">
          🧩 Bible Riddles for Kids
        </h1>

        {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

        {/* Test: Show all categories */}
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Available Categories</h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(riddles.map(r => r.category))].map(cat => (
              <span key={cat} className="bg-white/20 px-4 py-1 rounded-full text-sm">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Current Riddle */}
        {selectedRiddle && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <p className="text-sm uppercase tracking-widest opacity-75">Riddle #{selectedRiddle.id}</p>
              <p className="text-xl font-semibold mt-1">{selectedRiddle.category}</p>
            </div>

            <div className="text-3xl leading-relaxed text-center mb-10 min-h-[120px]">
              "{selectedRiddle.riddle}"
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => revealAnswer(selectedRiddle)}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 py-4 rounded-2xl text-xl transition"
              >
                Reveal Answer ✨
              </button>
            </div>

            {showAnswer && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 border-t border-white/30 pt-8"
              >
                <h3 className="text-2xl font-bold mb-3">The Answer Is:</h3>
                <p className="text-4xl font-bold text-yellow-300 mb-6">{selectedRiddle.answer}</p>

                {loadingVerse ? (
                  <p className="text-lg">Loading Bible verse...</p>
                ) : verse && (
                  <div className="bg-white/10 p-6 rounded-2xl">
                    <p className="italic text-lg leading-relaxed">"{verse.text}"</p>
                    <p className="text-right mt-4 font-semibold">— {verse.reference}</p>
                  </div>
                )}

                <div className="mt-8">
                  <h4 className="font-bold text-xl mb-3">What does it mean?</h4>
                  <p className="text-lg leading-relaxed">{selectedRiddle.explanation}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* List all riddles for testing */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6">All 20 Riddles (Test List)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riddles.map(riddle => (
              <button
                key={riddle.id}
                onClick={() => {
                  setSelectedRiddle(riddle);
                  setShowAnswer(false);
                  setVerse(null);
                }}
                className="text-left bg-white/10 hover:bg-white/20 p-5 rounded-2xl transition text-sm"
              >
                <span className="font-mono opacity-60">#{riddle.id}</span> — {riddle.riddle.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;