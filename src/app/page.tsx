"use client";
import { useState, useEffect, useRef } from "react";
import Image from 'next/image';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isExploded, setIsExploded] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Audio refs
  const explosionAudioRef = useRef<HTMLAudioElement | null>(null);
  const rainAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const jumpscareAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preload all assets
  useEffect(() => {
    const assets = {
      audio: [
        '/explosion.mp3',
        '/rain.mp3',
        '/background.mp3',
        '/jumpscare-scream.mp3'
      ],
      images: [
        '/jumpscare.webp'
      ]
    };

    const totalAssets = assets.audio.length + assets.images.length;
    let loadedAssets = 0;

    const updateProgress = () => {
      loadedAssets++;
      setLoadingProgress(Math.round((loadedAssets / totalAssets) * 100));
    };

    const preloadAudio = (file: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => {
          updateProgress();
          resolve();
        }, { once: true });
        audio.addEventListener('error', reject);
        audio.src = file;
        audio.load();
      });
    };

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    const loadAllAssets = async () => {
      try {
        const audioPromises = assets.audio.map(file => preloadAudio(file));
        const imagePromises = assets.images.map(file => preloadImage(file));
        
        await Promise.all([...audioPromises, ...imagePromises]);
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Error loading assets:", error);
        // Continue anyway after error
        setAssetsLoaded(true);
      }
    };

    loadAllAssets();
  }, []);

  // Handle background music
  useEffect(() => {
    if (backgroundMusicRef.current && isStarted) {
      backgroundMusicRef.current.play();
      backgroundMusicRef.current.volume = Math.min(volume * 0.5, 1);
      backgroundMusicRef.current.loop = true;
    }
  }, [isStarted, volume]);

  // Show "Done" button 5 seconds after explosion
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isExploded) {
      timeout = setTimeout(() => {
        setShowDoneButton(true);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isExploded]);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handlePump = () => {
    if (!isExploded) {
      setVolume(Math.min(volume + 0.2, 2));
    }
  };

  const handleBalloonClick = () => {
    if (volume > 1.5) {
      setIsExploded(true);
      if (explosionAudioRef.current) {
        explosionAudioRef.current.currentTime = 0;
        explosionAudioRef.current.volume = 1;
        explosionAudioRef.current.play();
      }
      if (rainAudioRef.current) {
        rainAudioRef.current.currentTime = 0;
        rainAudioRef.current.volume = 0.7;
        rainAudioRef.current.play();
      }
    }
  };

  const handleJumpscare = () => {
    setShowJumpscare(true);
    if (jumpscareAudioRef.current) {
      jumpscareAudioRef.current.volume = 1;
      jumpscareAudioRef.current.play();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  if (!assetsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">Loading assets...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className="text-white mt-2">{loadingProgress}%</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black overflow-hidden relative">
      {/* Hidden Audio Elements */}
      <audio ref={explosionAudioRef} src="/explosion.mp3" preload="auto" />
      <audio ref={rainAudioRef} src="/rain.mp3" preload="auto" loop />
      <audio ref={backgroundMusicRef} src="/background.mp3" preload="auto" loop />
      <audio ref={jumpscareAudioRef} src="/jumpscare-scream.mp3" preload="auto" />

      {/* Jumpscare Overlay */}
      {showJumpscare && (
        <div className="fixed inset-0 z-50 bg-black">
          <Image
  src="/jumpscare.webp"
  alt="jumpscare"
  className="w-screen h-screen object-cover animate-jumpscare"
  fill
  priority
/>
        </div>
      )}

      {!isStarted ? (
        <div className="flex items-center justify-center min-h-screen">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-blue-500 text-white text-xl rounded-full hover:bg-blue-600 transform hover:scale-105 transition"
          >
            Play
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Left Section - Balloon */}
          <div className="flex items-center justify-center">
            {!isExploded ? (
              <div
                className="cursor-pointer relative"
                style={{
                  width: `${volume * 100}px`,
                  height: `${volume * 100}px`,
                }}
                onClick={handleBalloonClick}
              >
                <div
                  className={`bg-red-500 rounded-full w-full h-full transition-all duration-200 hover:bg-red-600 shadow-lg ${
                    volume > 1.5 ? 'animate-pulse' : ''
                  }`}
                  style={{ transform: `scale(${volume})` }}
                />
              </div>
            ) : (
              <div className="relative w-full h-96">
                {/* Nuclear Explosion Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-40 h-40 bg-yellow-500 rounded-full animate-nuclear-explode opacity-75" />
                  <div className="absolute w-60 h-60 bg-orange-500 rounded-full animate-nuclear-explode opacity-50 delay-75" />
                  <div className="absolute w-80 h-80 bg-red-500 rounded-full animate-nuclear-explode opacity-25 delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Pump */}
          <div className="flex items-center justify-center">
            <button
              onClick={handlePump}
              className="relative px-8 py-12 bg-gray-700 rounded-lg hover:bg-gray-600 transform hover:scale-105 transition group"
              disabled={isExploded}
            >
              <div className="absolute inset-x-0 top-2 h-2 bg-gray-800 rounded" />
              <div className="text-white text-xl">Pump</div>
            </button>
          </div>
        </div>
      )}

      {/* Rain Effect */}
      {isExploded && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-rain-drop bg-blue-200/40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}px`,
                  width: '2px',
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-white animate-lightning" />
        </div>
      )}

      {/* Done Button */}
      {showDoneButton && !showJumpscare && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={handleJumpscare}
            className="px-8 py-4 bg-green-500 text-white text-xl rounded-full hover:bg-green-600 transform hover:scale-105 transition"
          >
            Alright, I&apos;m Done!
          </button>
        </div>
      )}
    </div>
  );
}