// ===== Supabase Init =====
const SUPABASE_URL = 'https://xybqetoutxmrpzrreyuf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnFldG91dHhtcnB6cnJleXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjMxNzIsImV4cCI6MjA4NzQ5OTE3Mn0.EmWmOTDEUdP_3sZ9pvYNRNyE2rCOmLfO3kZHExkjzXg';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Global Variables =====
let map;
let marker;
let selectedLocation = null;
let uploadedImages = []; // Array for multiple images
let logoImage = null; // Preloaded logo for original style
let gpsLogoImage = null; // Preloaded logo for GPS Map Camera style
let indonesiaFlagImage = null; // Indonesia flag SVG
let selectedStyle = 'original'; // 'original' or 'gps-camera'
let currentUserName = ''; // Current logged-in user name

// ===== Location Data (Tanah Bumbu) =====
const locationData = {
    'Batulicin': ['Batulicin', 'Gunung Tinggi', 'Segumbang', 'Kersik Putih', 'Maju Makmur', 'Maju Bersama', 'Sukamaju', 'Polewali Marajae', 'Danau Indah'],
    'Kusan Hilir': ['Kota Pagatan', 'Betung', 'Sungai Lembu', 'Wirittasi', 'Pejala', 'Pagarruyung', 'Muara Pagatan Tengah', 'Kampung Baru', 'Pasar Baru', 'Batuah', 'Barugelang', 'Pulau Salak', 'Mudalang', 'Tanette', 'Muara Pagatan', 'Pulau Satu', 'Juku Eja', 'Gusunge', 'Rantau Panjang Hulu', 'Penyelongan', 'Beringin', 'Rantau Panjang Hilir'],
    'Sungai Loban': ['Sari Mulya', 'Sungai Loban', 'Sebamban Lama', 'Sebamban Baru', 'Sungai Dua Laut', 'Marga Mulya', 'Sari Utama', 'Tri Mulya', 'Dwi Marga Utama', 'Kerta Buwana', 'Batu Meranti', 'Tri Martani', 'Sumber Makmur', 'Biduri Bersujud', 'Sumber Sari', 'Wanasari', 'Damar Indah'],
    'Satui': ['Setarap', 'Satui Timur', 'Sungai Cuka', 'Jombang', 'Satui Barat', 'Sekapuk', 'Sungai Danau', 'Wonorejo', 'Sumber Makmur', 'Tegal Sari', 'Sumber Arum', 'Sejahtera Mulia', 'Al-Kautsar', 'Makmur Mulia', 'Sinar Bulan', 'Pendamaran Jaya', 'Sido Rejo', 'Beruntung Jaya', 'Barakat Mufakat', 'Makmur Jaya'],
    'Kusan Hulu': ['Lasung', 'Manuntung', 'Anjir Baru', 'Binawara', 'Pacakan', 'Sungai Rukam', 'Bakaranagan', 'Karang Mulya', 'Harapan Jaya', 'Wonorejo', 'Karang Sari'],
    'Simpang Empat': ['Kampung Baru', 'Tungkaran Pangeran', 'Sarigadung', 'Mekar Sari', 'Sungai Dua', 'Batu Ampar', 'Gunungbesar', 'Pulau Burung', 'Baroqah', 'Bersujud', 'Sejahtera', 'Gunung Antasari', 'Hidayah Makmur', 'Plajau Mulia', 'Kupang Berkah Jaya'],
    'Karang Bintang': ['Karang Bintang', 'Pandan Sari', 'Rejowinangun', 'Selaselilau', 'Pematang Ulin', 'Batulicin Irigasi', 'Manunggal', 'Sumber Wangi', 'Madu Retno', 'Maju Sejahtera', 'Karang Rejo', 'Karang Nunggal'],
    'Mantewe': ['Mantewe', 'Dukuh Rejo', 'Rejosari', 'Sukadamai', 'Bulurejo', 'Sidomulyo', 'Sepakat', 'Sari Mulya', 'Emil Baru', 'Mentawakan Mulia', 'Maju Mulyo', 'Gunung Raya'],
    'Angsana': ['Bunati', 'Purwodadi', 'Sumber Baru', 'Karang Indah', 'Angsana', 'Banjarsari', 'Bayansari', 'Makmur', 'Mekar Jaya'],
    'Kuranji': ['Giri Mulya', 'Kuranji', 'Waringin Tunggal', 'Mustika', 'Indraloka Jaya', 'Karang Intan', 'Ringkit'],
    'Kusan Tengah': ['Saring Sungai Bubu', 'Saring Sei Binjai', 'Sepunggur', 'Serdangan', 'Satiung', 'Api-Api', 'Pakatellu', 'Manurung', 'Batarang', 'Mekar Jaya', 'Pulau Tanjung', 'Upt. Karya Bakti', 'Salimuran'],
    'Teluk Kepayang': ['Teluk Kepayang', 'Guntung', 'Mangkalapi', 'Tibarau Panjang', 'Darasan Binjai', 'Tapus', "Hati'if", 'Batu Bulan', 'Tamunih', 'Dadap Kusan Raya']
};

// ===== DOM Elements =====
const photoInput = document.getElementById('photoInput');
const uploadArea = document.getElementById('uploadArea');
const photoThumbnails = document.getElementById('photoThumbnails');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const locationCoords = document.getElementById('locationCoords');
const roadInput = document.getElementById('roadInput');
const districtSelect = document.getElementById('districtSelect');
const villageSelect = document.getElementById('villageSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultsGrid = document.getElementById('resultsGrid');
const resultCount = document.getElementById('resultCount');


// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initUpload();
    initDateTime();
    initLocationDropdowns();
    initLightbox();
    initNameInput();
    initStyleSelection();
    initButtons();
    hidePreloader();
});



