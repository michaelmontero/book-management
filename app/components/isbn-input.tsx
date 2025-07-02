'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { validateISBN, formatISBNInput } from '@/utils/isbn-validator';

interface ISBNInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  id?: string;
}

export function ISBNInput({
  value,
  onChange,
  required = false,
  className = '',
  id,
}: ISBNInputProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [validation, setValidation] = useState(validateISBN(value));
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setDisplayValue(value);
    setValidation(validateISBN(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatISBNInput(inputValue);

    setDisplayValue(formatted);

    // Clean the value for validation and parent component
    const cleanValue = formatted.replace(/[-\s]/g, '');
    onChange(cleanValue);

    setValidation(validateISBN(cleanValue));
  };

  const getInputClassName = () => {
    let baseClass = `h-11 pr-10 ${className}`;

    if (value && validation.isValid) {
      baseClass +=
        ' border-green-500 focus:border-green-500 focus:ring-green-500';
    } else if (value && !validation.isValid) {
      baseClass += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    }

    return baseClass;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          ISBN {required && '*'}
        </Label>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Info className="h-3 w-3" />
          Help
        </button>
      </div>

      <div className="relative">
        <Input
          id={id}
          value={displayValue}
          onChange={handleChange}
          placeholder="978-0-12-345678-9 or 0-123-45678-X"
          className={getInputClassName()}
          required={required}
        />

        {/* Validation Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {value && validation.isValid && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {value && !validation.isValid && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>

      {/* Validation Message */}
      {value && !validation.isValid && validation.message && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {validation.message}
        </p>
      )}

      {value && validation.isValid && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Valid ISBN format
        </p>
      )}

      {/* Help Text */}
      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <h4 className="font-medium text-blue-900 mb-2">
            ISBN Format Examples:
          </h4>
          <ul className="space-y-1 text-blue-800">
            <li>
              <strong>ISBN-13:</strong> 978-0-123-45678-9 (13 digits)
            </li>
            <li>
              <strong>ISBN-10:</strong> 0-123-45678-X (10 digits, may end with
              X)
            </li>
            <li className="text-blue-600 text-xs mt-2">
              • Hyphens and spaces are optional - they will be added
              automatically
              <br />• The last character can be X for ISBN-10
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
