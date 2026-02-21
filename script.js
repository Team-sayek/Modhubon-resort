/**
 * Madhubon Resort - Custom JavaScript
 * Enhanced interactivity and animations
 */

// Page Loader
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Smooth Scroll for section/anchor links (#section or index.html#section)
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const hash = href.split('#')[1];
        if (hash) {
            const target = document.getElementById(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                history.pushState(null, null, '#' + hash);
                // Close mobile menu after section scroll
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-slider');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Image Lazy Loading Enhancement
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Form Validation Enhancement
const bookingForm = document.querySelector('form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Validate dates
        const checkin = new Date(data.checkin);
        const checkout = new Date(data.checkout);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkin < today) {
            alert('Check-in date cannot be in the past!');
            return;
        }

        if (checkout <= checkin) {
            alert('Check-out date must be after check-in date!');
            return;
        }

        // Show success message
        showNotification('Booking request submitted successfully! We will contact you soon.', 'success');
        this.reset();
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-8 z-50 px-6 py-4 rounded-lg shadow-2xl transform translate-x-full transition-transform duration-500 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} text-xl"></i>
            <span class="font-semibold">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Gallery Lightbox
document.querySelectorAll('.gallery-preview img, [data-gallery] img').forEach(img => {
    img.addEventListener('click', function() {
        createLightbox(this.src, this.alt);
    });
});

function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 cursor-pointer';
    lightbox.innerHTML = `
        <div class="relative max-w-7xl max-h-full">
            <img src="${src}" alt="${alt}" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl">
            <button class="absolute top-4 right-4 w-12 h-12 bg-white text-dark rounded-full hover:bg-accent transition">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
    `;

    document.body.appendChild(lightbox);

    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);

    // Close on click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.closest('button')) {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// Booking Date Picker Enhancement
const checkinInput = document.querySelector('input[name="checkin"]');
const checkoutInput = document.querySelector('input[name="checkout"]');

if (checkinInput && checkoutInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', today);

    // Update checkout min date when checkin changes
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        checkoutInput.setAttribute('min', checkinDate.toISOString().split('T')[0]);
    });
}

// Newsletter Subscription (if added)
function subscribeNewsletter(email) {
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    showNotification('Thank you for subscribing to our newsletter!', 'success');
}

// Scroll Progress Indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'fixed top-0 left-0 h-1 bg-accent z-50 transition-all duration-100';
scrollProgress.style.width = '0%';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Add hover effect to cards
document.querySelectorAll('[data-aos]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    }
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        }
    });
    
    // Initial navbar state
    window.addEventListener('load', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            }
        }
    });
});

// Hero Slider
let currentSlide = 0;
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    const totalSlides = slides.length;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('opacity-0');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.remove('opacity-0');
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000);
}

// Counter Animation
function initCounter() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const speed = 200;
    
    const runCounter = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };
    
    // Intersection Observer for counter animation
    const ctaSection = document.querySelector('.bg-fixed');
    if (ctaSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(ctaSection);
    }
}

