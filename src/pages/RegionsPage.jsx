import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useRegions, useCountries } from '../hooks/useRecipes';

export default function RegionsPage() {
  const { data: regions, isLoading } = useRegions();
  const { data: countries } = useCountries();

  const getCountry = (id) => countries?.find(c => c.id === id);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daerah & Negara</h1>
        <p className="text-gray-500 mb-8">Jelajahi resep berdasarkan asal daerah</p>

        {/* Countries */}
        {countries?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🌍 Negara</h2>
            <div className="flex flex-wrap gap-3">
              {countries.map((c) => (
                <Link
                  key={c.id}
                  to={`/explore?country=${c.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition text-sm font-medium text-gray-700"
                >
                  <span className="text-xl">{c.flag_emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🗺️ Daerah</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !regions?.length ? (
            <p className="text-gray-400 text-center py-10">Belum ada daerah.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {regions.map((region) => {
                const country = getCountry(region.country_id);
                return (
                  <Link
                    key={region.id}
                    to={`/explore?region=${region.id}`}
                    className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition group"
                  >
                    {region.thumbnail_url ? (
                      <img src={region.thumbnail_url} alt={region.name} className="w-full h-28 object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-28 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-4xl">
                        {country?.flag_emoji || '🗺️'}
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-red-500 transition">{region.name}</p>
                      {country && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{country.name}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
