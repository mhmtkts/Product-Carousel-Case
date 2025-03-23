# E-bebek Ürün Carousel'i
Bu proje, e-bebek web sitesinin ana sayfasına entegre edilebilen, API'den alınan ürünleri görüntüleyen, interaktif bir ürün carousel'i oluşturan JavaScript kodudur. Proje, tamamen vanilla JavaScript kullanılarak geliştirilmiş olup, herhangi bir 3. parti kütüphane gerektirmez.

## 🚀 Özellikler
✅ Ürünleri API'den dinamik olarak çeker
✅ Responsive tasarım (mobil, tablet ve masaüstü uyumlu)
✅ İndirimli ürünler için orijinal fiyat ve indirim oranı gösterimi
✅ Ürünler favoriye eklenebilir/çıkarılabilir
✅ Favori ürünler localStorage'da saklanır
✅ İlk yüklemeden sonra ürünler localStorage'dan yüklenir (performans optimizasyonu)
✅ Ürüne tıklandığında ilgili ürün sayfasına yeni sekmede yönlendirir
✅ Satın alma simülasyonu ("Sepete Ekle" butonu)
✅ Sadece ana sayfada çalışır (diğer sayfalarda hata kontrolü)


## 📦 Kurulum
- Proje dosyasını bilgisayarınıza indirin (script.js)
- Tarayıcınızda e-bebek ana sayfasını açın (www.e-bebek.com)
- Geliştirici konsolunu açın:
- Chrome: F12 veya Ctrl+Shift+I (Windows/Linux) / Cmd+Option+I (Mac)
- Firefox: F12 veya Ctrl+Shift+I
- Konsola JavaScript dosyasının tüm içeriğini yapıştırın ve Enter'a basın


## 🎮 Nasıl Çalışır
- Kod çalıştırıldığında, e-bebek ana sayfasında "Beğenebileceğinizi düşündüklerimiz" başlıklı bir ürün carousel'i oluşturulur
- Sağa/sola kaydırma okları ile ürünler arasında gezilebilir
- Ürün kartlarındaki kalp ikonuna tıklayarak ürünler favorilere eklenebilir/çıkarılabilir
- Favorilere eklenen ürünler tarayıcının yerel depolama alanında saklanır ve sayfayı yeniden yüklediğinizde korunur
- Ürün kartına tıklandığında ilgili ürün sayfası yeni sekmede açılır
- "Sepete Ekle" butonuna tıklandığında bir alert mesajı görünür


## 💻 Teknik Detaylar
- Dil: JavaScript (ES6+)
- API URL: Ürün verileri için bir Gist JSON API kullanılmıştır
- Depolama: LocalStorage kullanılarak iki anahtar saklanır:
- favoriteProducts: Kullanıcının favori ürünlerinin ID listesi
- carouselProducts: Ürün verileri (tekrar API çağrısı yapmamak için)
- Responsive Tasarım: 4 farklı boyut için responsive ayarlar (1200px, 992px, 768px, 480px)
- Animasyonlar: CSS transition'lar ile yumuşak geçiş efektleri


## 🧪 Test
Proje şu tarayıcılarda test edilmiştir:

- Google Chrome (son sürüm)
- Mozilla Firefox (son sürüm)
- Safari (son sürüm)
- Microsoft Edge (son sürüm)


## 📝 Not
Bu proje e-bebek sitesinin bir kopyası değil, benzer bir carousel oluşturmak için vanilla JavaScript kullanımını gösteren bir örnektir.