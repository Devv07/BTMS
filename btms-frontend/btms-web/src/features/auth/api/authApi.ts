import api from "../../../api/axios";

import type {
  LoginRequest,
  LoginResponse,
} from "../types/auth.types";

export const login = async (
  data: LoginRequest
) => {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      data
    );

  return response.data;
};