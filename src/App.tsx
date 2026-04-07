import { useState, useEffect } from 'react';
import riddlesData from './data/riddles.json';
import { getVerse } from './lib/bible';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { BookOpen, Shuffle, Star, Award } from 'lucide-react';

type Riddle = {
  id: number;
  category: string;
  riddle: string;
  answer: string;
  verseReference: string;
  explanation: string;
};

const categories = [
  { name: "All", icon: Star, color: "from-purple-500 to-pink-500" },
  { name: "Creation", icon: BookOpen, color: "from-green-500 to-emerald-500" },
  { name: "Heroes", icon: Award, color: "from-amber-500 to-orange-500" },
  { name: "Jesus Stories", icon: Star, color: "from-blue-500 to-cyan-500" },
  { name: "Parables", icon: BookOpen, color: "from-violet-500 to-purple-500" },
  { name: "Rescue Stories", icon: Award, color: "from-red-500 to-rose-500" },
];

function App() {
  const [riddles] = useState<Riddle[]>(riddlesData);
  const [filteredRiddles, setFilteredRiddles] = useState<Riddle[]>(riddlesData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [verse, setVerse] = useState<any>(null);
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter riddles when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredRiddles(riddles);
    } else {
      setFilteredRiddles(riddles.filter(r => r.category === selectedCategory));
    }
  }, [selectedCategory, riddles]);

  // Pick a random riddle
  const getRandomRiddle = () => {
    const randomIndex = Math.floor(Math.random() * riddles.length);
    openRiddle(riddles[randomIndex]);
  };

  const openRiddle = (riddle: Riddle) => {
    setCurrentRiddle(riddle);
    setShowAnswer(false);
    setVerse(null);
    setIsModalOpen(true);
  };

  const revealAnswer = async () => {
    if (!currentRiddle) return;
    
    setShowAnswer(true);
    setLoadingVerse(true);
    setShowConfetti(true);

    const verseData = await getVerse(currentRiddle.verseReference);
    setVerse(verseData);
    setLoadingVerse(false);

    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowAnswer(false);
    setVerse(null);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white overflow-hidden">
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-3xl flex items-center gap-4">
              <span className="text-6xl">🧩</span>
              <div>
                <h1 className="text-5xl font-bold tracking-tight">Bible Riddles</h1>
                <p className="text-xl opacity-90">Fun way to learn God's Word!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Random Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getRandomRiddle}
            className="flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-2xl px-12 py-6 rounded-3xl shadow-xl transition-all"
          >
            <Shuffle className="w-8 h-8" />
            Surprise Me! Random Riddle
          </motion.button>
        </div>

        {/* Category Buttons */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">Choose a Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-lg transition-all ${
                    isActive 
                      ? 'bg-white text-black shadow-2xl' 
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {cat.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Riddle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRiddles.map((riddle) => (
            <motion.div
              key={riddle.id}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 cursor-pointer hover:border-yellow-300 transition-all group"
              onClick={() => openRiddle(riddle)}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-mono opacity-60">#{riddle.id}</span>
                <span className="text-xs px-4 py-1 bg-white/20 rounded-full">{riddle.category}</span>
              </div>
              
              <div className="text-2xl leading-tight font-medium min-h-[110px] group-hover:text-yellow-200 transition-colors">
                "{riddle.riddle}"
              </div>

              <div className="mt-8 text-right">
                <span className="text-yellow-300 text-sm font-medium flex items-center justify-end gap-2">
                  Click to solve <span className="text-xl">→</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRiddles.length === 0 && (
          <p className="text-center text-2xl mt-12 opacity-70">No riddles in this category yet. Try another!</p>
        )}
      </div>

      {/* Riddle Modal */}
      <AnimatePresence>
        {isModalOpen && currentRiddle && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white text-black max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="uppercase tracking-widest text-sm opacity-80">Riddle #{currentRiddle.id}</p>
                    <p className="text-2xl font-bold">{currentRiddle.category}</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-4xl hover:rotate-90 transition-transform"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-10">
                <div className="text-3xl leading-relaxed text-center mb-12 font-medium">
                  "{currentRiddle.riddle}"
                </div>

                {!showAnswer ? (
                  <button
                    onClick={revealAnswer}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold text-2xl py-6 rounded-2xl transition-all"
                  >
                    Reveal the Answer ✨
                  </button>
                ) : (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-3xl font-bold text-amber-600 mb-4">The Answer Is:</h3>
                      <p className="text-5xl font-bold text-amber-500">{currentRiddle.answer}</p>
                    </div>

                    {loadingVerse ? (
                      <p className="text-center text-xl py-8">Loading God's Word...</p>
                    ) : verse && (
                      <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl">
                        <p className="italic text-2xl leading-relaxed">"{verse.text}"</p>
                        <p className="text-right mt-6 font-semibold text-lg">— {verse.reference}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-2xl mb-4 flex items-center gap-3">
                        <Star className="text-amber-500" /> What does it mean for us?
                      </h4>
                      <p className="text-xl leading-relaxed text-gray-700">{currentRiddle.explanation}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-100 px-10 py-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-10 py-4 text-lg font-medium text-gray-600 hover:text-black transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;