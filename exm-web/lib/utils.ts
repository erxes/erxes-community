import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const READ_FILE = '/read-file?key=';
export const readFile = (url: string = '') => {
  if (url.includes(READ_FILE)) {
    const apiUrl = url.split(READ_FILE)[0];
    return url.replace(apiUrl, getEnv().NEXT_PUBLIC_MAIN_API_DOMAIN || '');
  }
  // if (url.startsWith("/") && typeof window !== "undefined") {
  //   const { protocol, host } = window.location
  //   return `${protocol}//${host}${url}`
  // }
  return url;
};

export const getEnv = (): any => {
  const envs: any = {};

  if (typeof window !== 'undefined') {
    for (const envMap of (window as any).envMaps || []) {
      envs[envMap.name] = localStorage.getItem(`pos_env_${envMap.name}`);
    }
  }

  return envs;
};

// Get a value from localStorage
export function getLocal<T>(key: string): T | undefined {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue !== null) {
      return JSON.parse(serializedValue);
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error getting data from localStorage:', error);
    return undefined;
  }
}

// Set a value in localStorage
export function setLocal<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
  }
}
