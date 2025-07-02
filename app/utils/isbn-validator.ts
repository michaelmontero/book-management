export interface ISBNValidationResult {
  isValid: boolean;
  message?: string;
  formattedISBN?: string;
}

export function validateISBN(isbn: string): ISBNValidationResult {
  if (!isbn || isbn.trim() === '') {
    return { isValid: false, message: 'ISBN is required' };
  }

  // Remove hyphens, spaces, and convert to uppercase
  const cleanISBN = isbn.replace(/[-\s]/g, '').toUpperCase();

  // Check if it's ISBN-10 or ISBN-13
  const isISBN10 = /^(?:\d{9}[\dX])$/.test(cleanISBN);
  const isISBN13 = /^(?:\d{13})$/.test(cleanISBN);

  if (!isISBN10 && !isISBN13) {
    return {
      isValid: false,
      message: 'ISBN must be 10 digits (with optional X) or 13 digits',
    };
  }

  // Format the ISBN for display
  let formattedISBN = '';
  if (isISBN10) {
    // Format as XXX-X-XXXX-X
    formattedISBN = `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 4)}-${cleanISBN.slice(4, 8)}-${cleanISBN.slice(8)}`;
  } else if (isISBN13) {
    // Format as XXX-X-XX-XXXXXX-X
    formattedISBN = `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 4)}-${cleanISBN.slice(4, 6)}-${cleanISBN.slice(6, 12)}-${cleanISBN.slice(12)}`;
  }

  return {
    isValid: true,
    formattedISBN,
  };
}

export function formatISBNInput(value: string): string {
  // Remove all non-digit and non-X characters
  const cleaned = value.replace(/[^\dX]/gi, '').toUpperCase();

  // Limit to 13 characters max
  const limited = cleaned.slice(0, 13);

  // Auto-format as user types
  if (limited.length <= 10) {
    // Format as ISBN-10: XXX-X-XXXX-X
    if (limited.length > 8) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 4)}-${limited.slice(4, 8)}-${limited.slice(8)}`;
    } else if (limited.length > 4) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 4)}-${limited.slice(4)}`;
    } else if (limited.length > 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    return limited;
  } else {
    // Format as ISBN-13: XXX-X-XX-XXXXXX-X
    if (limited.length > 12) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 4)}-${limited.slice(4, 6)}-${limited.slice(6, 12)}-${limited.slice(12)}`;
    } else if (limited.length > 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 4)}-${limited.slice(4, 6)}-${limited.slice(6)}`;
    } else if (limited.length > 4) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 4)}-${limited.slice(4)}`;
    } else if (limited.length > 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    return limited;
  }
}
