import { CountryCode } from '@/components/countryCode';

export default function getCountryFlagEmoji(countryCode: CountryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
