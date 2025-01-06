export enum TableNames {
  CHILDREN = 'children',
  SPONSORS = 'sponsors',
  SPONSORSHIPS = 'sponsorships',
  CHILD_ASSIGNMENT_REQUESTS = 'child_assignment_requests',
  MESSAGES = 'messages',
  ALBUM_MEDIA = 'album_media',
  TESTIMONIALS = 'temoignage',
  ACTIVITY_LOGS = 'activity_logs',
  SPONSORSHIP_REQUESTS = 'sponsorship_requests'
}

export type DatabaseTableName = keyof typeof TableNames;