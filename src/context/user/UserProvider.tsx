import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import {UserContext} from './UserContext';
import authService from '../../appwrite/auth';
import {Models} from 'appwrite';
import {ADMIN_LABEL} from '../../constants/Constants';

export const UserPrvider: FC<PropsWithChildren> = ({children}) => {
  const [userInfo, setUserInfo] = useState<Models.User<Object>>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUserLoading, setUserLoading] = useState<boolean>(false);

  const getUser = async () => {
    setUserLoading(true);
    await authService
      .getCurrentUser()
      .then(user => {
        if (user?.labels.includes(ADMIN_LABEL)) {
          setIsAdmin(true);
        }
        setUserInfo(user);
        setUserLoading(false);
      })
      .catch(err => {
        setUserLoading(false);
        console.log(err);
      });
  };
  const setLogin = () => {
    getUser();
  };

  const logout = () => {
    setUserInfo(undefined);
    authService.logout();
    setIsAdmin(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: userInfo,
        isAdmin,
        setLogin,
        logout,
        isUserLoading,
      }}>
      {children}
    </UserContext.Provider>
  );
};
