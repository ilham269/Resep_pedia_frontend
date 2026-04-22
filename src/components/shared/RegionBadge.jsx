import { MapPin } from 'lucide-react';

export default function RegionBadge({ region, country }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      {country?.flag_emoji && <span>{country.flag_emoji}</span>}
      <MapPin className="w-3 h-3" />
      {region?.name || country?.name || '-'}
    </span>
  );
}
