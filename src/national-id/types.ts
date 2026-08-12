/**
 * Why {@link validateNationalId} rejected an input.
 */
export type NationalIdInvalidReason =
  | 'invalid_length'
  | 'invalid_format'
  | 'invalid_checksum'
  | 'invalid_repeated_digits';

/**
 * Structured result of {@link validateNationalId}.
 */
export type ValidateNationalIdResult =
  { valid: true } | { valid: false; reason: NationalIdInvalidReason };
