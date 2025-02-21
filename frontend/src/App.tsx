import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface FilterResponse {
  alphabets?: string[];
  numbers?: number[];
  highest_alphabet?: string;
}

type FilterOption = 'Alphabets' | 'Numbers' | 'Highest alphabet';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<FilterResponse | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterInput, setFilterInput] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  const filterInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterOptions: FilterOption[] = ['Alphabets', 'Numbers', 'Highest alphabet'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateAndSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('Input must contain a "data" array');
      }

      setError(null);
      
      const apiResponse = await fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput,
      });

      if (!apiResponse.ok) {
        throw new Error('API request failed');
      }

      const data = await apiResponse.json();
      setResponse(data);
      setShowDropdown(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setShowDropdown(false);
      setResponse(null);
    }
  };

  const toggleFilter = (filter: FilterOption) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters(prev => [...prev, filter]);
    }
    setFilterInput('');
    setShowFilterOptions(false);
    filterInputRef.current?.focus();
  };

  const removeFilter = (filter: FilterOption) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  const filteredOptions = filterOptions.filter(
    option => 
      !selectedFilters.includes(option) && 
      option.toLowerCase().includes(filterInput.toLowerCase())
  );

  const renderFilteredResponse = () => {
    if (!response || selectedFilters.length === 0) return null;

    return (
      <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Filtered Response</h3>
        <div className="space-y-2">
          {selectedFilters.includes('Numbers') && response.numbers && (
            <p className="text-gray-700">
              <span className="font-medium">Numbers:</span> {response.numbers.join(', ')}
            </p>
          )}

{selectedFilters.includes('Alphabets') && response.alphabets && (
            <p className="text-gray-700">
              <span className="font-medium">Alphabets:</span> {response.alphabets.join(', ')}
            </p>
          )}
          {selectedFilters.includes('Highest alphabet') && response.highest_alphabet && (
            <p className="text-gray-700">
              <span className="font-medium">Highest Alphabet:</span> {response.highest_alphabet}
            </p>
          )}
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                API Input
              </label>
              <textarea
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none text-gray-900 placeholder-gray-400 text-sm"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{ "data": ["A","C","z"] }'
              />
            </div>
            {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={validateAndSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Submit
          </button>
          {showDropdown && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Multi Filter
              </label>
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="min-h-[42px] w-full border border-gray-300 rounded-md px-2 py-1.5 focus-within:border-blue-500 cursor-text"
                  onClick={() => filterInputRef.current?.focus()}
                >
                  <div className="flex flex-wrap gap-2">
                    {selectedFilters.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-2.5 py-1 text-sm"
                      >
                        {filter}
                        <button
                          onClick={() => removeFilter(filter)}
                          className="ml-1 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                    <input
                      ref={filterInputRef}
                      type="text"
                      className="flex-1 outline-none min-w-[100px] text-sm"
                      value={filterInput}
                      onChange={(e) => {
                        setFilterInput(e.target.value);
                        setShowFilterOptions(true);
                      }}
                      onFocus={() => setShowFilterOptions(true)}
                      placeholder={selectedFilters.length === 0 ? "Type to filter..." : ""}
                    />
                  </div>
                </div>
                
                {showFilterOptions && filteredOptions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="py-1">
                      {filteredOptions.map((option) => (
                        <li
                          key={option}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => toggleFilter(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {renderFilteredResponse()}
        </div>
      </div>
    </div>
    );
  }
  
  export default App;