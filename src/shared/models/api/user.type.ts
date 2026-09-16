export type EditProfileRequest = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

export type UserResponse = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
};

export type EditPasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type SearchUsersRequest = {
  login: string;
};
