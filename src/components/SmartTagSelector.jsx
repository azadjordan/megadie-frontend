import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SmartTagSelector = ({
  values = [],
  selectedValues = [],
  onToggle,
  label = "items",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const filtered = values.filter(
    (val) =>
      val.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedValues.includes(val)
  );

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setFocused(false);
    }
  };

  const handleRemove = (val) => {
    onToggle(val);
  };

  const handleSelect = (val) => {
    onToggle(val);
    setInputValue("");
    setFocused(false); // Collapse dropdown after selection
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Container: Column layout */}
      <div
        className="border border-gray-300 rounded px-2 py-1 bg-white flex flex-col gap-2"
        onClick={() => {
          setFocused(true);
          inputRef.current.focus();
        }}
      >
        {/* Selected Tags (on top) */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((val) => (
              <span
                key={val}
                className="bg-purple-100 text-purple-800 text-xs rounded px-2 py-1 flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {val}
                <button
                  onClick={() => handleRemove(val)}
                  className="text-base leading-none font-bold cursor-pointer hover:text-red-600"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input + Toggle */}
        <div className="flex items-center">
          <input
            ref={inputRef}
            value={inputValue}
            onClick={(e) => {
              e.stopPropagation();
              setFocused((prev) => !prev); // ✅ Toggle dropdown
            }}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Search ${label}...`}
            className="flex-grow text-sm px-2 py-1 outline-none min-w-[100px]"
          />

          <div
            className="ml-2 p-2 text-gray-600 cursor-pointer rounded border border-gray-300 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              if (focused) {
                setFocused(false);
                inputRef.current.blur();
              } else {
                setFocused(true);
                inputRef.current.focus();
              }
            }}
          >
            {focused ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {focused && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-1/2 md:w-2/3 bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto">
          {filtered.map((val) => (
            <div
              key={val}
              onClick={() => handleSelect(val)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-purple-100"
            >
              {val}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartTagSelector;
