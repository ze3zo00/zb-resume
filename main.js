/**
 * Interactive Resume - Main JavaScript
 * Version: 3.0
 * Features: Scroll animations, tab switching, theme changing, intersection observers
 */

// ===================================
// Configuration
// ===================================

const CONFIG = {
    animationDuration: 600,
    scrollThreshold: 0.1,
    scrollRootMargin: '0px 0px -100px 0px',
    themes: ['blue', 'green', 'gold', 'coral'],
    defaultTheme: 'blue'
};

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit rate of function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get current theme from localStorage or default
 */
function getCurrentTheme() {
    return localStorage.getItem('resume-theme') || CONFIG.defaultTheme;
}

/**
 * Save theme to localStorage
 */
function saveTheme(theme) {
    localStorage.setItem('resume-theme', theme);
}

/**
 * Get current mode (dark/light) from localStorage or default
 */
function getCurrentMode() {
    return localStorage.getItem('resume-mode') || 'dark';
}

/**
 * Save mode to localStorage
 */
function saveMode(mode) {
    localStorage.setItem('resume-mode', mode);
}

/**
 * Apply dark/light mode
 */
function applyMode(mode) {
    if (mode === 'light') {
        document.body.setAttribute('data-mode', 'light');
    } else {
        document.body.removeAttribute('data-mode');
    }
}

// ===================================
// Scroll Progress Bar
// ===================================

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    const updateScrollProgress = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', debounce(updateScrollProgress, 10));
    updateScrollProgress(); // Initial call
}

// ===================================
// Tab Switching
// ===================================

function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length || !tabContents.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active state from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('bg-accent-blue', 'text-white');
                btn.classList.add('text-white/60');
                btn.setAttribute('aria-selected', 'false');
            });

            // Add active state to clicked button
            button.classList.add('bg-accent-blue', 'text-white');
            button.classList.remove('text-white/60');
            button.setAttribute('aria-selected', 'true');

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Show selected tab content
            const activePanel = document.getElementById(tabName + '-panel');
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
}

// ===================================
// Theme Switcher
// ===================================

function initThemeSwitcher() {
    // Create theme switcher UI
    createThemeSwitcherUI();

    // Apply saved theme and mode on load
    const savedTheme = getCurrentTheme();
    const savedMode = getCurrentMode();
    applyTheme(savedTheme);
    applyMode(savedMode);
}