// ===== Preloader =====
function hidePreloader() {
    const preloader = document.getElementById('preloader');

    // Minimum display time for smooth effect
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Show name input screen directly
        document.getElementById('nameScreen').classList.add('active');
        document.getElementById('nameInput').focus();
    }, 1500);
}




// ===== Name Input =====
function initNameInput() {
    const nameScreen = document.getElementById('nameScreen');
    const nameInput = document.getElementById('nameInput');
    const nameError = document.getElementById('nameError');
    const btnContinue = document.getElementById('btnContinue');
    const btnShowHistory = document.getElementById('btnShowHistory');

    function proceed() {
        const name = nameInput.value.trim();
        if (!name || name.length < 6) {
            nameError.textContent = '❌ Nama tidak ditemukan';
            nameInput.focus();
            return;
        }
        currentUserName = name;
        nameError.textContent = '';
        nameScreen.classList.remove('active');
        document.getElementById('styleSelection').classList.add('active');
    }

    btnContinue.addEventListener('click', proceed);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') proceed();
    });

    btnShowHistory.addEventListener('click', () => {
        showHistoryModal();
    });

    // History modal close
    document.getElementById('historyClose').addEventListener('click', () => {
        document.getElementById('historyOverlay').classList.remove('active');
    });
    document.getElementById('historyOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('historyOverlay').classList.remove('active');
        }
    });
}

