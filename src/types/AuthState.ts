import { IUser } from "@/types/IUser";

export interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: false,
  error: string| null,
}