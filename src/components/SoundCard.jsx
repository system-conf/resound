import React, { useState } from 'react';
import './SoundCard.css';
import ShortcutRecorder from './ShortcutRecorder';

const SoundCard = ({ name, shortcut, onClick, onRemove, onShortcutUpdate, onVolumeChange }) => {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <div className="sound-card" onClick={onClick}>
            {isRecording && (
                <ShortcutRecorder
                    currentShortcut={shortcut}
                    onSave={(newShortcut) => {
                        onShortcutUpdate(newShortcut);
                        setIsRecording(false);
                    }}
                    onCancel={() => setIsRecording(false)}
                />
            )}

            <div className="sound-info">
                <h3 className="sound-name">{name}</h3>
                <span
                    className="sound-shortcut"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsRecording(true);
                    }}
                    title="Click to edit shortcut"
                    style={{ cursor: 'pointer', border: isRecording ? '1px solid var(--accent-color)' : 'none' }}
                >
                    {shortcut || 'Tuş Yok'}
                </span>
            </div>
            {/* Volume Slider */}
            <div className="volume-control" onClick={(e) => e.stopPropagation()}>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    defaultValue="1"
                    onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-color)', height: '4px' }}
                />
            </div>

            <div className="sound-visualizer">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <button
                className="remove-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
            >
                ×
            </button>
        </div>
    );
};

export default SoundCard;
