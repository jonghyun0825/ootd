type ChipOption<T extends string> = { value: T; label: string };

type FilterChipsProps<T extends string> = {
  options: ChipOption<T>[];
  selected: T | undefined;
  onSelect: (value: T | undefined) => void;
};

export function FilterChips<T extends string>({ options, selected, onSelect }: FilterChipsProps<T>) {
  return (
    <div className="chip-group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`chip${selected === option.value ? " is-selected" : ""}`}
          onClick={() => onSelect(selected === option.value ? undefined : option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

type MultiFilterChipsProps = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export function MultiFilterChips({ options, selected, onToggle }: MultiFilterChipsProps) {
  return (
    <div className="chip-group">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`chip${selected.includes(option) ? " is-selected" : ""}`}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