// ===== History Modal =====
async function showHistoryModal() {
    const overlay = document.getElementById('historyOverlay');
    const body = document.getElementById('historyBody');

    overlay.classList.add('active');
    body.innerHTML = '<p class="history-loading">⏳ Memuat riwayat...</p>';

    try {
        const { data, error } = await supabaseClient
            .from('usage_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        if (!data || data.length === 0) {
            body.innerHTML = '<div class="history-empty"><span>📭</span>Belum ada riwayat penggunaan</div>';
            return;
        }

        let html = `<table class="history-table">
            <thead><tr>
                <th>Nama</th>
                <th>Waktu</th>
                <th>Foto</th>
                <th></th>
            </tr></thead><tbody>`;

        data.forEach((row, idx) => {
            const date = new Date(row.created_at);
            const timeStr = date.toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const photoUrls = row.photo_urls || [];
            const photosHtml = photoUrls.map(url => {
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/stamped-photos/${url}`;
                return `<img src="${publicUrl}" alt="Stamped" loading="lazy" onclick="openHistoryPhoto('${publicUrl}')">`;
            }).join('');

            html += `<tr>
                <td class="user-name">${row.user_name}</td>
                <td>${timeStr}</td>
                <td><span class="photo-count">📸 ${row.photo_count} foto</span></td>
                <td>
                    ${photoUrls.length > 0 ? `<button class="history-photos-toggle" onclick="showPhotoPopup('${row.user_name}', ${idx})">👁 Lihat</button>` : '-'}
                </td>
            </tr>`;
        });

        // Store photo data globally for popup use
        window._historyPhotos = data.map(row => (row.photo_urls || []).map(url =>
            `${SUPABASE_URL}/storage/v1/object/public/stamped-photos/${url}`
        ));


        html += '</tbody></table>';
        body.innerHTML = html;

    } catch (err) {
        console.error('Failed to load history:', err);
        body.innerHTML = '<div class="history-empty"><span>⚠️</span>Gagal memuat riwayat.<br>Pastikan tabel dan bucket sudah dibuat di Supabase.</div>';
    }
}

function showPhotoPopup(userName, idx) {
    const urls = (window._historyPhotos && window._historyPhotos[idx]) || [];
    if (urls.length === 0) return;

    let currentPhotoIdx = 0;
    let zoomLevel = 1;

    const popup = document.createElement('div');
    popup.className = 'photo-popup-overlay';

    function render() {
        const url = urls[currentPhotoIdx];
        const navLeft = urls.length > 1 ? `<button class="photo-nav photo-nav-left" id="ppNavLeft">❮</button>` : '';
        const navRight = urls.length > 1 ? `<button class="photo-nav photo-nav-right" id="ppNavRight">❯</button>` : '';
        const counter = urls.length > 1 ? `<span class="photo-counter">${currentPhotoIdx + 1} / ${urls.length}</span>` : '';

        popup.innerHTML = `
            <div class="photo-popup" id="photoPopupBox">
                <button class="photo-popup-close" id="ppClose">✕</button>
                ${counter}
                <div class="photo-popup-viewer" id="ppViewer">
                    <img src="${url}" alt="Stamped" id="ppImage" draggable="false">
                </div>
                ${navLeft}
                ${navRight}
            </div>
        `;

        // Wait for image to load to adapt popup orientation
        const img = popup.querySelector('#ppImage');
        const box = popup.querySelector('#photoPopupBox');

        img.onload = () => {
            zoomLevel = 1;
            img.style.transform = `scale(1)`;
            if (img.naturalWidth > img.naturalHeight) {
                box.classList.remove('portrait');
                box.classList.add('landscape');
            } else {
                box.classList.remove('landscape');
                box.classList.add('portrait');
            }
        };

        // Close
        popup.querySelector('#ppClose').addEventListener('click', () => popup.remove());

        // Nav
        if (urls.length > 1) {
            popup.querySelector('#ppNavLeft').addEventListener('click', (e) => {
                e.stopPropagation();
                currentPhotoIdx = (currentPhotoIdx - 1 + urls.length) % urls.length;
                render();
            });
            popup.querySelector('#ppNavRight').addEventListener('click', (e) => {
                e.stopPropagation();
                currentPhotoIdx = (currentPhotoIdx + 1) % urls.length;
                render();
            });
        }

        // Zoom with scroll wheel
        const viewer = popup.querySelector('#ppViewer');
        viewer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomLevel = Math.min(zoomLevel + 0.2, 5);
            } else {
                zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
            }
            img.style.transform = `scale(${zoomLevel})`;
        });
    }

    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.remove();
    });

    // Keyboard nav
    const keyHandler = (e) => {
        if (!document.body.contains(popup)) {
            document.removeEventListener('keydown', keyHandler);
            return;
        }
        if (e.key === 'Escape') popup.remove();
        if (e.key === 'ArrowLeft' && urls.length > 1) { currentPhotoIdx = (currentPhotoIdx - 1 + urls.length) % urls.length; render(); }
        if (e.key === 'ArrowRight' && urls.length > 1) { currentPhotoIdx = (currentPhotoIdx + 1) % urls.length; render(); }
    };
    document.addEventListener('keydown', keyHandler);

    document.body.appendChild(popup);
    render();
}

function openHistoryPhoto(url) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = url;
    lightbox.classList.add('active');
}

// ===== Style Selection =====
function initStyleSelection() {
    const styleSelection = document.getElementById('styleSelection');
    const styleCards = document.querySelectorAll('.style-card');

    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedStyle = card.dataset.style;
            styleSelection.classList.remove('active');
        });
    });
}


// ===== Lightbox =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');

    // Close on button click
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}



// ===== Location Dropdowns =====
function initLocationDropdowns() {
    // Populate kecamatan dropdown
    Object.keys(locationData).forEach(kecamatan => {
        const option = document.createElement('option');
        option.value = kecamatan;
        option.textContent = kecamatan;
        districtSelect.appendChild(option);
    });

    // Handle kecamatan change
    // Auto capitalize each word for road name input
    roadInput.addEventListener('input', (e) => {
        const cursorPosition = e.target.selectionStart;
        const words = e.target.value.split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        e.target.value = capitalizedWords.join(' ');
        e.target.setSelectionRange(cursorPosition, cursorPosition);
    });

    // Handle kecamatan change
    districtSelect.addEventListener('change', () => {
        const selectedKecamatan = districtSelect.value;

        // Reset village dropdown
        villageSelect.innerHTML = '<option value="">-- Pilih Desa --</option>';

        if (selectedKecamatan && locationData[selectedKecamatan]) {
            villageSelect.disabled = false;
            locationData[selectedKecamatan].forEach(desa => {
                const option = document.createElement('option');
                option.value = desa;
                option.textContent = desa;
                villageSelect.appendChild(option);
            });
        } else {
            villageSelect.disabled = true;
            villageSelect.innerHTML = '<option value="">-- Pilih Kecamatan dulu --</option>';
        }
    });
}


// ===== Map Initialization =====
function initMap() {
    // Center on Indonesia
    map = L.map('map').setView([-2.5, 118], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Click handler
    map.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        // Remove existing marker
        if (marker) {
            map.removeLayer(marker);
        }

        // Add new marker
        marker = L.marker([lat, lng]).addTo(map);

        // Set location from map click
        setLocationFromMap(lat, lng);

        checkFormValidity();
    });
}

// ===== Set Location from Map Click =====
function setLocationFromMap(lat, lng) {
    selectedLocation = {
        lat: lat,
        lng: lng
    };

    // Display coordinates
    locationCoords.innerHTML = `
        <div class="coords-display">
            <span class="coords-icon">📍</span>
            <span class="coords-text">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
        </div>
    `;
}


// ===== Photo Upload =====
function initUpload() {
    uploadArea.addEventListener('click', () => photoInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleMultipleImages(files);
    });

    photoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleMultipleImages(files);
    });

    // Preload logo images
    logoImage = new Image();
    logoImage.src = 'stamped.png';

    gpsLogoImage = new Image();
    gpsLogoImage.src = 'logo_stamped.png';

    indonesiaFlagImage = new Image();
    indonesiaFlagImage.src = 'Indonesian.png';
}

function handleMultipleImages(files) {
    files.forEach(file => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                uploadedImages.push({
                    file: file,
                    image: img,
                    dataUrl: e.target.result
                });
                renderThumbnails();
                checkFormValidity();
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}

function renderThumbnails() {
    photoThumbnails.innerHTML = '';

    uploadedImages.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'thumbnail-item';
        div.innerHTML = `
            <img src="${item.dataUrl}" alt="Photo ${index + 1}">
            <button class="remove-btn" data-index="${index}">×</button>
        `;
        photoThumbnails.appendChild(div);
    });

    // Add remove handlers
    photoThumbnails.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            uploadedImages.splice(idx, 1);
            renderThumbnails();
            checkFormValidity();
        });
    });
}


// ===== Date & Time =====
function initDateTime() {
    const now = new Date();

    // Set default date
    dateInput.value = now.toISOString().split('T')[0];

    // Set default time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}:${seconds}`;

    dateInput.addEventListener('change', checkFormValidity);
    timeInput.addEventListener('change', checkFormValidity);
}

// ===== Form Validation =====
function checkFormValidity() {
    const isValid = uploadedImages.length > 0 &&
        selectedLocation &&
        dateInput.value &&
        timeInput.value;

    generateBtn.disabled = !isValid;
}

// ===== Buttons =====
function initButtons() {
    generateBtn.addEventListener('click', generateAllStampedPhotos);
}

// ===== Generate All Stamped Photos =====
async function generateAllStampedPhotos() {
    if (uploadedImages.length === 0 || !selectedLocation) return;

    generateBtn.textContent = '⏳ Generating...';
    generateBtn.disabled = true;

    // Clear previous results
    resultsGrid.innerHTML = '';

    // Collect canvases for Supabase upload
    const stampedCanvases = [];

    // Process each image
    for (let i = 0; i < uploadedImages.length; i++) {
        const item = uploadedImages[i];
        await generateSingleStamp(item, i);
    }

    // Collect all canvases from results grid
    const canvasElements = resultsGrid.querySelectorAll('canvas');

    // Update count and show results
    resultCount.textContent = uploadedImages.length;
    resultSection.classList.add('visible');
    resultSection.scrollIntoView({ behavior: 'smooth' });

    generateBtn.textContent = '📤 Menyimpan riwayat...';

    // Upload compressed photos to Supabase in background
    try {
        const photoUrls = [];
        const timestamp = Date.now();
        const safeName = currentUserName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);

        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];
            // Compress to small JPEG (quality 0.3 for storage efficiency)
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.3));
            if (!blob) continue;

            const filePath = `${safeName}_${timestamp}_${i}.jpg`;

            const { data, error } = await supabaseClient.storage
                .from('stamped-photos')
                .upload(filePath, blob, {
                    contentType: 'image/jpeg',
                    upsert: false
                });

            if (!error && data) {
                photoUrls.push(filePath);
            } else {
                console.warn('Upload photo failed:', error);
            }
        }

        // Insert usage log
        await supabaseClient.from('usage_logs').insert({
            user_name: currentUserName,
            photo_count: canvasElements.length,
            photo_urls: photoUrls
        });

        console.log('Usage log saved successfully');
    } catch (err) {
        console.error('Failed to save usage log:', err);
    }

    generateBtn.textContent = '🖼️ Generate Stamp';
    generateBtn.disabled = false;
}

