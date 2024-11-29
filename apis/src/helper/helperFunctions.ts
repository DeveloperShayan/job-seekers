import * as randomstring from 'randomstring';

/**
 * Generate Random String
 * @param length
 * @returns
 */
export const randomStringGenerate = (length = 20): string => {
  return randomstring.generate({
    length,
  });
};

export const otpGenerate = (length = 10): string => {
  return Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(6, '0');
};

export const generateUniqueFileName = (): string => {
  const timestamp = Date.now();
  const uniqueName = `${timestamp}`;
  return uniqueName;
};
