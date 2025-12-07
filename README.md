# Resound 🔊

**Resound**, modern, hızlı ve şık bir masaüstü **Soundboard** uygulamasıdır. Mikrofonunuzu ve ses efektlerinizi tek bir sanal kanaldan (Virtual Cable) geçirerek oyunlarda veya Discord'da yüksek kaliteli ses deneyimi sunar.

![Resound Hero Image](https://raw.githubusercontent.com/system-conf/resound/main/public/resound.svg)

## 🌟 Özellikler

*   **🎙️ Mikrofon Mixing (Passthrough):** Kendi sesinizi ve soundboard seslerini tek bir çıkışta birleştirir. Ekstra programlara (VoiceMeeter vb.) gerek kalmaz.
*   **🔴 Panik Butonu (DURDUR):** Acil durumlarda "DURDUR" butonuyla tüm çalan sesleri anında susturun.
*   **🔊 Ses Kontrolü:** Her ses kartı için ayrı ses seviyesi ayarı. Uygulama ayarları hatırlar.
*   **📂 Kategoriler:** Seslerinizi "Oyun", "Müzik", "Meme" gibi sekmelere ayırarak düzenleyin.
*   **🎹 Özel Kısayollar:** Her ses için klavye kısayolu atayın. Uygulama arkada çalışırken bile tuşlara basarak ses çalın.
*   **🎨 Modern Arayüz:** Göz yormayan, premium hissettiren "Neon/Light" hibrit tasarım.
*   **⚡ Performanslı:** Electron ve React ile geliştirildi, sistem kaynaklarını minimum kullanır.

## 🚀 Kurulum

1.  **İndir:** [Releases](https://github.com/system-conf/resound/releases) sayfasından son sürümü (`Resound-Portable.zip`) indirin.
2.  **Çıkart:** ZIP dosyasını bir klasöre çıkartın.
3.  **Çalıştır:** `Resound.exe`'yi açın.

### İlk Ayarlar
1.  **Sanal Kablo:** Eğer yüklü değilse, uygulamadaki "Kurulum Rehberi" ile VB-Cable sürücüsünü kurun.
2.  **Ses Çıkışı:** Uygulamada sağ üstten `CABLE Input (VB-Audio Virtual Cable)` seçin.
3.  **Mikrofon:** Sol üstten kendi mikrofonunuzu seçin ve "Aç" butonuna basın.
4.  **Hedef Uygulama:** Discord veya Oyun ses ayarlarında Giriş Cihazı (Input) olarak `CABLE Output` seçin.

## 🛠️ Geliştirme (Development)

Projeyi kendi bilgisayarınızda geliştirmek için:

```bash
# Depoyu klonlayın
git clone https://github.com/system-conf/resound.git

# Klasöre girin
cd resound

# Bağımlılıkları yükleyin
npm install

# Geliştirme modunda çalıştırın
npm run dev
```

### Derleme (Build)

Windows için taşınabilir sürüm oluşturmak için:

```bash
npm run build
```
*Çıktılar `release/win-unpacked` klasöründe oluşacaktır.*

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır.
