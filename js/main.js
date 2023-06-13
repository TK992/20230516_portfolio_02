'use strict'

{
  // ---------- ローディング周りの動き ----------
  // load後にローディングアイコンを削除
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    loader.style.display = 'none';
  });
  
  // load後に各コンテンツの非表示を解除・Fvを表示
  window.addEventListener('load', function() {
    const loading = document.querySelectorAll('.loading')
    const fv = document.querySelectorAll('.fv .hidden')
    
    loading.forEach(elm => {
      elm.classList.remove("loading");
    })

    setTimeout(() => {
      fv.forEach(elm => {
        elm.classList.add("show");
      }, 10);
    });
  });
  
  
  
  // ---------- 100px以上スクロールされたら表示 ----------
  window.addEventListener('scroll', function() {
    const fixedLink = document.querySelector(".fixed-link");
    const storeOver = document.querySelectorAll(".store-sp__title, .store-sp__over");
    
    if(window.scrollY >= 50) {
      fixedLink.classList.add("show");
      fixedLink.style.opacity = 0.8;

      storeOver.forEach(elm => {
        elm.classList.add("show")
      });
    };
  });



  // ---------- .hidden要素が画面内に入ったら表示 ----------
  function showItems() {
    const hiddenItems = document.querySelectorAll('.hidden');
    
    // .showを付与すると同時に監視を止める
    function callback(entries, observer) {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('show')
          observer.unobserve(entry.target);
        } else {
          return;
        }
      });
    };

    // 読み込みを監視
    const options = { threshold:0.5 };
    const observer = new IntersectionObserver(callback, options);
    hiddenItems.forEach(hiddenItem => {
      observer.observe(hiddenItem);
    });
  }
  window.addEventListener('load', showItems);
    


    
  // ---------- メニューボタンクリックでナビを表示・非表示 ----------
  const btn = document.querySelector('.header__button');
  const menu = document.querySelector('.header__nav-sp');

  // SP用ナビを表示
  btn.addEventListener('click', ()=> {
    menu.style.display = 'flex';
  
    // transitionを効かせるためにsetTimeout使用
    setTimeout(() => {
      menu.classList.add('active');
    }, 10);
  });

  // リンク先をクリックしたらSP用ナビを非表示
  const menuLink = document.querySelectorAll('.header__nav-sp--link');
  menuLink.forEach(elm => {
      elm.addEventListener('click', ()=> {
        menu.classList.remove('active');
        
        setTimeout(() => {
          menu.style.display = 'none'
        }, 500);
    });
  });




  // ---------- Swiperの設定 ----------
  // スライド時にfadeをかける
  const swiper = new Swiper('.swiper', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },

    // paginationをつける
    pagination: {
      el: '.swiper-pagination',
    },
  
    // 「次へ」「戻る」ボタンをつける
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  
  
  // ---------- スライドショーのアニメーション ----------
  
  class Slideshow {
    constructor({hookName, position,}) {
      this.slideWrapper = document.querySelector(hookName);
      this.position = position;
      this.viewport = window.innerWidth;
      this.margin = 16;
      this.interval = 40000;

      this.addSlides()
      .sumSlidesWidth()
      .loopSlides();

      setInterval(() => {
        this.loopSlides();
      }, this.interval);
    }
    
    // 画像を複製して最終行に追加（2周目終了後に1枚目の画像に戻すため）
    addSlides() {
      const arraySlides = Array.from(this.slideWrapper.children);
      
      arraySlides.forEach((slide) => {
        const cloneSlide = slide.cloneNode(true);
        cloneSlide.classList.add('clone');
        this.slideWrapper.appendChild(cloneSlide);
      });
      return this;
    };
    
    // 複製分を加えたスライドショーの幅を算出
    sumSlidesWidth() {
      const slides = this.slideWrapper.children;
      const slideWidth = slides[0].width;
    
      this.slideWrapper.style.width = `${(slideWidth + this.margin) * (slides.length)}px`;
      return this;
    }
    
    // 一定間隔でスライドショーをループする
    loopSlides() {
      const {slideWrapper, position, viewport} = this;

      slideWrapper.style.transition = 'none';
      if (position === 'over') {
        slideWrapper.style.transform = 'translateX(0)';
      } else {
        slideWrapper.style.transform = `translateX(-${parseInt(slideWrapper.style.width) - viewport}px)`;
      }
      
      setTimeout(() => {
        slideWrapper.style.transition = 'transform 40s linear';
        if (position === 'over') {
          slideWrapper.style.transform = `translateX(-${parseInt(slideWrapper.style.width) - viewport}px)`;
        } else {
          slideWrapper.style.transform = 'translateX(0)';
        }
      }, 10);
      return this;
    }
  }
  
  const slideRight = new Slideshow ({
    hookName: '.photo__wrapper--over',
    position: 'over',
  });
  
  const slideLeft = new Slideshow ({
    hookName: '.photo__wrapper--under',
    position: 'under',
  });




  // ---------- 画像クリックでモーダル展開 ----------
  const modal = document.querySelector('.photo__modal');
  const modalImage = document.querySelector('.photo__modal--img');
  const images = document.querySelectorAll('.slide');

  images.forEach((image) => {
    image.addEventListener('click', () => {
      modal.classList.add('showModal');
      modalImage.classList.add('showModal');
      
      const imageSrc = image.getAttribute('data-src');
      modalImage.src = imageSrc;
    });
  });
        
  modal.addEventListener('click', () => {
    if (modal.classList.contains('showModal')) {
      modal.classList.remove('showModal');
      modalImage.classList.remove('showModal');
    }
  });
}