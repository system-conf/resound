import React, { useState, useEffect, useRef } from 'react';
import SoundGrid from './components/SoundGrid';
import SoundCard from './components/SoundCard';
import SetupGuide from './components/SetupGuide';
import DeviceSelector from './components/DeviceSelector';
import VolumeMeter from './components/VolumeMeter';
import './index.css';

function App() {
  const [sounds, setSounds] = useState([]);
  const soundsRef = useRef([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedMicId, setSelectedMicId] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
  const micAudioRef = useRef(new Audio());
  const activeAudioRef = useRef([]); // Track all playing sounds
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [categories, setCategories] = useState(['Genel']);
  const [activeCategory, setActiveCategory] = useState('Genel');

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resound-library');
    if (saved) {
      setSounds(JSON.parse(saved));
    }

    const savedDevice = localStorage.getItem('resound-device');
    if (savedDevice) {
      setSelectedDeviceId(savedDevice);
    }

    if (window.ipcRenderer) {
      window.ipcRenderer.on('play-sound', (event, id) => {
        const sound = soundsRef.current.find(s => s.id === id);
        if (sound) {
          playSound(sound.path);
        }
      });
    }
  }, []);

  useEffect(() => {
    soundsRef.current = sounds;
    localStorage.setItem('resound-library', JSON.stringify(sounds));
  }, [sounds]);

  useEffect(() => {
    const savedCats = localStorage.getItem('resound-categories');
    if (savedCats) setCategories(JSON.parse(savedCats));
  }, []);

  useEffect(() => {
    localStorage.setItem('resound-categories', JSON.stringify(categories));
  }, [categories]);

  // Persist device selection
  useEffect(() => {
    if (selectedDeviceId) {
      localStorage.setItem('resound-device', selectedDeviceId);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    const savedMic = localStorage.getItem('resound-mic');
    if (savedMic) setSelectedMicId(savedMic);
  }, []);

  useEffect(() => {
    if (selectedMicId) {
      localStorage.setItem('resound-mic', selectedMicId);
    }
  }, [selectedMicId]);

  // Handle Microphone Passthrough
  useEffect(() => {
    const handleMic = async () => {
      if (!isMicOn || !selectedMicId || !selectedDeviceId) {
        // Stop Mic
        if (micAudioRef.current.srcObject) {
          const tracks = micAudioRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          micAudioRef.current.srcObject = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: selectedMicId },
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });

        micAudioRef.current.srcObject = stream;

        // Route to Output
        if (selectedDeviceId && micAudioRef.current.setSinkId) {
          await micAudioRef.current.setSinkId(selectedDeviceId);
        }

        await micAudioRef.current.play();
      } catch (err) {
        console.error("Mic Error:", err);
        setIsMicOn(false); // Turn off on error
      }
    };

    handleMic();

    // Cleanup on unmount or dependency change
    return () => {
      if (micAudioRef.current.srcObject) {
        const tracks = micAudioRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, [isMicOn, selectedMicId, selectedDeviceId]);

  useEffect(() => {
    if (window.ipcRenderer) {
      sounds.forEach(s => {
        if (s.shortcut) {
          window.ipcRenderer.send('register-shortcut', { id: s.id, shortcut: s.shortcut });
        }
      });
    }
  }, [sounds.length]);

  const addSound = async () => {
    if (window.ipcRenderer) {
      const filePath = await window.ipcRenderer.invoke('dialog:openFile');
      if (filePath) {
        const fileName = filePath.split('\\').pop().split('/').pop();
        const newSound = {
          id: Date.now(),
          name: fileName,
          path: filePath,
          shortcut: '', // No default shortcut
          volume: 1, // Default volume
          category: activeCategory
        };
        setSounds(prev => [...prev, newSound]);
      }
    }
  };

  const addCategory = () => {
    const name = prompt("Kategori İsmi:");
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name]);
      setActiveCategory(name);
    }
  };

  const updateShortcut = (id, newShortcut) => {
    setSounds(prev => prev.map(s => {
      if (s.id === id) {
        // Unregister old
        if (s.shortcut && window.ipcRenderer) {
          window.ipcRenderer.send('unregister-shortcut', s.shortcut);
        }
        // Register new
        if (newShortcut && window.ipcRenderer) {
          window.ipcRenderer.send('register-shortcut', { id: s.id, shortcut: newShortcut });
        }
        return { ...s, shortcut: newShortcut };
      }
      return s;
    }));
  };

  const stopAll = () => {
    activeAudioRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    activeAudioRef.current = [];
  };

  const updateVolume = (id, newVolume) => {
    setSounds(prev => prev.map(s => s.id === id ? { ...s, volume: newVolume } : s));
  };

  const playSound = async (path, volume = 1) => {
    const audio = new Audio(`file://${path}`);

    // Add to active list
    activeAudioRef.current.push(audio);

    // Remove when ended
    audio.onended = () => {
      activeAudioRef.current = activeAudioRef.current.filter(a => a !== audio);
    };

    if (selectedDeviceId) {
      try {
        await audio.setSinkId(selectedDeviceId);
      } catch (err) {
        console.warn('Failed to set audio output device', err);
      }
    }

    try {
      await audio.play();
    } catch (err) {
      console.error("Playback error:", err);
      // Remove if failed to start
      activeAudioRef.current = activeAudioRef.current.filter(a => a !== audio);
    }
  };

  const removeSound = (id) => {
    const s = sounds.find(x => x.id === id);
    if (s && s.shortcut && window.ipcRenderer) {
      window.ipcRenderer.send('unregister-shortcut', s.shortcut);
    }
    setSounds(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {showSetupGuide && <SetupGuide onClose={() => setShowSetupGuide(false)} />}
      <header style={{
        padding: '20px',
        paddingRight: '150px', // Space for Window Controls
        borderBottom: '1px solid var(--bg-tertiary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        WebkitAppRegion: 'drag'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="resound.svg" alt="Resound" style={{ width: '32px', height: '32px' }} />
          <h1 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Resound</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

          {/* Stop Button */}
          <button
            onClick={stopAll}
            style={{
              background: 'rgba(255, 59, 48, 0.1)', // Subtle red background
              color: 'var(--danger-color)', // Red text
              border: '1px solid currentColor',
              borderRadius: '6px',
              padding: '6px 12px',
              fontWeight: '600',
              cursor: 'pointer',
              WebkitAppRegion: 'no-drag',
              marginRight: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ fontSize: '1.2em', lineHeight: 1 }}>■</span> DURDUR
          </button>

          {/* Microphone Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '10px', WebkitAppRegion: 'no-drag' }}>
            <DeviceSelector
              selectedDeviceId={selectedMicId}
              onSelect={setSelectedMicId}
              kind="audioinput"
              placeholder="Mikrofon Seç (Konuş)"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: isMicOn ? '#4caf50' : 'var(--text-secondary)' }}>
                {isMicOn ? '🟢 Yayında' : '⚪ Kapalı'}
              </span>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--bg-tertiary)',
                  background: isMicOn ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
                  color: isMicOn ? '#4caf50' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {isMicOn ? 'Kapat' : 'Aç'}
              </button>
              {isMicOn && <VolumeMeter stream={micAudioRef.current.srcObject} />}
            </div>
          </div>

          <DeviceSelector
            selectedDeviceId={selectedDeviceId}
            onSelect={setSelectedDeviceId}
            onShowGuide={() => setShowSetupGuide(true)}
          />
          <button
            style={{
              padding: '8px 16px',
              background: 'var(--accent-color)',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '600',
              WebkitAppRegion: 'no-drag',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
            onClick={addSound}
          >
            + Ses Ekle
          </button>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Category Tabs */}
        <div style={{ padding: '10px 20px', display: 'flex', gap: '5px', overflowX: 'auto', borderBottom: '1px solid var(--bg-tertiary)' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 12px',
                background: activeCategory === cat ? 'var(--accent-color)' : 'transparent',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeCategory === cat ? 'bold' : 'normal',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
          <button onClick={addCategory} style={{ background: 'transparent', border: '1px dashed var(--text-secondary)', color: 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer', padding: '0 8px' }}>+</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {sounds.filter(s => (s.category || 'Genel') === activeCategory).length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)',
              opacity: 0.5
            }}>
              <p>Bu kategoride ses yok.</p>
              <p style={{ fontSize: '0.8rem' }}>"+ Ses Ekle" butonu ile ekleyebilirsin.</p>
            </div>
          ) : (
            <SoundGrid>
              {sounds.filter(s => (s.category || 'Genel') === activeCategory).map(sound => (
                <SoundCard
                  key={sound.id}
                  name={sound.name}
                  shortcut={sound.shortcut}
                  onClick={() => playSound(sound.path, sound.volume)}
                  onRemove={() => removeSound(sound.id)}
                  onShortcutUpdate={(newKey) => updateShortcut(sound.id, newKey)}
                  onVolumeChange={(vol) => updateVolume(sound.id, vol)}
                />
              ))}
            </SoundGrid>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
