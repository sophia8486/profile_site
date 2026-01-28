/**
 * main.js
 * - Intersection Observer for scroll animations
 * - Smooth scrolling
 * - Mobile menu toggle
 * - Interactive Cursor Stalker (XR/Tech vibe)
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initSmoothScroll();
    initMobileMenu();
    initCursorStalker();
});

/* -------------------------------------------------------
   1. スクロール連動アニメーション (Intersection Observer)
   ------------------------------------------------------- */
function initScrollAnimations() {
    // 監視対象の要素を取得（セクションのタイトルやカードなどにクラスを付ける想定）
    // HTML側でアニメーションさせたい要素に class="fade-in-trigger" を追加してください
    const targets = document.querySelectorAll('.fade-in-trigger, section h2, .project-card, .skill-category');

    // 監視のオプション（画面の15%が入ったら発火）
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったらクラスを付与
                entry.target.classList.add('is-visible');
                // 一度表示したら監視を解除（パフォーマンス考慮）
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 各要素に初期クラスを付与して監視開始
    targets.forEach(target => {
        target.classList.add('fade-in-trigger'); // 強制的にクラス付与（HTMLでの記述漏れ防止）
        observer.observe(target);
    });
}

/* -------------------------------------------------------
   2. スムーススクロール
   ------------------------------------------------------- */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = targetId === '#' ? document.body : document.querySelector(targetId);

            if (targetElement) {
                // ヘッダー固定分のオフセット（必要に応じて数値を調整）
                const headerOffset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // モバイルメニューが開いていたら閉じる
                const navMenu = document.querySelector('.nav-menu'); // HTMLのクラス名に合わせて変更
                const hamburger = document.querySelector('.hamburger'); // HTMLのクラス名に合わせて変更
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        });
    });
}

/* -------------------------------------------------------
   3. ハンバーガーメニューの開閉
   ------------------------------------------------------- */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger'); // ハンバーガーボタン
    const navMenu = document.querySelector('.nav-links'); // ナビゲーションのリスト

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // アクセシビリティ対応（aria-expandedの切り替え）
            const isActive = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });
    }
}

/* -------------------------------------------------------
   4. インタラクティブな演出：慣性マウスストーカー
      Unity/XR開発者らしい「物理挙動」を感じさせる演出
   ------------------------------------------------------- */
function initCursorStalker() {
    // タッチデバイスでは実行しない
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // ストーカー要素を動的に生成
    const stalker = document.createElement('div');
    stalker.classList.add('cursor-stalker');
    document.body.appendChild(stalker);

    // マウス位置とストーカー位置の管理変数
    let mouseX = 0, mouseY = 0;
    let stalkerX = 0, stalkerY = 0;

    // マウスの動きを監視
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // アニメーションループ (requestAnimationFrame)
    function animate() {
        // 慣性処理 (Lerp: Linear Interpolation)
        // 現在位置に (目標位置 - 現在位置) * 係数 を足すことで、徐々に近づく動きを作る
        // 0.1 という数値を小さくすると遅延が大きくなり、大きくするとキビキビ動く
        stalkerX += (mouseX - stalkerX) * 0.1;
        stalkerY += (mouseY - stalkerY) * 0.1;

        // 座標を更新
        stalker.style.transform = `translate(${stalkerX}px, ${stalkerY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animate);
    }
    animate();

    // リンクホバー時のエフェクト
    const linkElements = document.querySelectorAll('a, button, .project-card');
    linkElements.forEach(link => {
        link.addEventListener('mouseenter', () => {
            stalker.classList.add('is-hovering');
        });
        link.addEventListener('mouseleave', () => {
            stalker.classList.remove('is-hovering');
        });
    });
}