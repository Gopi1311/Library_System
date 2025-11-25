
interface SearchSelectProps<T> {
  label: string;
  placeholder: string;

  searchValue: string;
  results: T[];

  displayField: (item: T) => string;
  keyExtractor: (item: T) => string;

  onSearch: (q: string) => void;
  onSelect: (item: T) => void;

  error?: string;
}

export function SearchSelect<T>({
  label,
  placeholder,
  searchValue,
  results,
  displayField,
  keyExtractor,
  onSearch,
  onSelect,
  error,
}: SearchSelectProps<T>) {
  return (
    <div className="relative">
      <label className="block text-gray-700 mb-1">{label}</label>

      <input
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded-lg"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {searchValue && results.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-50">
          {results.map((item) => (
            <li
              key={keyExtractor(item)}
              onClick={() => onSelect(item)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {displayField(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
