import React, { useState, useEffect } from 'react';

const DeviceSelector = ({ selectedDeviceId, onSelect, onShowGuide, kind = 'audiooutput', placeholder = "Varsayılan (Sistem)" }) => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true }); // Request permission to see labels
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const filteredDevices = allDevices.filter(device => device.kind === kind);
                setDevices(filteredDevices);
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };

        getDevices();
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <select
                value={selectedDeviceId}
                onChange={(e) => onSelect(e.target.value)}
                style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--bg-tertiary)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                    maxWidth: '200px',
                    WebkitAppRegion: 'no-drag'
                }}
            >
                <option value="">{placeholder}</option>
                {devices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Device ${device.deviceId.slice(0, 5)}...`}
                    </option>
                ))}
            </select>
            {onShowGuide && (
                <div
                    onClick={onShowGuide}
                    style={{ fontSize: '0.7rem', color: 'var(--accent-color)', marginTop: '4px', cursor: 'pointer', textDecoration: 'underline', WebkitAppRegion: 'no-drag' }}
                >
                    Göremiyor musun? Kurulum Rehberi
                </div>
            )}
        </div>
    );
};

export default DeviceSelector;
