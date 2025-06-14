import React, { useEffect, useState } from 'react';
import { MapPin, User, PhoneCall, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Untuk mengakses instance Firestore (db)
import { collection, getDocs, query } from 'firebase/firestore'; // Import fungsi Firestore

const HomePage = ({ targetSectionId }) => {
  const { db } = useAuth(); // Ambil instance db dari AuthContext
  const [dojoData, setDojoData] = useState([]);
  const [loadingDojos, setLoadingDojos] = useState(true);
  const [errorDojos, setErrorDojos] = useState(null);

  // Carousel Gambar Latar Belakang Hero Section
  const heroImages = [
      '/1.jpg', // Menggunakan gambar lokal dari public/
      '/2.jpg', // Menggunakan gambar lokal dari public/
      '/3.jpg'  // Menggunakan gambar lokal dari public/
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

  // Fungsi untuk mengambil data dojo dari Firestore
  const fetchDojoData = async () => {
    if (!db) { // Pastikan instance db sudah ada
      console.warn("Firestore instance not available yet.");
      return;
    }
    setLoadingDojos(true);
    setErrorDojos(null);
    try {
      // Dapatkan App ID dari variabel global
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      
      // Path Firestore untuk data publik
      const dojosCollectionRef = collection(db, `artifacts/${appId}/public/data/dojos`);
      const q = query(dojosCollectionRef);
      const querySnapshot = await getDocs(q);
      const fetchedDojos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDojoData(fetchedDojos);

      // Inisialisasi Filter Dojo setelah data dojo di-fetch
      const branchFilterSelect = document.getElementById('branch-filter-homepage');
      const uniqueBranches = [...new Set(fetchedDojos.map(dojo => dojo.branch))].sort();

      if (branchFilterSelect) {
          // Bersihkan opsi yang ada
          branchFilterSelect.innerHTML = '<option value="">Semua Cabang (Kota/Kabupaten)</option>';
          uniqueBranches.forEach(branch => {
              const option = document.createElement('option');
              option.value = branch;
              option.textContent = branch;
              branchFilterSelect.appendChild(option);
          });
          // Tambahkan event listener jika belum ada
          if (!branchFilterSelect.hasAttribute('data-listener-attached')) {
            branchFilterSelect.addEventListener('change', (event) => {
                renderDojoCards(event.target.value);
            });
            branchFilterSelect.setAttribute('data-listener-attached', 'true');
          }
      }
      renderDojoCards(); // Render cards pertama kali setelah fetch
    } catch (error) {
      console.error("Error fetching dojo data:", error);
      setErrorDojos("Gagal memuat data dojo. Silakan coba lagi.");
    } finally {
      setLoadingDojos(false);
    }
  };

  // Panggil fetchDojoData saat komponen mount atau db berubah
  useEffect(() => {
    if (db) { // Hanya fetch jika db sudah terinisialisasi
      fetchDojoData();
    }
  }, [db]); // Dependency array menyertakan db

  useEffect(() => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    changeHeroImage();
    heroInterval = setInterval(changeHeroImage, 5000);

    return () => clearInterval(heroInterval);
  }, []);

  // Effect untuk smooth scroll dengan offset navbar
  useEffect(() => {
    if (targetSectionId) {
      const targetElement = document.getElementById(targetSectionId);
      if (targetElement) {
        const navbar = document.querySelector('nav');
        const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get actual navbar height

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + elementPosition - navbarHeight - 20; // -20px for extra padding

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [targetSectionId]);


  const renderDojoCards = (filterBranch = '') => {
    const dojoListContainer = document.getElementById('dojo-list-homepage');
    if (!dojoListContainer) return;

    const filteredDojos = dojoData.filter(dojo =>
        filterBranch === '' || dojo.branch === filterBranch
    );

    if (loadingDojos) {
        dojoListContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-blue-600">
                Memuat dojo...
            </div>
        `;
        return;
    }

    if (errorDojos) {
        dojoListContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-red-600">
                ${errorDojos}
            </div>
        `;
        return;
    }

    if (filteredDojos.length === 0) {
        dojoListContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-600">
                Tidak ada dojo yang ditemukan untuk cabang ini.
            </div>
        `;
        return;
    }

    dojoListContainer.innerHTML = filteredDojos.map(dojo => {
        // Pastikan dojo.schedules adalah array sebelum memanggil .map
        const schedulesHtml = Array.isArray(dojo.schedules) ? dojo.schedules.map((schedule, index) => (
            `<li key=${index}>${schedule}</li>`
        )).join('') : '';

        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transform hover:scale-105 transition-all duration-300">
                <img src="${dojo.image || 'https://placehold.co/400x250/cccccc/000000?text=No+Image'}" alt="Dojo ${dojo.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-blue-700 mb-3">${dojo.name}</h3>
                    <p class="text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin mr-2"><path d="M12 18.35v-1.15a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1.15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"/><circle cx="12" cy="12" r="10"/></svg>
                        ${dojo.address || 'N/A'}
                    </p>
                    <p class="text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Pelatih: ${dojo.coach?.name || 'N/A'}
                    </p>
                    <p class="text-gray-700 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone mr-2"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M12 12V6"/><path d="M10 9l2-2 2 2"/></svg>
                        Kontak: ${dojo.coach?.contact || 'N/A'}
                    </p>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">Jadwal Latihan:</h4>
                    <ul class="list-disc list-inside text-gray-700">
                            ${schedulesHtml}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
  };

  return (
    <div>
        {/* Hero Section dengan Carousel Gambar */}
        <section id="hero-homepage" className="h-screen bg-cover bg-center flex items-center justify-center text-center text-white relative transition-all duration-300">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            <div className="relative z-20 p-8 max-w-3xl">
                <img src="/logo-ksk.png" alt="Logo Kei Shin Kan" className="mx-auto mb-6 h-24 w-24 object-contain rounded-full shadow-lg"/>
                
                <h1 className="text-6xl font-extrabold mb-4 leading-tight">
                    <span className="text-blue-400">KEI SHIN KAN</span> Jawa Barat
                </h1>
                <p className="text-xl md:text-2xl font-light mb-8">
                    Membangun Karakter Kuat, Melalui Disiplin dan Tradisi Karate
                </p>
                <div className="space-x-4">
                    <a href="/login" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
                        Login
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in ml-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                    </a>
                    <a href="#jadwal-tempat-section" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold text-lg rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                        Jelajahi Dojo
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-2"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                </div>
            </div>
        </section>

        {/* About Us Section */}
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
        </section>

        {/* Locations & Schedules Section (Tempat & Jadwal Latihan) */}
        <section id="jadwal-tempat-section" className="container mx-auto py-16 px-8 mb-16">
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Tempat & Jadwal <span className="text-blue-600">Latihan</span></h2>
            {/* Filter Dropdown Dojo */}
            <div className="flex justify-center mb-10">
                <label htmlFor="branch-filter-homepage" className="sr-only">Filter berdasarkan Cabang</label>
                <select id="branch-filter-homepage" className="block w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Semua Cabang (Kota/Kabupaten)</option>
                    {/* Opsi cabang akan diisi oleh JavaScript */}
                </select>
            </div>
            <div id="dojo-list-homepage" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Dojo cards akan di-render di sini menggunakan JavaScript */}
                {loadingDojos && <div className="col-span-full text-center py-10 text-blue-600">Memuat dojo...</div>}
                {errorDojos && <div className="col-span-full text-center py-10 text-red-600">{errorDojos}</div>}
                {!loadingDojos && dojoData.length === 0 && !errorDojos && (
                    <div className="col-span-full text-center py-10 text-gray-600">
                        Tidak ada dojo yang ditemukan.
                    </div>
                )}
            </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-gray-300 py-10 px-8 mt-16">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">KEI SHIN KAN Jawa Barat</h3>
                    <p className="text-sm">Membangun Masa Depan Lebih Kuat.</p>
                </div>
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Kontak Kami</h3>
                    <p className="text-sm flex items-center justify-center md:justify-start mb-1">
                        <Mail size={18} className="mr-2"/> {/* Menggunakan Lucide Icon */}
                        info@keishinkan-jabar.com
                    </p>
                    <p class="text-sm flex items-center justify-center md:justify-start">
                        <PhoneCall size={18} className="mr-2"/> {/* Menggunakan Lucide Icon */}
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
