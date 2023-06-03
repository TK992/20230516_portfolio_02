'use strict'

{
  // ---------- ローディング周りの動き ----------
  // load後にローディングアイコンを削除
  const loader = document.querySelector('#loader')
  window.addEventListener('load', () => {
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
  const slidesOver = document.querySelector('.photo__wrapper--over');
  const slideOver = Array.from(slidesOver.children);
  const slideWidth = slideOver[0].width;

  // 画像を複製して最終行に追加（2周目終了後に1枚目の画像に戻すため）
  slideOver.forEach((slide) => {
    const cloneSlide = slide.cloneNode(true);
    cloneSlide.classList.add('clone');
    slidesOver.appendChild(cloneSlide);
  });

  // 複製分を加えた画像の合計
  const sumSlidesOver = Array.from(slidesOver.children);
  // スライドショーの横幅
  slidesOver.style.width = `${(slideWidth + 16) * (sumSlidesOver.length)}px`;

  // スライドショーを動かす関数
  function loopSlides() {
    slidesOver.style.transition = 'none';
    slidesOver.style.transform = 'translateX(16px)';
    setTimeout(() => {
      slidesOver.style.transition = 'transform 30s linear';
      slidesOver.style.transform = `translateX(${-slideWidth * sumSlidesOver.length - 16}px)`;
    }, 10);
  }

  // スライドショーの実行
  loopSlides();
  let intervalId = setInterval(loopSlides, 30010);

  

  
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