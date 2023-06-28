'use strict'

{
  // ---------- ローディング周りの動き ----------
  // loadイベント後「Loading...」を非表示
  const loader = document.querySelector('.loader')
  const loading = document.querySelectorAll('.loading');
  const bodyWidth = document.body.clientWidth;
  
  window.addEventListener('load', () => {
    // ローダーを削除
    loader.style.display = 'none';
    
    // 各要素の非表示を解除・Fvを表示
    loading.forEach(elm => {
      elm.classList.remove('loading');
      setTimeout(() => {
        elm.classList.add('show');
      }, 10);
    });  
    
    // 固定リンクはコンテンツ右に表示してopacityをかける
    const fixedLink = document.querySelector('.fixed-link')
    const viewport = document.documentElement.clientWidth;
    if (viewport < 768) {
      fixedLink.style.right = '0px';
    } else if (viewport < 1025) {
      fixedLink.style.right = '40px';
    } else {
      fixedLink.style.right = `${(viewport - bodyWidth) / 2 + 40}px`;
      // 40 = 片側のpadding：76px - 予約ボタンの幅：36px;
    }
    fixedLink.style.opacity = 0.8;
  });
  
  
  
  
  // ---------- .hidden要素が画面内に入ったら表示 ----------
  const hiddenItems = document.querySelectorAll('.hidden');
  
  // .showを付与すると同時に監視を止める
  function addShow(entries, observer) {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      } else {
        return;
      }
    });
  };
  
  // 読み込みを監視
  const io = new IntersectionObserver(addShow);
  hiddenItems.forEach(hiddenItem => {
    io.observe(hiddenItem);
  });
    
    
    
    
  // ---------- メニューボタンクリックでナビを表示・非表示 ----------
  const btn = document.querySelector('.header__button');
  const menu = document.querySelector('.header__nav-sp');
  
  // SP用ナビを表示
  btn.addEventListener('click', ()=> {
    menu.style.display = 'flex';
    
    // transitionを効かせるためにsetTimeoutでclassを付与
    setTimeout(() => {
      menu.classList.add('active');
    }, 10);
  });
  
  
  // リンク先をクリックしたらSP用ナビを非表示
  const menuLinks = document.querySelectorAll('.header__nav-sp--link');
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', ()=> {
      menu.classList.remove('active');
      
      setTimeout(() => {
        menu.style.display = 'none'
      }, 400);
    });
  });
  
  
  
  
  // ---------- Swiperの設定 ----------
  const swiper = new Swiper('.swiper', {
    // スライド時にfadeをかける
    effect: 'fade',
    fadeEffect: { crossFade: true },
    
    // paginationをつける
    pagination: {
      el: '.swiper-pagination',
    },
    
    // 「次へ」「戻る」の矢印をつける
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  
  
  // スライドをMutationObserverで監視する
  const targets = document.querySelectorAll('.swiper-slide');
  const [firstSlide, secondSlide, thirdSlide] = targets;
  
  // 各スライドの状態を変化させる関数
  const changeSlide = (slide, visibility, transform) => {
    slide.style.cssText = `
    visibility: ${visibility};
    transform: ${transform};
    `;
  };
  
  
  // 2スライド目が持つクラスに応じて、各スライドの表示・非表示を切り替え
  const mo = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      // 1スライド目表示時
      if (secondSlide.classList.contains('swiper-slide-next')) {
        changeSlide(firstSlide, 'visible');
        changeSlide(secondSlide, 'hidden');
        changeSlide(thirdSlide, 'hidden');

      // 2スライド目表示時
      } else if (secondSlide.classList.contains('swiper-slide-active')) {
        changeSlide(secondSlide, 'visible', `translateX(-${bodyWidth}px)`);
        changeSlide(thirdSlide, 'hidden');
        
      // 3スライド目表示時
      } else if (secondSlide.classList.contains('swiper-slide-prev')) {
        changeSlide(thirdSlide, 'visible', `translateX(-${bodyWidth * 2}px)`);
      }
    })
  })

  // 各スライドのclassに変化がないかを監視する
  targets.forEach(target => {
    mo.observe(target, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  
  
  // ---------- スライドショーのアニメーション ----------
  // アニメーションのクラス
  class Slideshow {
    constructor({hookName, position,}) {
      this.slideWrapper = document.querySelector(hookName);
      this.position = position;
      this.viewport = window.innerWidth;
      this.slideWidth = 90;
      this.margin = 16;
      if (this.viewport > 767) {
        this.slideWidth = this.slideWidth * 2;
        this.margin = this.margin * 2;
      }
      this.interval = 60000;

      this.cloneSlides()
      .sumSlidesWidth()
      .startLoop();
    }
    

    // 画像を複製して最終行に追加する関数（スライドショーを途切れさせないため）
    cloneSlides() {
      const arraySlides = Array.from(this.slideWrapper.children);
      
      arraySlides.forEach((slide) => {
        const cloneSlide = slide.cloneNode(true);
        cloneSlide.classList.add('clone');
        this.slideWrapper.appendChild(cloneSlide);
      });

      // モーダルのイベントリスナーに完了を伝える
      const event = new Event('cloneSlideComplete');
      document.dispatchEvent(event);
      
      return this;
    };
    
    
    // 複製分を加えたスライドショーの幅を算出する関数
    sumSlidesWidth() {
      const slides = this.slideWrapper.children;
      this.slideWrapper.style.width = `${(this.slideWidth + this.margin) * (slides.length)}px`;
      
      return this;
    }
    
    
    // 一定間隔でスライドショーをループする関数
    loopSlides() {
      const {slideWrapper, position, viewport} = this;
      // 瞬時に最初のスライドに戻すため
      slideWrapper.style.transition = 'none';
      
      // 上段のスライドショーを動かす
      if (slideWrapper.classList.contains('photo__wrapper--over')) {
        slideWrapper.style.transform = 'translateX(0)';
        setTimeout(() => {
          slideWrapper.style.transition = 'transform 60s linear';
          slideWrapper.style.transform = `translateX(-${parseInt(slideWrapper.style.width) - viewport}px)`;
        },200);
        // 下段のスライドショーを動かす
      } else {
        slideWrapper.style.transform = `translateX(-${parseInt(slideWrapper.style.width) - viewport}px)`;
        setTimeout(() => {
          slideWrapper.style.transition = 'transform 60s linear';
          slideWrapper.style.transform = 'translateX(0)';
        },200);
      }
      
      return this;
    }
    
    
    // アニメーションを開始・インターバルをおいてループさせる関数
    startLoop() {
      setTimeout(() => {
        this.loopSlides();
        
        setInterval(() => {
          this.loopSlides();
        }, this.interval);
      },800);
    }
  }
  
  window.addEventListener('load', () => {
    // スライドショーの上下を分けてインスタンス生成
    // 上段
    const slideRight = new Slideshow ({
      hookName: '.photo__wrapper--over',
      position: 'over',
    });
    
    // 下段
    const slideLeft = new Slideshow ({
      hookName: '.photo__wrapper--under',
      position: 'under',
    });
  })
  
  

  // ---------- 画像クリックでモーダル展開 ----------
  // 画像を複製した後に処理を実行
  document.addEventListener('cloneSlideComplete', () => {
    const modal = document.querySelector('.photo__modal');
    const modalImage = document.querySelector('.photo__modal--img');
    const images = document.querySelectorAll('.slide');
    
    // 画像がクリックされたらモーダルで表示
    images.forEach((image) => {
      image.addEventListener('click', () => {
        modal.classList.add('showModal');
        
        const imageSrc = image.getAttribute('data-src');
        modalImage.src = imageSrc;
      });
    });
  
  
    // 画像以外の部分をクリックしたらモーダルを閉じる
    modal.addEventListener('click', () => {
      if (modal.classList.contains('showModal')) {
        modal.classList.remove('showModal');
        modalImage.src = '';
      }
    });
  })

}