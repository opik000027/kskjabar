import React from 'react';
import { Users } from 'lucide-react'; // Diperlukan untuk ikon pada CoachesPage
// Pastikan ekstensi .jsx disertakan secara eksplisit pada jalur impor.
import { useAuth } from '../../contexts/AuthContext.jsx'; 

const CoachesPage = () => {
  const { data } = useAuth(); // Menggunakan useAuth hook untuk mengakses data
  const coaches = data.users.filter(user => user.role === 'pelatih');
  const dojos = data.dojos;
  const belts = data.belts;

  const getDojoName = (dojoId) => dojos.find(d => d.id === dojoId)?.name || 'N/A';
  const getBeltName = (beltId) => belts.find(b => b.id === beltId)?.name || 'N/A';

  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Profil Pelatih Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200">
            <img
              src={coach.profilePicture || `https://placehold.co/400x250/5e72e4/ffffff?text=${coach.fullName.split(' ').map(n => n[0]).join('')}`}
              alt={`Foto ${coach.fullName}`}
              className="w-full h-48 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/5e72e4/ffffff?text=${coach.fullName.split(' ').map(n => n[0]).join('')}` }}
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{coach.fullName}</h2>
              <p className="text-blue-600 font-medium mb-1">
                <span className="font-bold">Dojo:</span> {getDojoName(coach.dojoId)}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-bold">Email:</span> {coach.email}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-bold">Telepon:</span> {coach.phone}
              </p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachesPage;
