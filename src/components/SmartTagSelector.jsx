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
    inputRef.current.focus();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input with tags + toggle icon */}
      <div
        className="min-h-[42px] border border-gray-300 rounded px-2 py-1 flex flex-wrap items-center gap-1 bg-white"
        onClick={() => {
          if (inputValue.trim() === "") {
            setFocused((prev) => !prev);
          } else {
            setFocused(true);
          }
          inputRef.current.focus();
        }}
      >
        {/* Selected Tags */}
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

        {/* Input field */}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={`Search ${label}...`}
          className="flex-grow min-w-[100px] text-sm px-2 py-1 outline-none"
        />

        {/* Chevron toggle */}
        <div
          className="ml-auto pl-1 pr-1 text-gray-500 cursor-pointer"
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

      {/* Dropdown */}
      {focused && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
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
