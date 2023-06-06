'use strict'

{
  // ---------- ローディング周りの動き ----------
  // load後にローディングアイコンを削除
  window.addEventListener('load', () => {
    const loader = document.querySelector('#loader')
    loader.style.display = 'none';
  });
  
  // load後に各コンテンツを表示
  window.addEventListener('load', function() {
    const loaded = document.querySelectorAll('.load')
    loaded.forEach(load => {
      load.classList.remove('load')
    })
  });
  

  
  
  // ---------- .appear要素が20％読み込まれたら表示する ----------
  function appearItems() {
    const targets = document.querySelectorAll('.appear');
    
    // showをすると同時に監視を止める
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
  window.addEventListener('load', appearItems);
    


    
  // ---------- メニューボタンクリックでナビを表示・非表示 ----------
  const btn = document.querySelector('.header__button');
  const menu = document.querySelector('.header__nav-sp');

  // SP用ナビを表示
  btn.addEventListener('click', ()=> {
    menu.style.display = 'flex';
  
    // transitionを効かせるためにsetTimeout使用
    setTimeout(() => {
      menu.classList.add('open');
    }, 10);
  });

  // リンク先をクリックしたらSP用ナビを非表示
  const menuLink = document.querySelectorAll('.header__nav-sp--link');
  menuLink.forEach(elm => {
      elm.addEventListener('click', ()=> {
        menu.classList.remove('open');
        
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
    constructor(obj) {
      this.$slides = document.querySelector(obj.hookName);
      this.$start = obj.startCoord;
      this.$end = obj.endCoord;
      this.$firstViewportWidth = obj.firstViewportWidth;
      this.$secondViewportWidth = obj.secondViewportWidth;

      this.addSlides(this.$slides);
    }
    
    // 画像を複製して最終行に追加（2周目終了後に1枚目の画像に戻すため）
    addSlides($slides) {
      const arraySlides = Array.from($slides.children);
      
      arraySlides.forEach((slide) => {
        const cloneSlide = slide.cloneNode(true);
        cloneSlide.classList.add('clone');
        $slides.appendChild(cloneSlide);
      })
      
      this.sumSlidesWidth($slides);
    }
    
    // 複製分を加えたスライドショーの幅を算出
    sumSlidesWidth($slides) {
      const sumSlides = $slides.children;
      const slideWidth = sumSlides[0].width;
      console.log(sumSlides[0].width);
    
      // スライドショーの横幅
      $slides.style.width = `${(slideWidth + 16 /*スライド間のマージン*/) * (sumSlides.length)}px`;
      const slideshowWidth = (`${parseInt($slides.style.width)}`)

      this.loopSlides(slideshowWidth)
    }
    
    // スライドショーを動かす関数
    loopSlides(slideshowWidth) {
      const {$slides, $start, $end,$firstViewportWidth, $secondViewportWidth} = this;

      $slides.style.transition = 'none';
      $slides.style.transform = `translateX(${slideshowWidth * $start + $firstViewportWidth}px)`;
      
      setTimeout(() => {
        $slides.style.transition = 'transform 30s linear';
        $slides.style.transform = `translateX(${slideshowWidth * $end + $secondViewportWidth}px)`;
      }, 10);
      
      this.repeatSlideshow(slideshowWidth);
    }
    
    repeatSlideshow(slideshowWidth) {
      const intervalId = setInterval(() => {
        this.loopSlides(slideshowWidth);
      }, 30010);
    }
  }
  
  const slideRight = new Slideshow ({
    hookName: '.photo__wrapper--over',
    startCoord: '0',
    endCoord: '-1',
    firstViewportWidth: 0,
    secondViewportWidth: window.innerWidth
  });

  const slideLeft = new Slideshow ({
    hookName: '.photo__wrapper--under',
    startCoord: '-1',
    endCoord: '0',
    firstViewportWidth: window.innerWidth,
    secondViewportWidth: 0
  });
    
    
      
      
      
      
      
  
  
  
  
  
  
  

  
  // photoセクションの画像クリックでモーダルを表示
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