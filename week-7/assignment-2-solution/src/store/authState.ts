import { atom } from 'recoil';
import { AuthState } from '../components/Model';

export const authState = atom<AuthState>({
  key: 'authState',
  default: { token: null, username: null },
});