// ===== Generate Single Stamp =====
async function generateSingleStamp(item, index) {
    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 50));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match image
    canvas.width = item.image.width;
    canvas.height = item.image.height;

    // Draw original image
    ctx.drawImage(item.image, 0, 0);

    // Calculate scale factor based on image size
    const scaleFactor = Math.min(canvas.width, canvas.height) / 800;

    // Generate random values once to share between compass and text
    const randomData = {
        degree: Math.floor(Math.random() * 360),
        altitude: (Math.random() * 90 + 10).toFixed(1),
        speed: (Math.random() * 5).toFixed(1)
    };

    // Route to appropriate stamp style
    if (selectedStyle === 'gps-camera') {
        // GPS Map Camera Style
        await drawSatelliteMap(ctx, canvas, scaleFactor);
        drawGPSInfoBox(ctx, canvas, scaleFactor, randomData);
    } else {
        // Original Style
        drawCompass(ctx, scaleFactor, randomData.degree);
        await drawMiniMap(ctx, canvas, scaleFactor);
        drawTextInfo(ctx, canvas, scaleFactor, randomData);
        drawLogo(ctx, canvas, scaleFactor);
    }

    // Create result item
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';

    const fileName = item.file.name.replace(/\.[^/.]+$/, '') + '_stamped.jpg';

    resultItem.innerHTML = `
        <button class="btn-download" data-filename="${fileName}">⬇️ Download</button>
    `;

    // Insert canvas before button
    resultItem.insertBefore(canvas, resultItem.firstChild);

    // Add download handler
    resultItem.querySelector('.btn-download').addEventListener('click', () => {
        try {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
        } catch (e) {
            alert('Tidak bisa download: Jalankan aplikasi melalui local server (bukan file://).\n\nGunakan Live Server extension di VS Code atau jalankan: npx serve');
            console.error('Canvas export error:', e);
        }
    });

    // Add lightbox click handler on canvas
    canvas.addEventListener('click', () => {
        try {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            lightboxImage.src = canvas.toDataURL('image/jpeg', 0.95);
            lightbox.classList.add('active');
        } catch (e) {
            console.error('Canvas preview error:', e);
        }
    });

    resultsGrid.appendChild(resultItem);
}


// ===== Draw Logo =====
function drawLogo(ctx, canvas, scale) {
    if (!logoImage || !logoImage.complete) return;

    const logoSize = 36 * scale; // Logo inside map
    const mapWidth = 305 * scale;
    const mapHeight = 235 * scale;
    const mapX = 25 * scale;  // Shifted right (was 10)
    const mapY = canvas.height - mapHeight - 25 * scale;  // Shifted up (was 10)

    // Position: inside mini map, bottom left corner with small padding
    const logoPadding = 5 * scale;
    const x = mapX + logoPadding;
    const y = mapY + mapHeight - logoSize - logoPadding;

    // Draw logo with aspect ratio maintained
    const aspectRatio = logoImage.width / logoImage.height;
    let drawWidth = logoSize * aspectRatio;
    let drawHeight = logoSize;

    ctx.drawImage(logoImage, x, y, drawWidth, drawHeight);
}




