
import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MultiSelect = ({ options, selected, onChange, className, placeholder = "Selecione..." }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    const isSelected = selected.includes(value);
    if (isSelected) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectedLabels = options
    .filter(option => selected.includes(option.value))
    .map(option => option.label)
    .join(', ');

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white", className)}
        >
          <span className="truncate">
            {selected.length > 0 ? selectedLabels : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-gray-900 border-purple-500 text-white">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={(e) => {
              e.preventDefault();
              handleSelect(option.value);
            }}
            className="cursor-pointer hover:!bg-purple-700"
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selected.includes(option.value) ? "opacity-100" : "opacity-0"
              )}
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;
