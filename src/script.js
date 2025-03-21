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
        
        self.buildHTML();
        self.buildCSS();
        self.setEvents();
    };

    const buildHTML = () => {
        const html = `
            <div class="container">
                <h1></h1>
            </div>
        `;
        
        $('.product-detail').append(html);
    };
    
    const buildCSS = () => {
        const css = `
            .container {
                background-color: red;
                height: 100px;
                weight: 100px;
            }
        `;

        $('<style>').addClass('carousel-style')
                    .html(css)
                    .appendTo('head');
    };

    const setEvents = () => {
        $('').on('click', () => {
            console.log('clicked');
        });
    };

    init();
})();


