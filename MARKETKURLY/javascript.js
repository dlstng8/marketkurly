document.addEventListener('DOMContentLoaded', () => {
    console.log("Kurly clone script started!");

    // ==================== Header Functions ====================
    try {
        const marketKurlyBtn = document.getElementById('market-kurly');
        const beautyKurlyBtn = document.getElementById('beauty-kurly');
        const menuItems = document.querySelectorAll('.menu-item');

        function handleMenuClick(event) {
            menuItems.forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');
        }

        marketKurlyBtn.addEventListener('click', handleMenuClick);
        beautyKurlyBtn.addEventListener('click', handleMenuClick);

        // ▼▼▼ 카테고리 메뉴 이벤트 리스너 수정 ▼▼▼
        const categoryMenuContainer = document.querySelector('.category-menu-container');
        const categoryBtn = document.querySelector('.category-btn');
        const categoryWrapper = document.querySelector('.category-wrapper');

        categoryMenuContainer.addEventListener('mouseenter', () => {
            categoryWrapper.style.display = 'block';
            categoryBtn.classList.add('active');
        });

        categoryMenuContainer.addEventListener('mouseleave', () => {
            categoryWrapper.style.display = 'none';
            categoryBtn.classList.remove('active');
        });
        // ▲▲▲ 카테고리 메뉴 이벤트 리스너 수정 끝 ▲▲▲

        console.log("Header functions initialized successfully.");
    } catch (error) {
        console.error("Error initializing header functions:", error);
    }

    // ==================== Main Content Functions ====================
    if (typeof Swiper === 'undefined') {
        console.error("Swiper library is not loaded.");
    } else {
        try {
            new Swiper('.main-banner-swiper', {
                loop: true,
                autoplay: { delay: 3500, disableOnInteraction: false },
                pagination: { el: '.main-banner-swiper .swiper-pagination', clickable: true },
                navigation: { nextEl: '.main-banner-swiper .swiper-button-next', prevEl: '.main-banner-swiper .swiper-button-prev' },
            });
            console.log("Main banner swiper initialized.");
        } catch (error) {
            console.error("Error initializing main banner swiper:", error);
        }
    }

    // ==================== Finite Scroll & Dynamic Section Creation ====================
    let isLoading = false;
    let sectionsRendered = 0;
    const TOTAL_SECTIONS = 50;
    const productSectionsWrapper = document.getElementById('product-sections-wrapper');
    const loader = document.querySelector('.loader');
    const footer = document.getElementById('main-footer');

    const sectionTitles = [
        "✨ MD의 강력 추천 상품!", "🏆 지금 가장 인기있어요", "⏰ 놓치면 후회할 가격!",
        "🛒 장바구니 단골템 모음", "💖 재구매율 높은 상품", "🔥 실시간 인기 급상승",
    ];
    
    const rankingCategories = ["간편식 TOP50", "간식 TOP50", "베이커리 TOP50", "반찬 TOP50", "유제품 TOP50", "주방 TOP50", "뷰티 TOP50"];
    
    const bannerImages = ["assets/banner1.png", "assets/banner2.jpg", "assets/banner3.png", "assets/banner4.png", "assets/banner5.png"];

    const sampleProducts = [
        { name: '[KF365] 1+등급 무항생제 대란 20구', imgSrc: 'assets/sang-1.jpg', price: 6900, discount: 10 },
        { name: '[연세우유] 전용목장우유 900mL', imgSrc: 'assets/sang-2.jpg', price: 2280, discount: 0 },
        { name: '[풀무원] 동물복지 목초란 15구', imgSrc: 'assets/sang-3.jpg', price: 7500, discount: 15 },
        { name: '[프로젝트하루] 고소한 하루견과', imgSrc: 'assets/sang-4.jpg', price: 11900, discount: 0 },
        { name: '[브라운] 성분이 다른 물티슈 10개입', imgSrc: 'assets/sang-5.jpg', price: 18900, discount: 0 },
        { name: '[종가] 아삭 칼집 포기김치 4kg', imgSrc: 'assets/sang-6.jpg', price: 29800, discount: 20 },
        { name: '[파머스] GAP 샤인머스캣 1.5kg', imgSrc: 'assets/sang-7.jpg', price: 25900, discount: 0 },
        { name: '[하림] 동물복지 닭가슴살 1kg', imgSrc: 'assets/sang-8.jpg', price: 15900, discount: 10 },
        { name: '[제주 삼다수] 그린 2L (6개입)', imgSrc: 'assets/sang-9.jpg', price: 6300, discount: 0 },
        { name: '[오뚜기] 진라면 매운맛 (5개입)', imgSrc: 'assets/sang-10.jpg', price: 3850, discount: 5 },
        { name: '[햇반] 매일잡곡밥 210g (12개입)', imgSrc: 'assets/sang-11.jpg', price: 17900, discount: 0 },
        { name: '[서울우유] 체다치즈 50매입', imgSrc: 'assets/sang-12.jpg', price: 12900, discount: 10 },
    ];
    
    function initializeProductSwiper(swiperSelector, prevBtnSelector, nextBtnSelector) {
        if (typeof Swiper === 'undefined' || !document.querySelector(swiperSelector)) return;
        try {
            new Swiper(swiperSelector, {
                slidesPerView: 4,
                spaceBetween: 18,
                slidesPerGroup: 4,
                navigation: {
                    nextEl: nextBtnSelector,
                    prevEl: prevBtnSelector,
                },
            });
            console.log(`Product swiper initialized for ${swiperSelector}`);
        } catch (error) {
            console.error(`Failed to initialize swiper for ${swiperSelector}:`, error);
        }
    }

    function fetchProducts(count) {
        return new Promise(resolve => {
            setTimeout(() => {
                const products = [];
                for (let i = 0; i < count; i++) {
                    products.push(sampleProducts[Math.floor(Math.random() * sampleProducts.length)]);
                }
                resolve(products);
            }, 500);
        });
    }
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    async function createAndAppendProductSection() {
        const productsToFetch = 12;
        const newProducts = await fetchProducts(productsToFetch);
        const newSection = document.createElement('section');
        newSection.className = 'product-section';
        const title = (sectionsRendered === 0) ? "이 상품 어때요?" : sectionTitles[Math.floor(Math.random() * sectionTitles.length)];
        const swiperId = `product-swiper-${sectionsRendered}`;
        const swiperSelector = `.${swiperId}`;
        const prevBtnSelector = `.${swiperId}-prev`;
        const nextBtnSelector = `.${swiperId}-next`;

        newSection.innerHTML = `
            <div class="section-container">
                <h2 class="section-title">${title}</h2>
                <div class="swiper product-swiper ${swiperId}">
                    <div class="swiper-wrapper"></div>
                </div>
                <div class="swiper-button-prev ${swiperId}-prev"></div>
                <div class="swiper-button-next ${swiperId}-next"></div>
            </div>
        `;
        productSectionsWrapper.appendChild(newSection);
        const targetSwiperWrapper = newSection.querySelector('.swiper-wrapper');

        if (!targetSwiperWrapper) return;

        newProducts.forEach(product => {
            const productItem = createProductItem(product);
            productItem.classList.add('swiper-slide');
            targetSwiperWrapper.appendChild(productItem);
            observer.observe(productItem);
        });
        
        initializeProductSwiper(swiperSelector, prevBtnSelector, nextBtnSelector);
    }

    async function createAndAppendRankingSection() {
        const rankingProducts = await fetchProducts(9);
        const newSection = document.createElement('section');
        newSection.className = 'product-section ranking-section';
        const tabHtml = rankingCategories.map((cat, index) => `<button class="ranking-tab ${index === 0 ? 'active' : ''}">${cat}</button>`).join('');
        const newGrid = document.createElement('div');
        newGrid.className = 'ranking-grid';

        rankingProducts.forEach((product, index) => {
            const rankingItem = createRankingItem(product, index + 1);
            newGrid.appendChild(rankingItem);
            observer.observe(rankingItem);
        });

        newSection.innerHTML = `<div class="section-container"><h2 class="section-title">오늘의 카테고리 랭킹</h2><div class="ranking-tabs">${tabHtml}</div></div>`;
        newSection.querySelector('.section-container').appendChild(newGrid);
        productSectionsWrapper.appendChild(newSection);
    }

    function createAndAppendBannerSection() {
        const newSection = document.createElement('section');
        newSection.className = 'product-section banner-section';
        const randomBannerSrc = bannerImages[Math.floor(Math.random() * bannerImages.length)];
        newSection.innerHTML = `<div class="section-container"><a href="#"><img src="${randomBannerSrc}" alt="중간 광고 배너"></a></div>`;
        productSectionsWrapper.appendChild(newSection);
    }
    
    function createProductItem(product) {
        const item = document.createElement('div');
        item.className = 'product-item';
        let priceHTML = product.discount > 0
            ? `<div class="product-price"><span class="discount-rate">${product.discount}%</span><span class="final-price">${Math.round(product.price * (100 - product.discount) / 100).toLocaleString()}원</span></div><p class="original-price">${product.price.toLocaleString()}원</p>`
            : `<div class="product-price"><span class="final-price">${product.price.toLocaleString()}원</span></div>`;
        const cartBtnHTML = `<button class="add-to-cart-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> 담기</button>`;
        item.innerHTML = `<a href="#"><div class="product-img"><img src="${product.imgSrc}" alt="${product.name}"></div></a> ${cartBtnHTML} <div class="product-info"><a href="#"><h3 class="product-name">${product.name}</h3>${priceHTML}</a></div>`;
        return item;
    }

    function createRankingItem(product, rank) {
        const item = document.createElement('div');
        item.className = 'product-item ranking-item';
        let priceHTML = product.discount > 0
            ? `<div class="product-price"><span class="discount-rate">${product.discount}%</span><span class="final-price">${Math.round(product.price * (100 - product.discount) / 100).toLocaleString()}원</span></div><p class="original-price">${product.price.toLocaleString()}원</p>`
            : `<div class="product-price"><span class="final-price">${product.price.toLocaleString()}원</span></div>`;
        const cartBtnHTML = `<button class="add-to-cart-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> 담기</button>`;
        item.innerHTML = `<span class="rank-number">${rank}</span><div class="product-img-wrapper"><a href="#"><img src="${product.imgSrc}" alt="${product.name}"></a></div><div class="product-info"><a href="#"><h3 class="product-name">${product.name}</h3>${priceHTML}</a>${cartBtnHTML}</div>`;
        return item;
    }
    
    async function loadMoreContent() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';

        try {
            const nextSectionIndex = sectionsRendered + 1;
            
            if (nextSectionIndex > 1 && nextSectionIndex % 7 === 0) {
                createAndAppendBannerSection();
            } else if (nextSectionIndex > 1 && nextSectionIndex % 5 === 0) {
                await createAndAppendRankingSection();
            } else {
                await createAndAppendProductSection();
            }
            sectionsRendered = nextSectionIndex;
        } catch (error) {
            console.error("콘텐츠 로딩 중 오류 발생:", error);
        } finally {
            loader.style.display = 'none';
            isLoading = false;
        }
    }

    const handleScroll = () => {
        if (sectionsRendered >= TOTAL_SECTIONS) {
            if (footer && footer.style.display === 'none') {
                footer.style.display = 'block';
                setTimeout(() => footer.classList.add('visible'), 100);
            }
            window.removeEventListener('scroll', handleScroll);
            return;
        }

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isLoading) {
            loadMoreContent();
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 초기 로드를 loadMoreContent 함수를 통해 시작
    loadMoreContent();
});

