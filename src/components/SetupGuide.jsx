import React from 'react';

const SetupGuide = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: 'var(--font-family)'
        }}>
            <div style={{
                background: 'var(--bg-secondary)',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: 'var(--text-primary)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        fontSize: '1.2rem',
                        color: 'var(--text-secondary)'
                    }}
                >
                    ✕
                </button>

                <h2 style={{ marginBottom: '20px', color: 'var(--accent-color)' }}>Sanal Kablo Kurulumu</h2>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>1. Adım: Sürücüyü İndir</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Sesini diğer programlara (Discord, Oyunlar) göndermek için <strong>VB-Cable</strong> sürücüsüne ihtiyacın var.
                    </p>
                    <a
                        href="https://vb-audio.com/Cable/"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: 'inline-block',
                            background: 'var(--accent-color)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}
                    >
                        Sürücüyü İndir (VB-Audio) ↗
                    </a>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>2. Adım: Kurulum</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        İndirdiğin ZIP dosyasını aç, <strong>VBCABLE_Setup_x64.exe</strong> dosyasını "Yönetici Olarak Çalıştır" ve "Install Driver" butonuna bas. Sonra bilgisayarını yeniden başlat.
                    </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>3. Adım: Ayarlar</h3>
                    <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                        <li><strong>Resound:</strong> Yukarıdaki menüden çıkış olarak <strong>"CABLE Input"</strong> seç.</li>
                        <li><strong>Discord / Oyun:</strong> Mikrofon ayarlarından <strong>"CABLE Output"</strong> seç.</li>
                    </ul>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Not: Kurulumdan sonra bu listeyi güncellemek için uygulamayı kapatıp açman gerekebilir.
                </div>
            </div>
        </div>
    );
};

export default SetupGuide;
