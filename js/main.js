'use strict'

{

    // load後にローディングアイコンを削除する
    const loader = document.querySelector('#loader')
    window.addEventListener('load', () => {
      loader.style.display = 'none';
    });
  
    // load後に各コンテンツを表示させる
    window.addEventListener('load', function() {
      const loaded = document.querySelectorAll('.load')
        loaded.forEach(load => {
          load.classList.remove('load')
        })
      });


  // IntersectionObserverで要素を20%読み込んだらクラスを付与する
  function appearItems() {
    const targets = document.querySelectorAll('.appear');
    
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
    
    const options = {
      threshold: 0.2,
    };
    
    const observer = new IntersectionObserver(callback, options);
    targets.forEach(target => {
      observer.observe(target);
    });
  }
  window.addEventListener('load', appearItems);



  // ナビゲーションのボタンをクリックしたらメニューを表示・非表示する
  const btn = document.querySelector('.header__button');
  const menu = document.querySelector('.header__nav-sp');

  // SP用ナビゲーション表示
  btn.addEventListener('click', ()=> {
    menu.style.display = 'flex';
  
    setTimeout(() => {
      menu.classList.add('open');
    }, 10);
  });

// SP用ナビゲーション消す
const menuLink = document.querySelectorAll('.header__nav-sp--link');
menuLink.forEach(elm => {
    elm.addEventListener('click', ()=> {
      menu.classList.remove('open');
      
      setTimeout(() => {
        menu.style.display = 'none'
      }, 400);
  });
});

  // メニューのカルーセル
  const swiper = new Swiper('.swiper', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },

    pagination: {
      el: '.swiper-pagination',
    },
  
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  

  // 「photo」セクションのスライドアニメーション
  // 横1列に並べたスライドを2分割し、一方に追従させてループを持続する

  // elm：アニメーションさせるclass
  // start：スライド開始位置
  // end：スライド終了位置
  // iteration：アニメーション開始時の進行度
  function slideAnimation(elm, start, end, iteration) {
    const slides = document.querySelectorAll(elm);

    slides.forEach((slide) => {
      slide.animate( [ {
        transform : `translateX(${start})`,
        } , {
        transform : `translateX(${end})` ,
      } ] , {
        iterationStart: `${iteration}`,
        duration: 30000,
        iterations: Infinity
      });
    });
  };

  // 要素が読み込まれたらアニメーション開始
  window.addEventListener("DOMContentLoaded", () => {
    // 上段のスライドアニメーション
    slideAnimation('.photo__slide--over2', '0%', '-1200%',0);
    slideAnimation('.photo__slide--over', '600%', '-600%', 0.5);
    // 下段のスライドアニメーション
    slideAnimation('.photo__slide--under2', '-1200%', '0%',0);
    slideAnimation('.photo__slide--under', '-600%', '600%', 0.5);
  })


  
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



  // アンカーリンクをスムースに挙動させる
    const anchorLink = document.querySelector('.fixed-link__anchor');
    
    anchorLink.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
}