// ===== Draw Compass =====
function drawCompass(ctx, scale, degree) {
    const size = 196 * scale; // Compass size
    const x = 20 * scale + size / 2;
    const y = 20 * scale + size / 2;
    const radius = size / 2;

    ctx.save();
    ctx.globalAlpha = 0.85; // 85% opacity

    // Outer circle (dark with transparency)
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(50, 50, 50, 0.7)';
    ctx.fill();

    // Circle border
    ctx.beginPath();
    ctx.arc(x, y, radius - 2 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();

    // Direction letters
    ctx.font = `bold ${16 * scale}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // N, S, E, W positions
    ctx.fillText('N', x, y - radius + 20 * scale);
    ctx.fillText('S', x, y + radius - 20 * scale);
    ctx.fillText('E', x + radius - 20 * scale, y);
    ctx.fillText('W', x - radius + 20 * scale, y);

    // Compass needle - rotated based on degree
    const needleLength = radius * 0.55;
    const rotation = (degree * Math.PI) / 180; // Convert degree to radians

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // North pointer (cyan/blue)
    ctx.beginPath();
    ctx.moveTo(0, -needleLength);
    ctx.lineTo(-10 * scale, 0);
    ctx.lineTo(10 * scale, 0);
    ctx.closePath();
    ctx.fillStyle = '#00bcd4';
    ctx.fill();

    // South pointer (dark)
    ctx.beginPath();
    ctx.moveTo(0, needleLength);
    ctx.lineTo(-10 * scale, 0);
    ctx.lineTo(10 * scale, 0);
    ctx.closePath();
    ctx.fillStyle = '#37474f';
    ctx.fill();

    ctx.restore();

    // Center circle
    ctx.beginPath();
    ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.restore();
}


// ===== Draw Mini Map =====
async function drawMiniMap(ctx, canvas, scale) {
    const mapWidth = 305 * scale;
    const mapHeight = 235 * scale;
    const x = 25 * scale;  // Shifted right (was 10)
    const y = canvas.height - mapHeight - 25 * scale;  // Shifted up (was 10)

    const lat = selectedLocation.lat;
    const lng = selectedLocation.lng;

    // Try zoom 19 first, fallback to 18 if tiles fail
    let zoom = 19;
    let success = await tryDrawMapTiles(ctx, x, y, mapWidth, mapHeight, lat, lng, zoom, scale);

    if (!success) {
        console.log('Zoom 19 failed, falling back to zoom 18');
        zoom = 18;
        success = await tryDrawMapTiles(ctx, x, y, mapWidth, mapHeight, lat, lng, zoom, scale);
    }

    if (!success) {
        drawFallbackMap(ctx, x, y, mapWidth, mapHeight, scale);
    }
}

// Try to draw map tiles at specific zoom level
async function tryDrawMapTiles(ctx, x, y, mapWidth, mapHeight, lat, lng, zoom, scale) {
    try {
        // Create an offscreen canvas for the map
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = Math.round(mapWidth);
        mapCanvas.height = Math.round(mapHeight);
        const mapCtx = mapCanvas.getContext('2d');

        // Calculate tile coordinates with scale factor for consistent zoom
        const baseTileSize = 256;
        const tileSize = baseTileSize * scale * 0.2;  // Reduced zoom (0.2x)

        // Get the exact tile coordinates (with fractions)
        const exactTileX = lonToTile(lng, zoom);
        const exactTileY = latToTile(lat, zoom);

        // Integer tile coordinates
        const centerTileX = Math.floor(exactTileX);
        const centerTileY = Math.floor(exactTileY);

        // Pixel offset within the center tile (where the marker should be)
        const offsetX = (exactTileX - centerTileX) * tileSize;
        const offsetY = (exactTileY - centerTileY) * tileSize;

        // Calculate where to place the center tile so the marker ends up in the middle
        const centerTilePosX = mapWidth / 2 - offsetX;
        const centerTilePosY = mapHeight / 2 - offsetY;

        // How many tiles we need on each side
        const tilesLeft = Math.ceil(centerTilePosX / tileSize) + 1;
        const tilesRight = Math.ceil((mapWidth - centerTilePosX) / tileSize) + 1;
        const tilesTop = Math.ceil(centerTilePosY / tileSize) + 1;
        const tilesBottom = Math.ceil((mapHeight - centerTilePosY) / tileSize) + 1;

        // Load and draw tiles
        let failedTiles = 0;
        let totalTiles = 0;
        const tilePromises = [];

        for (let ty = -tilesTop; ty < tilesBottom; ty++) {
            for (let tx = -tilesLeft; tx < tilesRight; tx++) {
                const tileX = centerTileX + tx;
                const tileY = centerTileY + ty;

                // Calculate position on map canvas
                const posX = centerTilePosX + tx * tileSize;
                const posY = centerTilePosY + ty * tileSize;

                // Skip if completely outside canvas
                if (posX + tileSize < 0 || posX > mapWidth ||
                    posY + tileSize < 0 || posY > mapHeight) {
                    continue;
                }

                totalTiles++;

                // Use multiple tile servers
                const servers = ['a', 'b', 'c'];
                const server = servers[Math.abs(tileX + tileY) % 3];
                const tileUrl = `https://${server}.tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

                tilePromises.push(
                    loadTileImage(tileUrl).then(img => {
                        mapCtx.drawImage(img, posX, posY, tileSize, tileSize);
                    }).catch(() => {
                        failedTiles++;
                        mapCtx.fillStyle = '#e0e0e0';
                        mapCtx.fillRect(posX, posY, tileSize, tileSize);
                    })
                );
            }
        }

        await Promise.all(tilePromises);

        // If more than 50% tiles failed, consider it a failure
        if (failedTiles > totalTiles * 0.5) {
            return false;
        }

        // Draw marker at center
        drawMapMarker(mapCtx, mapWidth / 2, mapHeight / 2, scale);

        // Draw the map canvas onto main canvas with rounded corners and opacity
        ctx.save();
        ctx.globalAlpha = 0.9; // 90% opacity
        roundedRect(ctx, x, y, mapWidth, mapHeight, 8 * scale);
        ctx.clip();
        ctx.drawImage(mapCanvas, x, y);
        ctx.restore();

        // Map border
        ctx.save();
        roundedRect(ctx, x, y, mapWidth, mapHeight, 8 * scale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
        ctx.restore();

        return true;

    } catch (error) {
        console.error('Failed to load map at zoom ' + zoom + ':', error);
        return false;
    }
}


// Convert longitude to tile X
function lonToTile(lon, zoom) {
    return ((lon + 180) / 360) * Math.pow(2, zoom);
}

