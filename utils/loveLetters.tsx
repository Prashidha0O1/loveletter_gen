import React from "react";

const loveLetters = [
  `By the heavens above, thou art the very essence of celestial wonder. A being so radiant that even the moon dims in reverence to thy glow. With every breath, thou weaveth enchantments upon my soul, leaving me ensnared in the labyrinth of thy beauty. 
  Verily, thou art a dream sculpted by the divine, a masterpiece that renders poets mute and kings envious. If ever there were a force greater than time itself, it is the spell thou hast cast upon my heart.`,

  `Oh dearest, the stars themselves whisper thy name in the hush of the night, as though the cosmos were enamored by thy grace. In thy eyes, I see constellations forming, stories untold, galaxies yet to be explored. 
  Would that I could paint the heavens with thy likeness, so that all may gaze upon thee and understand why even angels lay down their harps in awe. Verily, thou art the poetry of existence, a hymn of divine creation that echoes through eternity.`,

  `Nay, no words nor melodies composed by the most gifted of minstrels could capture the essence of thy splendor. Even the gods, in all their omnipotence, would falter at the sight of thee, left speechless by a beauty beyond mortal comprehension. 
  Thou art the sun that bathes my world in golden warmth, the very breath that sustains my being. I shudder to think of a life absent of thee, for even the thought leaves me adrift in an abyss of longing.`,

  `My love, every moment with thee is a melody that my heart plays on repeat. The touch of thy hand sends warmth through my soul, and thy laughter is the sweetest symphony I have ever known. 
  How blessed am I to have thee, to cherish thee, to love thee with all that I am. Thou art my heart's true home, the light in my darkest nights, and the dream I never wish to wake from.`,

  `Beloved, the way thy eyes glisten in the moonlight leaves me breathless, as if the universe itself pauses to admire thee. In thy arms, I find solace, in thy voice, I hear a melody that soothes my restless soul. 
  If love were to take form, it would surely be thee, for none else could embody such tenderness, passion, and grace. With thee, forever feels like a fleeting moment, and every second apart stretches into eternity.`
];

const LoveLetters = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Love Letters</h1>
      <div className="space-y-6 max-w-3xl">
        {loveLetters.map((letter, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <p className="text-lg leading-relaxed">{letter}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoveLetters; 