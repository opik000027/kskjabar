import React, { useEffect } from 'react';

const HomePage = () => {
  // Data Mock untuk Dojo (Ini bisa diganti dengan fetch dari API Supabase nanti)
  const dojoData = [
    {
        id: 'dojo1',
        name: 'Dojo Harimau',
        branch: 'Kota Bandung',
        address: 'Jl. Cisitu Lama No.1, Bandung',
        schedules: [
            'Senin: 16:00 - 18:00 (GOR Cihampelas)',
            'Rabu: 19:00 - 21:00 (GOR Cihampelas)'
        ],
        coach: { name: 'Sensei Rudi', contact: '081122334455', email: 'rudi@example.com' },
        image: 'https://placehold.co/400x250/3498db/ffffff?text=Dojo+Harimau'
    },
    {
        id: 'dojo2',
        name: 'Dojo Naga Langit',
        branch: 'Kota Cimahi',
        address: 'Jl. Raya Cibabat No.5, Cimahi',
        schedules: [
            'Selasa: 15:00 - 17:00 (Pusat Olahraga Cimahi)',
            'Kamis: 18:00 - 20:00 (Pusat Olahraga Cimahi)'
        ],
        coach: { name: 'Sensei Lia', contact: '089876543210', email: 'lia@example.com' },
        image: 'https://placehold.co/400x250/2ecc71/ffffff?text=Dojo+Naga+Langit'
    },
    {
        id: 'dojo3',
        name: 'Dojo Elang Perkasa',
        branch: 'Kota Tasikmalaya',
        address: 'Jl. Pemuda No. 10, Tasikmalaya',
        schedules: [
            'Jumat: 17:00 - 19:00 (GOR Tasikmalaya)',
            'Sabtu: 09:00 - 11:00 (GOR Tasikmalaya)'
        ],
        coach: { name: 'Sensei Maya', contact: '081234567891', email: 'maya@example.com' },
        image: 'https://placehold.co/400x250/9b59b6/ffffff?text=Dojo+Elang'
    },
    {
        id: 'dojo4',
        name: 'Dojo Banteng Merah',
        branch: 'Kota Bandung',
        address: 'Jl. Merdeka No. 45, Bandung',
        schedules: [
            'Selasa: 17:00 - 19:00 (GOR Bandung)',
            'Jumat: 16:00 - 18:00 (GOR Bandung)'
        ],
        coach: { name: 'Sensei Budi', contact: '081312345678', email: 'budi@example.com' },
        image: 'https://placehold.co/400x250/f39c12/ffffff?text=Dojo+Banteng'
    },
    {
        id: 'dojo5',
        name: 'Dojo Kuda Terbang',
        branch: 'Kota Cimahi',
        address: 'Jl. Asia Afrika No. 100, Cimahi',
        schedules: [
            'Rabu: 14:00 - 16:00 (Lap. Bola Cimahi)',
            'Sabtu: 10:00 - 12:00 (Lap. Bola Cimahi)'
        ],
        coach: { name: 'Sensei Dewi', contact: '087812345678', email: 'dewi@example.com' },
        image: 'https://placehold.co/400x250/e74c3c/ffffff?text=Dojo+Kuda'
    }
  ];

  // Carousel Gambar Latar Belakang Hero Section
  const heroImages = [
      // Jalur gambar latar belakang sekarang menggunakan nama file baru (huruf kecil)
      '/1.jpg', 
      '/2.jpg', 
      '/3.jpg'
  ];
  let currentImageIndex = 0;
  let heroInterval;

  const changeHeroImage = () => {
      const heroSection = document.getElementById('hero-homepage');
      if (heroSection) {
          heroSection.style.backgroundImage = `url('${heroImages[currentImageIndex]}')`;
          currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      }
  };

  useEffect(() => {
    // Inisialisasi Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Inisialisasi Filter Dojo (akan diaktifkan setelah DOM dojo cards dirender)
    const branchFilterSelect = document.getElementById('branch-filter-homepage');
    const uniqueBranches = [...new Set(dojoData.map(dojo => dojo.branch))].sort();

    if (branchFilterSelect) {
        branchFilterSelect.innerHTML = '<option value="">Semua Cabang (Kota/Kabupaten)</option>'; // Reset options
        uniqueBranches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch;
            option.textContent = branch;
            branchFilterSelect.appendChild(option);
        });
        branchFilterSelect.addEventListener('change', (event) => {
            renderDojoCards(event.target.value);
        });
    }
    
    renderDojoCards(); // Render dojo cards pertama kali

    // Carousel gambar latar belakang
    changeHeroImage(); // Set gambar pertama
    heroInterval = setInterval(changeHeroImage, 5000);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(heroInterval);
  }, []); // Dependency array kosong agar hanya berjalan sekali saat mount

  // Render Dojo Cards (di dalam komponen React)
  const renderDojoCards = (filterBranch = '') => {
    const dojoListContainer = document.getElementById('dojo-list-homepage');
    if (!dojoListContainer) return; // Pastikan elemen ada sebelum diupdate
      
    const filteredDojos = dojoData.filter(dojo => 
        filterBranch === '' || dojo.branch === filterBranch
    );

    if (filteredDojos.length === 0) {
        dojoListContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-600">
                Tidak ada dojo yang ditemukan untuk cabang ini.
            </div>
        `;
        return;
    }

    dojoListContainer.innerHTML = filteredDojos.map(dojo => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <img src="${dojo.image}" alt="Dojo ${dojo.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-2xl font-semibold text-blue-700 mb-3">${dojo.name}</h3>
                <p className="text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map-pin mr-2"><path d="M12 18.35v-1.15a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1.15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"/><circle cx="12" cy="12" r="10"/></svg>
                    ${dojo.address}
                </p>
                <p className="text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Pelatih: ${dojo.coach.name}
                </p>
                <p className="text-gray-700 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone mr-2"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M12 12V6"/><path d="M10 9l2-2 2 2"/></svg>
                    Kontak: ${dojo.coach.contact}
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Jadwal Latihan:</h4>
                <ul className="list-disc list-inside text-gray-700">
                        {/* Di sini, kita akan mem-render jadwal latihan */}
                        ${dojo.schedules.map((schedule, index) => (
                            `<li key=${index}>${schedule}</li>`
                        )).join('')}
                </ul>
            </div>
        </div>
    `).join('');
  };

  return (
    <div>
        {/* Hero Section dengan Carousel Gambar */}
        {/* ID diubah menjadi hero-homepage untuk menghindari konflik dengan App.jsx background */}
        <section id="hero-homepage" className="h-screen bg-cover bg-center flex items-center justify-center text-center text-white relative transition-all duration-300">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            <div className="relative z-20 p-8 max-w-3xl">
                {/* Logo Kei Shin Kan */}
                {/* Pastikan '/logo-ksk.png' adalah nama file yang sudah diganti dan ada di folder public/ */}
                <img src="/logo-ksk.png" alt="Logo Kei Shin Kan" className="mx-auto mb-6 h-24 w-24 object-contain rounded-full shadow-lg"/>
                
                <h1 className="text-6xl font-extrabold mb-4 leading-tight">
                    <span className="text-blue-400">KEI SHIN KAN</span> Jawa Barat
                </h1>
                <p className="text-xl md:text-2xl font-light mb-8">
                    Membangun Karakter Kuat, Melalui Disiplin dan Tradisi Karate
                </p>
                <div className="space-x-4">
                    {/* Tautan ke halaman login aplikasi React */}
                    <a href="/login" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
                        Login
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in ml-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                    </a>
                    {/* Tautan untuk gulir ke informasi dojo di halaman ini */}
                    <a href="#dojo-info-homepage" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold text-lg rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                        Jelajahi Dojo
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right ml-2"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                </div>
            </div>
        </section>

        {/* About Us & Dojo Information Section */}
        <section id="about-us-homepage" className="container mx-auto py-16 px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Tentang <span className="text-blue-600">KEI SHIN KAN</span> Jawa Barat</h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed mb-16">
                <p className="mb-6">
                    **KEI SHIN KAN Jawa Barat** adalah bagian dari organisasi karate global yang berdedikasi untuk mengembangkan seni bela diri tradisional dan modern. Kami berkomitmen untuk membentuk karakter murid yang kuat, disiplin, bertanggung jawab, dan memiliki semangat pantang menyerah melalui pelatihan karate yang komprehensif. Kami percaya bahwa karate bukan hanya tentang kekuatan fisik, tetapi juga pengembangan mental dan spiritual.
                </p>
                <p>
                    Dengan Sensei dan Pelatih berpengalaman, kami menyediakan lingkungan latihan yang aman, mendukung, dan menantang bagi semua tingkatan, mulai dari pemula hingga tingkatan sabuk hitam. Bergabunglah dengan kami untuk merasakan manfaat transformatif dari seni bela diri karate.
                </p>
            </div>

            <h2 id="dojo-info-homepage" className="text-4xl font-bold text-center mb-8 text-gray-800">Dojo Kami di Jawa Barat</h2>
            
            {/* Filter Dropdown */}
            <div className="flex justify-center mb-10">
                <label htmlFor="branch-filter-homepage" className="sr-only">Filter berdasarkan Cabang</label>
                <select id="branch-filter-homepage" className="block w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Semua Cabang (Kota/Kabupaten)</option>
                    {/* Opsi cabang akan diisi oleh JavaScript */}
                </select>
            </div>

            <div id="dojo-list-homepage" className="dojo-grid">
                {/* Dojo cards akan di-render di sini menggunakan JavaScript */}
            </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-gray-300 py-10 px-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">KEI SHIN KAN Jawa Barat</h3>
                    <p className="text-sm">Membangun Masa Depan Lebih Kuat.</p>
                </div>
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Kontak Kami</h3>
                    <p className="text-sm flex items-center justify-center md:justify-start mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        info@keishinkan-jabar.com
                    </p>
                    <p className="text-sm flex items-center justify-center md:justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone-call mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2.02 15.15 15.15 0 0 1-8.31-4.18 15.15 15.15 0 0 1-4.18-8.31A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.11 2.4l-.47.28a2.23 2.23 0 0 0-.85.73A12.18 12.18 0 0 0 6 12c0 2.5.92 4.62 2.76 6.36S13.5 21 16 21a12.18 12.18 0 0 0 2.29-.68 2.23 2.23 0 0 0 .73-.85l.28-.47a2 2 0 0 1 2.4-1.11z"/><path d="M18.92 6A8 8 0 0 0 6 18.92"/><path d="M19.5 2.5a10 10 0 0 0-17 17"/></svg>
                        0812-3456-7890
                    </p>
                </div>
                <div>
                    <p className="text-sm">&copy; 2025 KEI SHIN KAN Jawa Barat. Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default HomePage;
