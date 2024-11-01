import {Models} from 'appwrite';

export interface UserProviderValue {
  user?: Models.User<Object>;
  isAdmin?: boolean;
  isAdminLoading: boolean;
  setLogin: () => void;
  logout: () => void;
}