// Convert latitude to tile Y
function latToTile(lat, zoom) {
    const latRad = lat * Math.PI / 180;
    return (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom);
}

// Load tile with timeout
function loadTileImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const timeout = setTimeout(() => {
            reject(new Error('Timeout'));
        }, 5000);

        img.onload = () => {
            clearTimeout(timeout);
            resolve(img);
        };
        img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to load'));
        };
        img.src = url;
    });
}

// Draw red marker pin
function drawMapMarker(ctx, x, y, scale) {
    const markerHeight = 30 * scale;  // Base size scaled
    const markerWidth = 20 * scale;   // Base size scaled

    ctx.save();

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Marker pin shape
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
        x - markerWidth / 2, y - markerHeight * 0.6,
        x - markerWidth / 2, y - markerHeight,
        x, y - markerHeight
    );
    ctx.bezierCurveTo(
        x + markerWidth / 2, y - markerHeight,
        x + markerWidth / 2, y - markerHeight * 0.6,
        x, y
    );
    ctx.closePath();

    // Red fill
    ctx.fillStyle = '#e53935';
    ctx.fill();

    // Dark red circle inside
    ctx.beginPath();
    ctx.arc(x, y - markerHeight * 0.65, markerWidth / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#8B0000';  // Dark red
    ctx.fill();

    ctx.restore();
}

// Fallback when map tiles fail
function drawFallbackMap(ctx, x, y, width, height, scale) {
    ctx.save();

    // Background
    roundedRect(ctx, x, y, width, height, 8 * scale);
    ctx.fillStyle = '#d4e5d4';
    ctx.fill();

    // Grid lines to simulate map
    ctx.strokeStyle = '#c0d4c0';
    ctx.lineWidth = 1;
    const gridSize = 20 * scale;

    for (let gx = x; gx < x + width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx, y + height);
        ctx.stroke();
    }
    for (let gy = y; gy < y + height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + width, gy);
        ctx.stroke();
    }

    // Draw marker at center
    drawMapMarker(ctx, x + width / 2, y + height / 2 + 15 * scale, scale);

    // Border
    roundedRect(ctx, x, y, width, height, 8 * scale);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    ctx.restore();
}


function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Rounded rect with selective corners: corners = {tl, tr, br, bl} (true = rounded, false = square)
function roundedRectSelective(ctx, x, y, width, height, radius, corners) {
    const tl = corners.tl ? radius : 0;
    const tr = corners.tr ? radius : 0;
    const br = corners.br ? radius : 0;
    const bl = corners.bl ? radius : 0;

    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + width - tr, y);
    if (tr) ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
    else ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height - br);
    if (br) ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
    else ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + bl, y + height);
    if (bl) ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
    else ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + tl);
    if (tl) ctx.quadraticCurveTo(x, y, x + tl, y);
    else ctx.lineTo(x, y);
    ctx.closePath();
}

// Wrap text to fit within maxWidth, returns array of lines
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}
function drawTextInfo(ctx, canvas, scale, randomData) {
    const padding = 20 * scale;
    const lineHeight = 34 * scale; // Line height +20%
    const fontSize = 26 * scale; // Font size +20%
    const x = canvas.width - padding;
    let y = canvas.height - padding;

    ctx.save();
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    // Add text shadow for readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4 * scale;
    ctx.shadowOffsetX = 1 * scale;
    ctx.shadowOffsetY = 1 * scale;

    // Build text lines (bottom to top, so we push in reverse order of display)
    const lines = [];

    // Speed (bottom-most)
    lines.push(`Speed:${randomData.speed}km/h`);

    // Altitude
    lines.push(`Altitude:${randomData.altitude}msnm`);

    // Province (hardcoded)
    lines.push('Provinsi Kalimantan Selatan');

    // Regency/Kabupaten (hardcoded)
    lines.push('Kabupaten Tanah Bumbu');


    // District/Kecamatan (from dropdown)
    if (districtSelect.value) {
        lines.push(`Kecamatan ${districtSelect.value}`);
    }

    // Village/Desa or Kelurahan (from dropdown)
    if (villageSelect.value) {
        // List of Kelurahan (the rest are Desa)
        const kelurahanList = ['Kota Pagatan', 'Kampung Baru', 'Tungkaran Pangeran'];
        const isKelurahan = kelurahanList.includes(villageSelect.value);
        const prefix = isKelurahan ? 'Kelurahan' : 'Desa';
        lines.push(`${prefix} ${villageSelect.value}`);
    }


    // Road (from manual input)
    if (roadInput.value.trim()) {
        lines.push(roadInput.value.trim());
    }

    // Compass direction (using shared random degree)
    const cardinalDir = getCardinalDirection(randomData.degree);
    lines.push(`${randomData.degree}° ${cardinalDir}`);

    // Coordinates
    if (selectedLocation) {
        lines.push(`${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`);
    }

    // Date & Time (top-most)
    const dateStr = formatDate(dateInput.value);
    const timeStr = timeInput.value;
    lines.push(`${dateStr} ${timeStr}`);


    // Draw lines from bottom to top
    lines.forEach((line, index) => {
        ctx.fillText(line, x, y - (index * lineHeight));
    });

    ctx.restore();
}



function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

// Get cardinal direction from degrees
function getCardinalDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}


