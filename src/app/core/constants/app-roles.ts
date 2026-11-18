export const AppRoles = {
  TEACHER: 'teacher',
  YOUNG_STN: 'yStn',
  EXP_STN: 'expStn'
} as const;

export type UserRole = typeof AppRoles[keyof typeof AppRoles];