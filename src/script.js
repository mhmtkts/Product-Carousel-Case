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
                            <span class="eb-product-price eb-regular-price">${price.toFixed(2)} TL</span>
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
        productShelf.style.width = (products.length * 292.5) + 'px'; // 272.5px ürün genişliği + 20px sağ margin
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
                    console.log(`Karüsel ${targetSelector} elementinin üstüne yerleştirildi`);
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
        const css = `
            .eb-carousel-spacer {
                height: 40px;
                width: 100%;
                clear: both;
            }
            
            .eb-carousel-bottom-spacer {
                height: 60px;
                width: 100%;
                clear: both;
            }
            
            .eb-custom-carousel-container {
                max-width: 1200px;
                margin: 40px auto;
                padding: 0 15px;
                font-family: Poppins, "cursive", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                clear: both;
            }
            
            .eb-carousel-title-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .eb-carousel-title-wrapper {
                display: flex;
                align-items: center;
            }
            
            .eb-carousel-title {
                font-size: 22px;
                font-weight: 600;
                color: #333;
                margin: 0;
            }
            
            .eb-product-carousel {
                position: relative;
                overflow: hidden;
                margin: 0 -15px;
                padding: 0 15px;
            }
            
            .eb-owl-stage {
                display: flex;
                transition: transform 0.5s ease;
            }
            
            .eb-owl-item {
                flex-shrink: 0;
                padding: 10px 0;
                transition: all 0.3s ease;
                height: 557.6px;
            }
            
            .eb-product-card {
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                transition: border-color 0.3s ease;
                position: relative;
                background: white;
                height: 100%;
                width: 272.5px;
                border: 2px solid transparent;
                display: flex;
                flex-direction: column;
            }
            
            .eb-product-card:hover {
                border-color: #F28E00;
                border-width: 3px;
            }
            
            .eb-product-card.favorite-active {
                border-color: #F28E00;
            }
            
            .eb-product-image-container {
                position: relative;
                width: 272.5px;
                height: 272.5px;
                overflow: hidden;
            }
            
            .eb-product-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .eb-bestseller-tag {
                position: absolute;
                top: 10px;
                left: 10px;
                width: 56px;
                height: 56.5px;
                z-index: 2;
            }
            
            .eb-bestseller-tag img {
                width: 100%;
                height: 100%;
            }
            
            .eb-discount-badge {
                display: inline-block;
                margin-left: 8px;
                background: #00A365;
                color: white;
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .eb-favorite-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 2;
                padding: 0;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .eb-favorite-button .favorite-icon {
                width: 25px;
                height: 25px;
            }
            
            .eb-product-link {
                display: block;
                padding: 0 17px 17px;
                color: inherit;
                text-decoration: none;
                flex-grow: 1;
            }
            
            .eb-product-info {
                padding-top: 17px;
                margin-bottom: 5px;
            }
            
            .eb-product-title {
                font-size: 14px;
                color: #333;
                font-weight: 500;
                line-height: 1.222222;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            
            .eb-product-brand {
                font-weight: bolder;
                color: #7D7D7D;
            }
            
            .eb-product-price-container {
                display: flex;
                flex-direction: column;
                margin-top: 10px;
            }
            
            .eb-price-wrapper {
                display: flex;
                flex-direction: column;
            }
            
            .eb-discount-info {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
            }
            
            .eb-product-price {
                font-size: 18px;
                font-weight: 700;
                color: #00A365;
            }
            
            .eb-regular-price {
                color: #7D7D7D;
            }
            
            .eb-product-original-price {
                font-size: 14px;
                text-decoration: line-through;
                color: #7D7D7D;
            }
            
            .eb-add-to-cart-button {
                width: 226.9px;
                height: 48px;
                padding: 15px 20px;
                border-radius: 37.5px;
                background-color: #fff7ec;
                color: #f28e00;
                font-family: Poppins, "cursive";
                font-size: 1.4rem;
                font-weight: 700;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 0 17px 17px;
            }
            
            .eb-add-to-cart-button:hover {
                background-color: #f28e00;
                color: #fff;
            }
            
            .eb-carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                background: white;
                border: none;
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .eb-carousel-arrow:hover {
                background: #f8f8f8;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .eb-carousel-prev {
                left: 10px;
            }
            
            .eb-carousel-next {
                right: 10px;
            }
            
            .eb-carousel-arrow svg {
                width: 24px;
                height: 24px;
                fill: #555;
            }
            
            /* Responsive tasarım - yalnızca görünür ürün sayısını değiştirir, kart boyutlarını değil */
            @media (max-width: 1200px) {
                .eb-custom-carousel-container {
                    max-width: 900px;
                }
            }
            
            @media (max-width: 992px) {
                .eb-custom-carousel-container {
                    max-width: 600px;
                }
            }
            
            @media (max-width: 768px) {
                .eb-custom-carousel-container {
                    max-width: 300px;
                }
                
                .eb-carousel-title {
                    font-size: 18px;
                }
                
                .eb-carousel-bottom-spacer {
                    height: 40px;
                }
            }
            
            @media (max-width: 480px) {
                .eb-carousel-title {
                    font-size: 16px;
                }
                
                .eb-carousel-bottom-spacer {
                    height: 30px;
                }
            }
        `;
        
        const existingStyle = document.querySelector('.eb-carousel-style');
        if (existingStyle) {
            existingStyle.textContent = css;
        } else {
            const styleElement = document.createElement('style');
            styleElement.className = 'eb-carousel-style';
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }
    };
    
    init();
})();