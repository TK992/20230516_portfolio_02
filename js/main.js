'use strict'

{
  // ---------- ローディング周りの動き ----------
  // load後にローディングアイコンを削除
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    loader.style.display = 'none';
  });
  
  // load後に各コンテンツを表示
  window.addEventListener('load', function() {
    const loading = document.querySelectorAll('.loading')
    loading.forEach(load => {
      load.classList.remove('loading')
    })
  });
  
  
  
  // ---------- スクロールされたらアンカーリンク表示 ----------
  window.addEventListener('scroll', function() {
    const fixedLink = document.querySelector(".fixed-link");
    
    if(window.scrollY >= 50) {
      fixedLink.classList.add("show");
    } 
  });



  // ---------- .hidden要素が20％読み込まれたら表示する ----------
  function showItems() {
    const targets = document.querySelectorAll('.hidden-down, .hidden-right, .hidden-left');
    
    // .showを付与すると同時に監視を止める
    function callback(entries, obs) {
      entries.forEach(entry => {
        if(!entry.isIntersecting) {
          return;
        } else {
          entry.target.classList.add('show');
          obs.unobserve(entry.target)
        }
      }
    )};
      
    // 20%の読み込みを監視
    const options = {
      threshold: 0.2,
    };
    
    const observer = new IntersectionObserver(callback, options);
    targets.forEach(target => {
      observer.observe(target);
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
        }, 310);
    });
  });




  // ---------- Swiperの設定 ----------
  // fadeでじんわりスライド
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
      this.interval = 35000;

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
    
      // スライドショーの横幅
      this.slideWrapper.style.width = `${(slideWidth + this.margin) * (slides.length)}px`;
      return this;
    }
    
    // スライドショーを動かす関数
    loopSlides() {
      const {slideWrapper, position, viewport} = this;

      slideWrapper.style.transition = 'none';
      if (position === 'over') {
        slideWrapper.style.transform = 'translateX(0)';
      } else {
        slideWrapper.style.transform = `translateX(-${parseInt(slideWrapper.style.width) - viewport}px)`;
      }
      
      setTimeout(() => {
        slideWrapper.style.transition = 'transform 35s linear';
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
    
  // slides.style.transition = 'none';
  // slides.style.transform = `translateX({slideshowWidth * start + firstViewportWidth}px)`;
  
  // setTimeout(() => {
  //   slides.style.transition = 'transform 30s linear';
  //   slides.style.transform = `translateX({slideshowWidth * $end + $secondViewportWidth}px)`;
  // }, 10);
    
      
      
      
      
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