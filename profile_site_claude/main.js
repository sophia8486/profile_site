
// ===================================
// Portfolio Animations - アクセシビリティ改善版
// ===================================

class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSmoothScroll();
        this.setupHeaderScroll();
        this.setupMobileMenu();
        this.setupCursorFollower();
        this.setupParticleBackground();
        this.setupWorkCardInteractions();
    }

    // スクロール連動アニメーション
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // カード要素の順次アニメーション
                    const cards = entry.target.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(30px)';
                            setTimeout(() => {
                                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // スムーススクロール
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // モバイルメニューを閉じる
                    if (window.innerWidth <= 768) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }

    // ヘッダースクロール効果
    setupHeaderScroll() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('header');
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ハンバーガーメニュー
    setupMobileMenu() {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-button';
        menuButton.setAttribute('aria-label', 'メニューを開く');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        header.appendChild(menuButton);

        menuButton.addEventListener('click', () => {
            const isOpen = nav.classList.contains('mobile-menu-open');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // ESCキーでメニューを閉じる（アクセシビリティ）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('mobile-menu-open')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const nav = document.querySelector('nav');
        const menuButton = document.querySelector('.mobile-menu-button');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        nav.classList.add('mobile-menu-open');
        menuButton.classList.add('active');
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'メニューを閉じる');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const nav = document.querySelector('nav');
        const menuButton = document.querySelector('.mobile-menu-button');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        nav.classList.remove('mobile-menu-open');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'メニューを開く');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Worksカードのインタラクション（クリック可能を明示）
    setupWorkCardInteractions() {
        const workCards = document.querySelectorAll('.work-card');
        
        workCards.forEach(card => {
            // マウスムーブで微細な3D効果
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // クリックイベント（実際のリンク先がない場合の処理）
            card.addEventListener('click', (e) => {
                // ここに実際のモーダル表示やページ遷移の処理を追加
                console.log('Work card clicked:', card.querySelector('.card-title').textContent);
            });
        });
    }

    // カーソルフォロワー
    setupCursorFollower() {
        if (window.innerWidth <= 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dotX = e.clientX;
            dotY = e.clientY;
        });

        const animateCursor = () => {
            const speed = 0.15;
            
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .card.interactive, .work-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            });
        });
    }

    // パーティクル背景
    setupParticleBackground() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.4 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(139, 115, 85, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const createParticles = () => {
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        createParticles();
        window.addEventListener('resize', createParticles);

        const connectParticles = () => {
            const maxDistance = 150;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.strokeStyle = `rgba(139, 115, 85, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnimations();
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
