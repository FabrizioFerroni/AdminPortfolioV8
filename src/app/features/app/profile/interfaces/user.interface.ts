export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileDto {
  name: string;
  lastname: string;
  email: string;
}
