document.addEventListener("DOMContentLoaded", function() {
    const bgMusic = document.getElementById('bg-music');
    const btnOpen = document.getElementById('btn-open');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-control-btn');
    const musicDisc = musicBtn.querySelector('i');
    const musicWaveSpans = musicBtn.querySelectorAll('.music-wave span');
    
    let isMusicPlaying = false;

    // --- 1. HANDLING OPEN COVER ---
    btnOpen.addEventListener('click', function() {
        cover.style.transform = 'translateY(-100%)';
        cover.style.opacity = '0';
        
        mainContent.classList.remove('lock-scroll');
        mainContent.classList.add('unlock-scroll');
        
        playAudio();

        setTimeout(() => {
            cover.style.display = 'none';
        }, 1200);
    });

    // --- 2. AUDIO CONTROLLER ---
    function playAudio() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicDisc.classList.add('disc-spinning');
            musicWaveSpans.forEach(span => span.style.display = 'block');
        }).catch(err => {
            console.log("Autoplay blocked by browser policy.");
        });
    }

    function pauseAudio() {
        bgMusic.pause();
        isMusicPlaying = false;
        musicDisc.classList.remove('disc-spinning');
        musicWaveSpans.forEach(span => span.style.display = 'none');
    }

    musicBtn.addEventListener('click', function() {
        if (isMusicPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // --- 3. SCROLL REVEAL (Intersection Observer API) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 4. COUNTDOWN TIMER ---
    const targetDate = new Date("Dec 22, 2026 08:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(countdownInterval);
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d < 10 ? '0' + d : d;
        document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // --- 5. INTERACTIVE LIGHTBOX GALLERY SYSTEM ---
    const galleryCells = document.querySelectorAll('.gallery-cell');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let activeImageIndex = 0;
    const imagesList = [];

    // Mengumpulkan seluruh link gambar dari grid galeri asli
    galleryCells.forEach((cell) => {
        const imgTag = cell.querySelector('img');
        imagesList.push(imgTag.src);
        
        // Membuka Lightbox saat gambar diklik
        cell.addEventListener('click', function() {
            activeImageIndex = parseInt(this.getAttribute('data-index'));
            openLightbox(activeImageIndex);
        });
    });

    function openLightbox(index) {
        lightbox.style.display = 'flex';
        lightboxImg.src = imagesList[index];
        document.body.style.overflow = 'hidden'; // Mengunci scroll body luar saat fokus melihat album
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        if(mainContent.classList.contains('unlock-scroll')) {
            document.body.style.overflow = 'auto';
        }
    }

    function showNextImage() {
        activeImageIndex = (activeImageIndex + 1) % imagesList.length;
        lightboxImg.src = imagesList[activeImageIndex];
    }

    function showPrevImage() {
        activeImageIndex = (activeImageIndex - 1 + imagesList.length) % imagesList.length;
        lightboxImg.src = imagesList[activeImageIndex];
    }

    // Event Listener Navigasi Album
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Menutup Lightbox jika area background kosong di klik
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Menambahkan navigasi keyboard (Kiri, Kanan, Escape)
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });


    // --- 6. FORM UCAPAN & REAL-TIME INJECTION ---
    const formUcapan = document.getElementById('form-ucapan');
    const feedUcapan = document.getElementById('feed-ucapan');

    formUcapan.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('input-nama').value.trim();
        const pesan = document.getElementById('input-pesan').value.trim();

        if (nama && pesan) {
            const initialLetter = nama.charAt(0).toUpperCase();
            
            const newItem = document.createElement('div');
            newItem.className = 'feed-item';
            newItem.style.opacity = '0';
            newItem.style.transform = 'translateY(20px)';
            newItem.style.transition = 'all 0.5s ease';
            
            newItem.innerHTML = `
                <div class="feed-avatar">${escapeHtml(initialLetter)}</div>
                <div class="feed-body">
                    <h5>${escapeHtml(nama)}</h5>
                    <p>${escapeHtml(pesan)}</p>
                </div>
            `;
            
            feedUcapan.insertBefore(newItem, feedUcapan.firstChild);
            
            setTimeout(() => {
                newItem.style.opacity = '1';
                newItem.style.transform = 'translateY(0)';
            }, 50);

            formUcapan.reset();
        }
    });

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- 7. SCROLLSPY DETECTOR UNTUK MENU NAVIGASI HP ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 250) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-nav');
            }
        });
    });
});