// ===== Download Photo =====
function downloadPhoto() {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `geotag-photo-${timestamp}.jpg`;
    link.href = resultCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

// ===== GPS Map Camera Style Functions =====

// Draw Satellite Map using Esri World Imagery
async function drawSatelliteMap(ctx, canvas, scale) {
    const padding = 20 * scale;
    const mapSize = 200 * scale;
    const x = padding;
    const y = canvas.height - mapSize - padding;

    const lat = selectedLocation.lat;
    const lng = selectedLocation.lng;

    // Try satellite map with zoom 18
    let success = await tryDrawSatelliteTiles(ctx, x, y, mapSize, mapSize, lat, lng, 18, scale);

    if (!success) {
        // Fallback to zoom 17
        success = await tryDrawSatelliteTiles(ctx, x, y, mapSize, mapSize, lat, lng, 17, scale);
    }

    if (!success) {
        // Draw fallback
        drawFallbackSatellite(ctx, x, y, mapSize, mapSize, scale);
    }
}

// Try to draw satellite tiles from Esri
async function tryDrawSatelliteTiles(ctx, x, y, mapWidth, mapHeight, lat, lng, zoom, scale) {
    try {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = Math.round(mapWidth);
        mapCanvas.height = Math.round(mapHeight);
        const mapCtx = mapCanvas.getContext('2d');

        // Use scaled tile size to maintain consistent zoom level appearance
        const baseTileSize = 256;
        const tileSize = baseTileSize * scale * 0.5;  // Reduced zoom (0.4x)
        const exactTileX = lonToTile(lng, zoom);
        const exactTileY = latToTile(lat, zoom);
        const centerTileX = Math.floor(exactTileX);
        const centerTileY = Math.floor(exactTileY);
        const offsetX = (exactTileX - centerTileX) * tileSize;
        const offsetY = (exactTileY - centerTileY) * tileSize;
        const centerTilePosX = mapWidth / 2 - offsetX;
        const centerTilePosY = mapHeight / 2 - offsetY;

        const tilesLeft = Math.ceil(centerTilePosX / tileSize) + 1;
        const tilesRight = Math.ceil((mapWidth - centerTilePosX) / tileSize) + 1;
        const tilesTop = Math.ceil(centerTilePosY / tileSize) + 1;
        const tilesBottom = Math.ceil((mapHeight - centerTilePosY) / tileSize) + 1;

        let failedTiles = 0;
        let totalTiles = 0;
        const tilePromises = [];

        for (let ty = -tilesTop; ty < tilesBottom; ty++) {
            for (let tx = -tilesLeft; tx < tilesRight; tx++) {
                const tileX = centerTileX + tx;
                const tileY = centerTileY + ty;
                const posX = centerTilePosX + tx * tileSize;
                const posY = centerTilePosY + ty * tileSize;

                if (posX + tileSize < 0 || posX > mapWidth || posY + tileSize < 0 || posY > mapHeight) {
                    continue;
                }

                totalTiles++;

                // Use Esri World Imagery (free satellite tiles)
                const tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;

                tilePromises.push(
                    loadTileImage(tileUrl).then(img => {
                        mapCtx.drawImage(img, posX, posY, tileSize, tileSize);
                    }).catch(() => {
                        failedTiles++;
                        mapCtx.fillStyle = '#2d5a27';
                        mapCtx.fillRect(posX, posY, tileSize, tileSize);
                    })
                );
            }
        }

        await Promise.all(tilePromises);

        if (failedTiles > totalTiles * 0.5) {
            return false;
        }

        // Draw red marker
        drawMapMarker(mapCtx, mapWidth / 2, mapHeight / 2, scale);

        // Draw "Google" text in bottom left corner (similar to reference)
        mapCtx.save();
        mapCtx.font = `bold ${18 * scale}px Arial`;  // +30% (was 14)
        mapCtx.fillStyle = 'white';
        mapCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        mapCtx.shadowBlur = 2;
        mapCtx.fillText('Google', 8 * scale, mapHeight - 8 * scale);
        mapCtx.restore();

        // Draw the map onto main canvas with rounded corners
        ctx.save();
        ctx.globalAlpha = 0.95;
        roundedRect(ctx, x, y, mapWidth, mapHeight, 8 * scale);
        ctx.clip();
        ctx.drawImage(mapCanvas, x, y);
        ctx.restore();

        // Border
        ctx.save();
        roundedRect(ctx, x, y, mapWidth, mapHeight, 8 * scale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
        ctx.restore();

        return true;
    } catch (error) {
        console.error('Failed to load satellite map:', error);
        return false;
    }
}

// Fallback for satellite map
function drawFallbackSatellite(ctx, x, y, width, height, scale) {
    ctx.save();
    roundedRect(ctx, x, y, width, height, 8 * scale);
    ctx.fillStyle = '#2d5a27';
    ctx.fill();

    // Draw simple grid
    ctx.strokeStyle = 'rgba(0, 100, 0, 0.5)';
    ctx.lineWidth = 1;
    const gridSize = 15 * scale;
    for (let gx = x; gx < x + width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx, y + height);
        ctx.stroke();
    }
    for (let gy = y; gy < y + height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + width, gy);
        ctx.stroke();
    }

    drawMapMarker(ctx, x + width / 2, y + height / 2 + 10 * scale, scale);

    ctx.restore();
}