// Lightbox Gallery Functionality
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (!lightbox || !lightboxImage) return;
    
    let currentImageIndex = 0;
    const totalImages = galleryImages.length;
    
    // Store image data
    const imageData = Array.from(galleryImages).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        lightboxImage.src = imageData[currentImageIndex].src;
        if (lightboxCaption) {
            lightboxCaption.textContent = imageData[currentImageIndex].alt;
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${totalImages}`;
        }
        
        // Add fade-in animation
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
        }, 50);
    }
    
    // Navigate to previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateLightboxImage();
    }
    
    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateLightboxImage();
    }
    
    // Event listeners for gallery images
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Event listeners for controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('flex')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
    
    // Add smooth transition to image
    lightboxImage.style.transition = 'opacity 0.3s ease';
}

// Testimonials Slider
function initTestimonialsSlider() {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (!testimonialSlider) return;
    
    let testimonialIndex = 0;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const totalTestimonials = testimonialSlides.length;
    
    if (totalTestimonials === 0) return;
    
    function updateTestimonialSlider() {
        const slideWidth = testimonialSlides[0].offsetWidth;
        testimonialSlider.style.transform = `translateX(-${testimonialIndex * slideWidth}px)`;
        
        // Update dots
        testimonialDots.forEach((dot, index) => {
            if (index === testimonialIndex) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-accent');
            } else {
                dot.classList.remove('bg-accent');
                dot.classList.add('bg-gray-300');
            }
        });
    }
    
    const nextBtn = document.getElementById('nextTestimonial');
    const prevBtn = document.getElementById('prevTestimonial');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (testimonialIndex < totalTestimonials - 1) {
                testimonialIndex++;
            } else {
                testimonialIndex = 0;
            }
            updateTestimonialSlider();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (testimonialIndex > 0) {
                testimonialIndex--;
            } else {
                testimonialIndex = totalTestimonials - 1;
            }
            updateTestimonialSlider();
        });
    }
    
    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            testimonialIndex = index;
            updateTestimonialSlider();
        });
    });
    
    // Auto-slide
    setInterval(() => {
        if (testimonialIndex < totalTestimonials - 1) {
            testimonialIndex++;
        } else {
            testimonialIndex = 0;
        }
        updateTestimonialSlider();
    }, 5000);
}

// Preloader and AOS Initialization
function initPreloaderAndAOS() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.add('hidden');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
    initCounter();
    initGalleryLightbox();
    initTestimonialsSlider();
    initPreloaderAndAOS();
    initScrollToTop();
});

// Console Art
console.log('%c🏨 Madhubon Resort', 'color: #D4AF37; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to luxury! 🌴', 'color: #2C5F2D; font-size: 16px;');
console.log('%cWebsite crafted with ❤️', 'color: #97BC62; font-size: 14px;');

// Performance Optimization - Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Your scroll handler code
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Contact Modal Functionality
function openContactModal() {
    // Only allow opening if explicitly permitted by a click handler
    if (!window._contact_open_allowed) return;
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // reset form and thank you
    const form = document.getElementById('contact-modal-form');
    const thank = document.getElementById('contact-thankyou');
    if (form) form.classList.remove('hidden');
    if (thank) thank.classList.add('hidden');
    if (form) form.reset();
    // disallow further opens until explicit click
    window._contact_open_allowed = false;
}

function setupContactModal() {
    // Only open modal when link explicitly has the data-open-contact attribute
    const openLinks = document.querySelectorAll('a[data-open-contact]');
    openLinks.forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            // permit opening only for this click
            window._contact_open_allowed = true;
            openContactModal();
        });
    });

    const modalClose = document.getElementById('contact-modal-close');
    const modalCancel = document.getElementById('contact-modal-cancel');
    const modal = document.getElementById('contact-modal');

    if (modalClose) modalClose.addEventListener('click', closeContactModal);
    if (modalCancel) modalCancel.addEventListener('click', closeContactModal);

    // close on overlay click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeContactModal();
        });
    }

    // form submit
    const form = document.getElementById('contact-modal-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const enquiry = document.getElementById('contact-enquiry').value.trim();

            if (!name || !phone || !enquiry) {
                showNotification('Please fill all fields', 'error');
                return;
            }

            // If EmailJS is configured, send using their client-side API
            const serviceID = window.EMAILJS_SERVICE_ID || '';
            const templateID = window.EMAILJS_TEMPLATE_ID || '';
            const publicKey = window.EMAILJS_PUBLIC_KEY || '';

            const sendWithEmailJS = serviceID && templateID && publicKey && publicKey !== 'YOUR_PUBLIC_KEY' && serviceID !== 'YOUR_SERVICE_ID' && templateID !== 'YOUR_TEMPLATE_ID';

            if (sendWithEmailJS && typeof emailjs !== 'undefined') {
                const templateParams = {
                    from_name: name,
                    phone: phone,
                    message: enquiry,
                    to_email: 'modhubonresort@gmail.com'
                };

                // Show interim thank-you view
                form.classList.add('hidden');
                const thank = document.getElementById('contact-thankyou');
                if (thank) thank.classList.remove('hidden');

                emailjs.send(serviceID, templateID, templateParams)
                    .then(() => {
                        showNotification('Enquiry sent. Thank you!', 'success');
                        setTimeout(closeContactModal, 2500);
                    })
                    .catch((err) => {
                        console.error('EmailJS error:', err);
                        showNotification('Failed to send via EmailJS. Opening mail client.', 'error');
                        // fallback to mailto
                        const to = 'modhubonresort@gmail.com';
                        const subject = `Website Enquiry from ${name}`;
                        const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0A%0D%0AEnquiry:%0D%0A${encodeURIComponent(enquiry)}`;
                        const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
                        window.location.href = mailto;
                        setTimeout(closeContactModal, 2500);
                    });
            } else {
                // fallback: open user's mail client with prefilled content
                const to = 'modhubonresort@gmail.com';
                const subject = `Website Enquiry from ${name}`;
                const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0A%0D%0AEnquiry:%0D%0A${encodeURIComponent(enquiry)}`;
                const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;

                form.classList.add('hidden');
                const thank = document.getElementById('contact-thankyou');
                if (thank) thank.classList.remove('hidden');
                showNotification('Submitting your enquiry via mail client.', 'success');
                window.location.href = mailto;
                setTimeout(() => { closeContactModal(); }, 3000);
            }
        });
    }
}

// initialize contact modal after DOM ready
document.addEventListener('DOMContentLoaded', function() {
    setupContactModal();
});

// Ensure modal is hidden on initial load (prevents showing on refresh)
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
});