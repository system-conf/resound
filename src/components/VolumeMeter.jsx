import React, { useEffect, useRef } from 'react';

const VolumeMeter = ({ stream }) => {
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!stream) return;

        // Initialize Audio Context
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const draw = () => {
            if (!analyserRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);

            // Calculate Average Volume
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;

            // Scale to 0-1 range roughly, then mapped to width
            const vol = Math.min(average / 50, 1);

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Level Bar
            ctx.fillStyle = '#4caf50'; // Green
            ctx.fillRect(0, 0, canvas.width * vol, canvas.height);

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stream]);

    if (!stream) return null;

    return (
        <canvas
            ref={canvasRef}
            width={100}
            height={10}
            style={{
                borderRadius: '4px',
                marginLeft: '5px',
                border: '1px solid var(--bg-tertiary)'
            }}
        />
    );
};

export default VolumeMeter;
