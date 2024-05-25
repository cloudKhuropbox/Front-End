import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    userId: null,
    userName: null,
    token: null,
  },
});