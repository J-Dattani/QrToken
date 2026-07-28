function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search menu..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBar;