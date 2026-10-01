import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Selecciona una opción',
  className = '',
}) {
  const selected = options.find((option) => option.value === value) ?? null

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-2xl border border-stone-200/80 bg-baby-powder/80 py-3.5 pl-4 pr-11 text-left text-sm text-ink outline-none transition focus:border-strawberry focus:ring-2 focus:ring-marshmallow">
            <span className={selected ? 'text-ink' : 'text-slate-400'}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dusty-deep" />
          </ListboxButton>

          <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-stone-200/80 bg-baby-powder/95 py-2 shadow-xl shadow-strawberry/10 backdrop-blur-xl focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={String(option.value)}
                value={option.value}
                className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm text-ink data-focus:bg-marshmallow/40"
              >
                <span className="font-medium group-data-selected:text-dusty-deep">
                  {option.label}
                </span>
                <Check className="h-4 w-4 text-sage-deep opacity-0 group-data-selected:opacity-100" />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}
