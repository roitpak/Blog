import axios from 'axios';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import {getUniqueId} from 'react-native-device-info';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

const myConfig = Platform.OS === 'web' ? process.env : Config;

export function formatDate(date: Date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(1);

  return `${month} ${day}, ${year}`;
}

export function extractVideoId(url: string) {
  var pattern =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]+)/;
  var match = url.match(pattern);
  if (match) {
    return match[1].toString();
  } else {
    return '';
  }
}

export const getGeoLocation = () =>
  axios.get(
    `https://ipinfo.io/json?token=${myConfig.REACT_APP_GEO_LOGIN_TOKEN}`,
  );

export const getUserUniqueID = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    let uniqueId = localStorage.getItem('deviceId');
    if (uniqueId) {
      return uniqueId;
    } else {
      const newId = uuidv4();
      localStorage.setItem('deviceId', newId);
      return newId;
    }
  } else {
    const id = await getUniqueId();
    return id;
  }
};

export function getValueFromUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const urlObj = new URL(url);
  const urlParams = new URLSearchParams(urlObj.search);
  const secret = urlParams.get('secret');
  const userId = urlParams.get('userId');
  const id = urlParams.get('id');

  if (url.indexOf('verify') !== -1 && secret && userId) {
    return 'verify';
  }
  if (id) {
    return id;
  }
  // Regular expression to match URLs with "/<value>" format
  // For /screenNames
  // previous share was:  url/<post_id>
  const regex = /\/([a-zA-Z0-9]+)$/;

  const match = regex.exec(url);

  if (match) {
    return match[1];
  }

  return null;
}

export function calculateReadingTime(wordCount: number, wordsPerMinute = 200) {
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

const VIEWED_POST_STORAGE_KEY = 'storedIDs';

class StoredPostIdsService {
  async storeIDs(ids: string) {
    try {
      const jsonValue = JSON.stringify(ids);
      await AsyncStorage.setItem(VIEWED_POST_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error storing IDs:', e);
    }
  }
  async getIDs() {
    try {
      const jsonValue = await AsyncStorage.getItem(VIEWED_POST_STORAGE_KEY);

      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error retrieving IDs:', e);
      return [];
    }
  }

  async isIDPresent(id: string) {
    const ids = await this.getIDs();
    const present = ids.includes(id);
    if (!present) {
      this.addID(id);
    }
    return present;
  }

  // Add an ID to the array if it's not already present
  async addID(id: string) {
    const ids = await this.getIDs();
    if (!ids.includes(id)) {
      ids.push(id);
      await this.storeIDs(ids);
    }
  }
}
const storedPostIdsService = new StoredPostIdsService();
export default storedPostIdsService;

export function sanitizeRichText(html: string) {
  // fix for: Unecessary break lines rendered after saving rich text
  return html.replace(/<p>\s*<\/p>/g, '').replace(/<br\s*\/?>/g, '');
}

export function timeToRead(text: string): string {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.trim().split(/\s+/).length; // Split by spaces to count words
  const minutes = words / wordsPerMinute;

  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} sec read`;
  }
  return `${Math.ceil(minutes)} min read`;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