function createThemeSwitcherUI() {
    const nav = document.querySelector('nav > div');
    if (!nav) return;

    // Create theme button
    const themeButton = document.createElement('button');
    themeButton.id = 'themeToggle';
    themeButton.className = 'flex flex-col items-center gap-1 text-white/60 hover:text-accent-blue transition-colors duration-300';
    themeButton.setAttribute('aria-label', 'Change color theme');
    themeButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span class="text-xs font-medium">Theme</span>
    `;

    // Create theme menu
    const themeMenu = document.createElement('div');
    themeMenu.id = 'themeMenu';
    themeMenu.className = 'hidden fixed top-16 right-6 glass-card rounded-2xl p-4 z-50';
    themeMenu.innerHTML = `
        <p class="text-sm font-semibold mb-3 text-white/80">Mode</p>
        <div class="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-white/10">
            <button data-mode="dark" class="mode-option p-3 rounded-lg border-2 border-transparent hover:border-accent-blue transition-all duration-300" aria-label="Dark mode">
                <div class="w-full h-8 rounded bg-gradient-to-r from-gray-900 to-black mb-2 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </div>
                <p class="text-xs font-semibold">Dark</p>
            </button>
            <button data-mode="light" class="mode-option p-3 rounded-lg border-2 border-transparent hover:border-accent-blue transition-all duration-300" aria-label="Light mode">
                <div class="w-full h-8 rounded bg-gradient-to-r from-gray-100 to-white mb-2 flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <p class="text-xs font-semibold">Light</p>
            </button>
        </div>
        <p class="text-sm font-semibold mb-3 text-white/80">Choose Theme</p>
        <div class="grid grid-cols-2 gap-3">
            <button data-theme="blue" class="theme-option p-3 rounded-lg border-2 border-transparent hover:border-accent-blue transition-all duration-300" aria-label="Electric blue theme">
                <div class="w-full h-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 mb-2"></div>
                <p class="text-xs font-semibold">Electric Blue</p>
            </button>
            <button data-theme="green" class="theme-option p-3 rounded-lg border-2 border-transparent hover:border-accent-green transition-all duration-300" aria-label="Emerald green theme">
                <div class="w-full h-8 rounded bg-gradient-to-r from-green-500 to-emerald-500 mb-2"></div>
                <p class="text-xs font-semibold">Emerald</p>
            </button>
            <button data-theme="gold" class="theme-option p-3 rounded-lg border-2 border-transparent hover:border-accent-gold transition-all duration-300" aria-label="Gold theme">
                <div class="w-full h-8 rounded bg-gradient-to-r from-yellow-500 to-amber-500 mb-2"></div>
                <p class="text-xs font-semibold">Gold</p>
            </button>
            <button data-theme="coral" class="theme-option p-3 rounded-lg border-2 border-transparent hover:border-accent-coral transition-all duration-300" aria-label="Coral theme">
                <div class="w-full h-8 rounded bg-gradient-to-r from-red-400 to-pink-500 mb-2"></div>
                <p class="text-xs font-semibold">Coral</p>
            </button>
        </div>
    `;

    nav.appendChild(themeButton);
    document.body.appendChild(themeMenu);

    // Toggle menu
    themeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeMenu.contains(e.target) && e.target !== themeButton) {
            themeMenu.classList.add('hidden');
        }
    });

    // Mode selection
    const modeOptions = themeMenu.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.getAttribute('data-mode');
            applyMode(mode);
            saveMode(mode);

            // Show feedback
            showNotification(`${mode === 'dark' ? 'Dark' : 'Light'} mode activated`);
        });
    });

    // Theme selection
    const themeOptions = themeMenu.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyTheme(theme);
            saveTheme(theme);
            themeMenu.classList.add('hidden');

            // Show feedback
            showNotification(`Theme changed to ${option.querySelector('p').textContent}`);
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update accent colors in Tailwind classes
    const accentMap = {
        'blue': '#0066FF',
        'green': '#00D98B',
        'gold': '#FFB800',
        'coral': '#FF6B6B'
    };

    // Update CSS custom property
    document.documentElement.style.setProperty('--accent-primary', accentMap[theme]);
}

// ===================================
// Intersection Observer for Animations
// ===================================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: CONFIG.scrollThreshold,
        rootMargin: CONFIG.scrollRootMargin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe timeline items
    const timelineItems = document.querySelectorAll('article');
    timelineItems.forEach(article => {
        article.classList.add('timeline-item');
        article.style.opacity = '0';
        article.style.transform = 'translateY(30px)';
        article.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
        observer.observe(article);
    });

    // Observe other animated elements
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Smooth Scrolling
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignore if it's just "#"
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                // For top/profile section, scroll to top (0)
                // For experience and clone sections, account for section padding to show heading at top
                // For other sections, offset by 80px for nav
                let offsetTop;
                if (href === '#top' || href === '#profile') {
                    offsetTop = 0;
                } else if (href === '#experience') {
                    // Experience section has py-24 (96px top padding), need larger offset
                    offsetTop = target.offsetTop - 100;
                } else if (href === '#clone') {
                    // Clone section has py-20 (80px top padding), adjust accordingly
                    offsetTop = target.offsetTop - 100;
                } else {
                    offsetTop = target.offsetTop - 80;
                }

                // Use requestAnimationFrame to ensure scroll happens after event processing
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                });

                // Update URL without jumping
                history.pushState(null, null, href);

                // Update focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

// ===================================
// Active Navigation Link
// ===================================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const highlightNavigation = () => {
        const scrollY = window.pageYOffset;

        // Check if we're at the bottom of the page
        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;

        // If at bottom, highlight the last section (Clone)
        if (isAtBottom) {
            navLinks.forEach(link => {
                link.classList.remove('text-accent-blue');
                link.classList.add('text-white/60');

                // Highlight the Clone link
                if (link.getAttribute('href') === '#clone') {
                    link.classList.add('text-accent-blue');
                    link.classList.remove('text-white/60');
                }
            });
            return;
        }

        // Otherwise, use normal section detection
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-accent-blue');
                    link.classList.add('text-white/60');

                    const linkHref = link.getAttribute('href');
                    // Highlight #top link when on profile section
                    if (linkHref === `#${sectionId}` || (sectionId === 'profile' && linkHref === '#top')) {
                        link.classList.add('text-accent-blue');
                        link.classList.remove('text-white/60');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', debounce(highlightNavigation, 100));
    highlightNavigation(); // Call once on init to set correct state
}

