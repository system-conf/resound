import React from 'react';

const SoundGrid = ({ children }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
            padding: '20px',
            overflowY: 'auto',
            height: '100%'
        }}>
            {children}
        </div>
    );
};

export default SoundGrid;
