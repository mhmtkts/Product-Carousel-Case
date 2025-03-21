(() => {
    const API_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    const STORAGE_KEY = "favoriteProducts";
    const PRODUCTS_STORAGE_KEY = "carouselProducts";
    let products = [];
    let favorites = [];
    
    const isHomePage = () => {
        return window.location.pathname === "/" || window.location.pathname.includes("index") || window.location.href.includes("e-bebek.com");
    };
    
    const init = () => {
        if (!isHomePage()) {
            console.log("wrong page");
            return;
        }
        
        loadFavorites();
        
        try {
            const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            if (storedProducts && storedProducts !== "undefined") {
                products = JSON.parse(storedProducts);
                if (Array.isArray(products) && products.length > 0) {
                    console.log("Ürünler yerel depolamadan yüklendi. İkinci çalıştırma.");
                    buildCarousel();
                    return;
                }
            }
        } catch (e) {
            console.warn("Depolanmış ürünler yüklenemedi, API'den yeniden yükleniyor:", e);
            localStorage.removeItem(PRODUCTS_STORAGE_KEY);
        }
        
        console.log("İlk çalıştırma: Ürünler API'den yükleniyor.");
        fetchProducts();
    };
    
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                products = data;
            } else {
                console.error("API yanıtı beklenen formatta değil:", data);
                return;
            }
            
            if (!products || products.length === 0) {
                console.error("Hiç ürün bulunamadı");
                return;
            }
            
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
            
            buildCarousel();
        } catch (error) {
            console.error("Ürünler yüklenirken hata oluştu:", error);
        }
    };
    
    const loadFavorites = () => {
        try {
            const storedFavorites = localStorage.getItem(STORAGE_KEY);
            if (storedFavorites && storedFavorites !== "undefined") {
                favorites = JSON.parse(storedFavorites);
                console.log("Favori ürünler yüklendi:", favorites);
            } else {
                favorites = [];
            }
        } catch (e) {
            console.warn("Favori ürünler yüklenemedi:", e);
            favorites = [];
            localStorage.removeItem(STORAGE_KEY);
        }
    };
    
    const buildCarousel = () => {
        console.log("Carousel oluşturuluyor...", products.length, "ürün bulundu");
    };
    
    init();
})();