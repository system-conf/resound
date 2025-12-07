import React, { useState, useEffect } from 'react';

const ShortcutRecorder = ({ currentShortcut, onSave, onCancel }) => {
    const [keys, setKeys] = useState([]);
    const [recording, setRecording] = useState(true);

    useEffect(() => {
        const handleKeyDown = (e) => {
            e.preventDefault();

            // Ignore isolated Modifier keys
            const modifiers = ['Control', 'Shift', 'Alt', 'Meta'];
            if (modifiers.includes(e.key)) {
                // We still want to clear if the user is just holding modifiers to start fresh
                return;
            }

            // Build the accelerator string for Electron
            // Format: CommandOrControl+Shift+Z
            const newKeys = [];
            if (e.ctrlKey) newKeys.push('Ctrl');
            if (e.metaKey) newKeys.push('Super'); // 'Super' or 'Command' depending on OS, Electron maps 'CommandOrControl' usually logic is needed
            if (e.altKey) newKeys.push('Alt');
            if (e.shiftKey) newKeys.push('Shift');

            // Helper to map keys
            let key = e.key;
            if (key === ' ') key = 'Space';
            if (key.length === 1) key = key.toUpperCase();

            // Basic keys only for now, ignoring F-keys special logic if needed or ensuring e.key matches Accelerator format
            // Electron Accelerators are case insensitive generally.

            newKeys.push(key);

            setKeys(newKeys);
        };

        const handleKeyUp = (e) => {
            // Stop recording on key up? No, usually we wait for a specific 'Done' or just take the last chord.
            // Let's autosave on keyup if we have a valid combo?
            // Or just let user press Enter?
            // For this MVP, let's just listen for the first valid chord.
            if (keys.length > 0) {
                // Check if it's just a modifier
                const lastKey = keys[keys.length - 1];
                const isModifier = ['Ctrl', 'Alt', 'Shift', 'Super'].includes(lastKey);

                if (!isModifier) {
                    setRecording(false);
                    onSave(keys.join('+'));
                }
            }
        }

        if (recording) {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [recording, keys, onSave]);

    return (
        <div className="shortcut-recorder" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            zIndex: 10
        }}>
            <span style={{ color: 'var(--accent-color)', marginBottom: '8px', fontSize: '0.8rem' }}>
                Tuşlara basın...
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {keys.length > 0 ? keys.join(' + ') : (currentShortcut || 'Yok')}
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                style={{
                    marginTop: '12px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'underline'
                }}
            >
                İptal
            </button>
        </div>
    );
};

export default ShortcutRecorder;