// Draw GPS Info Box (dark info box on the right) - matches reference layout
function drawGPSInfoBox(ctx, canvas, scale, randomData) {
    const padding = 20 * scale;

    // Map dimensions (already drawn by drawSatelliteMap)
    const mapSize = 200 * scale;

    // Info box positioned to the right of the map (increased gap)
    const infoBoxX = padding + mapSize + 20 * scale;  // Was 10
    const infoBoxWidth = canvas.width - infoBoxX - padding;
    const infoBoxHeight = mapSize; // Same height as map
    const infoBoxY = canvas.height - mapSize - padding;
    const cornerRadius = 12 * scale;

    // Badge dimensions (+20% size)
    const brandWidth = 204 * scale;   // Was 170
    const brandHeight = 36 * scale;   // Was 30
    const brandX = infoBoxX + infoBoxWidth - brandWidth;
    const brandY = infoBoxY - brandHeight + 0.1 * scale;  // Tiny overlap to eliminate seam

    // Draw main info box with NO rounded corner on top-right (to merge with badge)
    ctx.save();
    ctx.fillStyle = 'rgba(50, 50, 50, 0.88)';
    roundedRectSelective(ctx, infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, cornerRadius, {
        tl: true,   // top-left: rounded
        tr: false,  // top-right: square (merges with badge)
        br: true,   // bottom-right: rounded
        bl: true    // bottom-left: rounded
    });
    ctx.fill();

    // Draw "GPS Map Camera" badge with NO rounded corners on bottom (fully merges with box)
    ctx.fillStyle = 'rgba(50, 50, 50, 0.88)';  // Same as main info box
    roundedRectSelective(ctx, brandX, brandY, brandWidth, brandHeight, 8 * scale, {
        tl: true,   // top-left: rounded
        tr: true,   // top-right: rounded
        br: false,  // bottom-right: square (merges with box)
        bl: false   // bottom-left: square (merges with box)
    });
    ctx.fill();

    // Draw GPS Map Camera logo (logo_stamped.png) - +20% size
    const logoSize = 22 * scale;  // Was 18
    const logoX = brandX + 12 * scale;
    const logoY = brandY + (brandHeight - logoSize) / 2;

    // Try to draw the logo image
    if (gpsLogoImage && gpsLogoImage.complete) {
        ctx.drawImage(gpsLogoImage, logoX, logoY, logoSize, logoSize);
    }

    // Draw text next to logo - +20% size
    ctx.font = `${17 * scale}px Arial`;  // Was 14
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('GPS Map Camera', logoX + logoSize + 10 * scale, brandY + brandHeight / 2);

    // Text content inside info box
    const textX = infoBoxX + 18 * scale;
    const textMaxWidth = infoBoxWidth - 36 * scale;
    let textY = infoBoxY + 18 * scale;  // Moved up slightly more
    const titleLineHeight = 28 * scale;  // Adjusted for larger font
    const bodyLineHeight = 22 * scale;   // Adjusted for larger font
    const titleFontSize = 24 * scale;    // +10% (was 22)
    const bodyFontSize = 18 * scale;     // +10% (was 16)

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Line 1: Main location title (bold white) - with text wrapping
    ctx.font = `bold ${titleFontSize}px Arial`;
    ctx.fillStyle = 'white';

    let titleLine1 = '';
    if (districtSelect.value) {
        titleLine1 = `Kecamatan ${districtSelect.value}, Kalimantan`;
    } else {
        titleLine1 = 'Kalimantan';
    }

    // Wrap title if too long
    const wrappedTitle = wrapText(ctx, titleLine1, textMaxWidth);
    for (const line of wrappedTitle) {
        ctx.fillText(line, textX, textY);
        textY += titleLineHeight;
    }

    // Line 2: Second part of title with flag
    let titleLine2 = 'Selatan, Indonesia';
    ctx.fillText(titleLine2, textX, textY);

    // Draw Indonesia flag image (+20% size, closer to text)
    const flagX = textX + ctx.measureText(titleLine2).width + 6 * scale;  // Closer (was 12)
    const flagWidth = 47 * scale;   // +15% more (was 41)
    const flagHeight = 32 * scale;  // +15% more (was 28)
    const flagY = textY + (titleFontSize - flagHeight) / 2;

    if (indonesiaFlagImage && indonesiaFlagImage.complete) {
        ctx.drawImage(indonesiaFlagImage, flagX, flagY, flagWidth, flagHeight);
    }
    textY += titleLineHeight + 6 * scale;

    // Address lines (smaller, white) - with text wrapping
    ctx.font = `${bodyFontSize}px Arial`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

    // Build full address text
    const plusCode = generatePlusCode(selectedLocation.lat, selectedLocation.lng);
    let fullAddress = plusCode;
    if (roadInput.value.trim()) {
        fullAddress += `, ${roadInput.value.trim()}`;
    }
    if (villageSelect.value) {
        fullAddress += `, ${villageSelect.value}`;
    }
    if (districtSelect.value) {
        fullAddress += `, Kec. ${districtSelect.value}, Kabupaten Tanah Bumbu, Kalimantan Selatan 72273, Indonesia`;
    }

    // Wrap and draw address
    const wrappedAddress = wrapText(ctx, fullAddress, textMaxWidth);
    for (const line of wrappedAddress) {
        ctx.fillText(line, textX, textY);
        textY += bodyLineHeight;
    }

    // Coordinates
    if (selectedLocation) {
        const coordsText = `Lat ${selectedLocation.lat.toFixed(6)}° Long ${selectedLocation.lng.toFixed(6)}°`;
        ctx.fillText(coordsText, textX, textY);
        textY += bodyLineHeight;
    }

    // Date and Time with timezone
    const dateStr = formatDateGPS(dateInput.value);
    const timeStr = formatTimeGPS(timeInput.value);
    const dateTimeText = `${dateStr} ${timeStr} GMT +08:00`;
    ctx.fillText(dateTimeText, textX, textY);

    ctx.restore();
}

// Generate fake Plus Code (for display purposes)
function generatePlusCode(lat, lng) {
    const chars = '23456789CFGHJMPQRVWX';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    code += '+';
    for (let i = 0; i < 3; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code.toLowerCase();
}

// Format date for GPS style (Sabtu, 07/02/2026)
function formatDateGPS(dateString) {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${dayName}, ${day}/${month}/${year}`;
}

// Format time for GPS style (01:38 PM)
function formatTimeGPS(timeString) {
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`;
}