// ===================================
// Notification System
// ===================================

function showNotification(message, duration = 3000) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification fixed bottom-8 right-8 glass-card px-6 py-4 rounded-lg z-50 animate-fade-in';
    notification.innerHTML = `
        <p class="text-white font-semibold">${message}</p>
    `;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ===================================
// Keyboard Navigation
// ===================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes theme menu
        if (e.key === 'Escape') {
            const themeMenu = document.getElementById('themeMenu');
            if (themeMenu && !themeMenu.classList.contains('hidden')) {
                themeMenu.classList.add('hidden');
            }
        }

        // Arrow keys for tab navigation
        if (e.target.classList.contains('tab-button')) {
            const tabs = Array.from(document.querySelectorAll('.tab-button'));
            const currentIndex = tabs.indexOf(e.target);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabs.length;
                tabs[nextIndex].click();
                tabs[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                tabs[prevIndex].click();
                tabs[prevIndex].focus();
            }
        }
    });
}

// ===================================
// Performance Monitoring
// ===================================

function logPerformance() {
    if (!window.performance) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('Performance Metrics:');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Connection Time: ${connectTime}ms`);
            console.log(`Render Time: ${renderTime}ms`);

            // Check if page load is under 3 seconds (target from spec)
            if (pageLoadTime > 3000) {
                console.warn('Page load time exceeds 3 second target');
            }
        }, 0);
    });
}

// ===================================
// Lazy Loading Images
// ===================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// Download Resume Tracking
// ===================================

function initDownloadTracking() {
    const downloadButtons = document.querySelectorAll('a[download]');

    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Resume downloaded');
            showNotification('Resume download started');

            // Track analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'Resume',
                    'event_label': 'PDF Download'
                });
            }
        });
    });
}

// ===================================
// Template Banner
// ===================================

function initTemplateBanner() {
    const banner = document.getElementById('templateBanner');
    const closeButton = document.getElementById('closeBanner');

    if (!banner || !closeButton) return;

    // Check if banner was previously closed
    const bannerClosed = sessionStorage.getItem('templateBannerClosed');

    if (bannerClosed === 'true') {
        banner.style.transform = 'translateY(-100%)';
        banner.style.display = 'none';
        return;
    }

    // Close banner on button click
    closeButton.addEventListener('click', () => {
        banner.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
        sessionStorage.setItem('templateBannerClosed', 'true');
    });

    // Adjust page padding when banner is visible
    if (banner.offsetHeight > 0) {
        document.body.style.paddingTop = `${banner.offsetHeight}px`;
    }
}

// ===================================
// Initialization
// ===================================

function init() {
    console.log('Interactive Resume - Initializing...');

    // Core functionality
    initScrollProgress();
    initTabSwitching();
    initThemeSwitcher();
    initIntersectionObserver();
    initSmoothScroll();
    initActiveNavigation();
    initKeyboardNavigation();
    initLazyLoading();
    initDownloadTracking();
    initTemplateBanner();

    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }

    console.log('Interactive Resume - Ready!');
}

// ===================================
// DOM Ready
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Export for testing (if needed)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        applyTheme,
        showNotification
    };
}
