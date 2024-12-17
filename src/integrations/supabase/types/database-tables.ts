import { Database } from './database';

export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];
export type Functions = Database['public']['Functions'];
export type Enums = Database['public']['Enums'];

export const TableNames = {
  CHILD_ASSIGNMENT_REQUESTS: 'child_assignment_requests',
  SPONSORSHIP_REQUESTS: 'sponsorship_requests',
  CHILDREN: 'children',
  SPONSORS: 'sponsors',
  SPONSORSHIPS: 'sponsorships',
  CHAT_ROOMS: 'chat_rooms',
  CHAT_MESSAGES: 'chat_messages',
  CHAT_ROOM_PARTICIPANTS: 'chat_room_participants',
  NOTIFICATIONS: 'notifications',
  EMAIL_QUEUE: 'email_queue',
  EMAIL_TEMPLATES: 'email_templates',
  MESSAGES: 'messages',
  MESSAGE_ATTACHMENTS: 'message_attachments',
  MESSAGE_TEMPLATES: 'message_templates',
  MESSAGES_RECIPIENTS: 'messages_recipients',
  PERMISSIONS: 'permissions',
  PROFILES: 'profiles',
  ROLE_PERMISSIONS: 'role_permissions',
  USER_ROLES: 'user_roles',
  BADGES: 'badges',
  USER_ACHIEVEMENTS: 'user_achievements',
  SPONSOR_LEVELS: 'sponsor_levels',
  LOCATIONS: 'locations',
  DONATIONS: 'donations',
  DONATION_ITEMS: 'donation_items',
  DONATION_LOCATIONS: 'donation_locations',
  DONATION_PHOTOS: 'donation_photos',
  DONATION_VIDEOS: 'donation_videos',
  DONORS: 'donors',
  AID_CATEGORIES: 'aid_categories',
  NEED_CATEGORIES: 'need_categories',
  ALBUM_MEDIA: 'album_media',
  MEMORIES: 'memories',
  SPONSOR_MEMORIES: 'sponsor_memories',
  TESTIMONIALS: 'testimonials',
  BIRTHDAY_REMINDERS: 'birthday_reminders',
  REMINDER_PREFERENCES: 'reminder_preferences',
  SCHEDULED_TASKS: 'scheduled_tasks',
  SCHEDULED_VISITS: 'scheduled_visits',
  SITE_CONFIG: 'site_config',
  STATISTICS_CONFIG: 'statistics_config',
  PAGE_CONFIG: 'page_config',
  HOMEPAGE_CONFIG: 'homepage_config',
  HOME_IMAGES: 'home_images',
  FAQ: 'faq',
  LINK_CHECKER: 'link_checker',
  MEDIA_ITEMS: 'media_items',
  UNIFIED_MEDIA_BROWSER: 'unified_media_browser',
  ACTIVITY_LOGS: 'activity_logs',
  TEMOIGNAGE: 'temoignage'
} as const;

export type TableName = keyof Tables | 'child_assignment_requests' | 'sponsorship_requests';
export type ViewName = keyof Views;