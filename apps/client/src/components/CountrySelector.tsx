import { countryNameRecord } from './countryCode';

const CountrySelector: React.FC<{
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ onChange }) => {
  return (
    <div className='flex flex-col'>
      <label className='text-3xl font-semibold'>Select your country</label>
      <select
        id='country'
        name='country'
        className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
        onChange={onChange}
      >
        <option value=''>Select Country</option>
        {Object.entries(countryNameRecord).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;
