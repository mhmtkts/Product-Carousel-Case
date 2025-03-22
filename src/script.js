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
        buildHTML();
        buildCSS();
    };
    
    const createProductCard = (product, index) => {
        try {
            const id = product.id ? product.id : Math.floor(Math.random() * 10000);
            const brand = product.brand || "";
            const name = product.name || "Ürün Adı";
            const url = product.url || "#";
            const img = product.img || "https://via.placeholder.com/150";
            const price = typeof product.price !== 'undefined' ? product.price : 0;
            const originalPrice = typeof product.original_price !== 'undefined' ? product.original_price : price;
            
            const isDiscounted = price !== originalPrice;
            const discountAmount = isDiscounted ? Math.round(100 - (price * 100 / originalPrice)) : 0;
            
            const isFavorite = favorites.includes(id);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'eb-owl-item active';
            itemElement.style.width = '272.5px';
            itemElement.style.marginRight = '20px';
            
            const card = document.createElement('div');
            card.className = `eb-product-card ${isFavorite ? 'favorite-active' : ''}`;
            card.dataset.productId = id;
            
            card.innerHTML = `
                <div class="eb-product-image-container">
                    <img class="eb-product-image" src="${img}" alt="${name}">
                    <div class="eb-bestseller-tag">
                        <img src="https://www.e-bebek.com/assets/images/cok-satan@2x.png" alt="Çok Satan">
                    </div>
                    <button class="eb-favorite-button ${isFavorite ? 'favorite-active' : ''}">
                        <img src="${isFavorite ? 'https://www.e-bebek.com/assets/svg/default-hover-favorite.svg' : 'https://www.e-bebek.com/assets/svg/default-favorite.svg'}" 
                            alt="Favorilere Ekle" 
                            class="favorite-icon">
                    </button>
                </div>
                <a href="${url}" class="eb-product-link" target="_blank">
                    <div class="eb-product-info">
                        <span class="eb-product-title">
                            <span class="eb-product-brand">${brand}</span> - ${name}
                        </span>
                    </div>
                    <div class="eb-product-price-container">
                        ${isDiscounted ? `
                            <div class="eb-price-wrapper">
                                <div class="eb-discount-info">
                                    <span class="eb-product-original-price">${originalPrice.toFixed(2)} TL</span>
                                    <span class="eb-discount-badge">%${discountAmount}</span>
                                </div>
                                <span class="eb-product-price">${price.toFixed(2)} TL</span>
                            </div>
                        ` : `
                            <div class="eb-price-wrapper">
                                <div class="eb-discount-info" style="visibility: hidden; height: 22px;">
                                    <span>&nbsp;</span>
                                </div>
                                <span class="eb-product-price eb-regular-price">${price.toFixed(2)} TL</span>
                            </div>
                        `}
                    </div>
                </a>
                <button class="eb-add-to-cart-button">Sepete Ekle</button>
            `;
            
            itemElement.appendChild(card);
            
            return itemElement;
        } catch (error) {
            console.error("Ürün kartı oluşturulurken hata:", error, product);
            return document.createElement('div');
        }
    };
    
    const buildHTML = () => {
        if (!products || products.length === 0) {
            console.error("Ürünler bulunamadı veya boş");
            return;
        }
        
        const existingCarousel = document.querySelector('.eb-custom-carousel-container');
        if (existingCarousel) {
            existingCarousel.remove();
        }
        
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'eb-custom-carousel-container';
        
        const titleContainer = document.createElement('div');
        titleContainer.className = 'eb-carousel-title-container';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'eb-carousel-title-wrapper';
        
        const title = document.createElement('h2');
        title.className = 'eb-carousel-title';
        title.textContent = 'Beğenebileceğinizi düşündüklerimiz';
        
        titleDiv.appendChild(title);
        titleContainer.appendChild(titleDiv);
        
        const carousel = document.createElement('div');
        carousel.className = 'eb-product-carousel';
        
        const prevButton = document.createElement('button');
        prevButton.className = 'eb-carousel-arrow eb-carousel-prev';
        prevButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'eb-carousel-arrow eb-carousel-next';
        nextButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>';
        
        const productShelf = document.createElement('div');
        productShelf.className = 'eb-owl-stage';
        productShelf.style.width = (products.length * 292.5) + 'px';
        productShelf.style.transform = 'translate3d(0px, 0px, 0px)';
        productShelf.style.transition = 'all 0s ease 0s';
        
        products.forEach((product, index) => {
            if (!product || typeof product !== 'object') {
                console.warn("Geçersiz ürün formatı:", product);
                return;
            }
            
            const productCard = createProductCard(product, index);
            productShelf.appendChild(productCard);
        });
        
        carousel.appendChild(prevButton);
        carousel.appendChild(productShelf);
        carousel.appendChild(nextButton);
        
        carouselContainer.appendChild(titleContainer);
        carouselContainer.appendChild(carousel);
        
        const spacerDiv = document.createElement('div');
        spacerDiv.className = 'eb-carousel-bottom-spacer';
        
        const bannerTitles = document.querySelector('.banner__titles');
        
        if (bannerTitles) {
            bannerTitles.parentNode.insertBefore(carouselContainer, bannerTitles);
            
            bannerTitles.parentNode.insertBefore(spacerDiv, bannerTitles);
            
            console.log("Karüsel banner__titles elementinin üstüne yerleştirildi");
        } else {
            console.warn("banner__titles sınıfı bulunamadı, alternatif hedefler deneniyor");
            
            const alternativeTargets = [
                '.banner-bg',
                '.container',
                '.main-content',
                'main',
                'body'
            ];
            
            let targetFound = false;
            
            for (const targetSelector of alternativeTargets) {
                const target = document.querySelector(targetSelector);
                if (target) {
                    target.parentNode.insertBefore(carouselContainer, target);
                    target.parentNode.insertBefore(spacerDiv, target);
                    console.log(`Carousel ${targetSelector} elementinin üstüne yerleştirildi`);
                    targetFound = true;
                    break;
                }
            }
            
            if (!targetFound) {
                document.body.appendChild(carouselContainer);
                document.body.appendChild(spacerDiv);
                console.warn("Hiçbir hedef element bulunamadı, doğrudan body'ye eklendi");
            }
        }
    };
    
    const buildCSS = () => {
        console.log("CSS uygulanıyor...");
    };
    
    init();
})();