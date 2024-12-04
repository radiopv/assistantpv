export const PROTECTED_ROUTES = [
  '/dashboard',
  '/sponsor-dashboard', 
  '/children/add',
  '/donations',
  '/rewards',
  '/messages',
  '/media-management',
  '/sponsors-management',
  '/settings',
  '/urgent-needs',
  '/permissions'
] as const;

export const ROLE_REDIRECTS = {
  admin: '/dashboard',
  sponsor: '/sponsor-dashboard',
  assistant: '/dashboard'
} as const;