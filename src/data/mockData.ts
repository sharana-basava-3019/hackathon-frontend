import type { User, Resource, Comment, DashboardData, LeaderboardEntry } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul@college.edu',
  branch: 'Computer Science',
  semester: 5,
  contributionPoints: 245,
  createdAt: '2025-08-15T10:00:00Z',
};

const mockUsers: User[] = [
  mockUser,
  { id: '2', name: 'Priya Patel', email: 'priya@college.edu', branch: 'Electronics', semester: 4, contributionPoints: 320, createdAt: '2025-07-10T10:00:00Z' },
  { id: '3', name: 'Amit Kumar', email: 'amit@college.edu', branch: 'Mechanical', semester: 6, contributionPoints: 180, createdAt: '2025-09-01T10:00:00Z' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha@college.edu', branch: 'Computer Science', semester: 3, contributionPoints: 410, createdAt: '2025-06-20T10:00:00Z' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@college.edu', branch: 'Information Technology', semester: 7, contributionPoints: 290, createdAt: '2025-05-15T10:00:00Z' },
];

export const mockResources: Resource[] = [
  {
    id: '1', title: 'Data Structures Notes Unit 1-3', subject: 'Data Structures & Algorithms', branch: 'Computer Science', semester: 3,
    type: 'notes', description: 'Comprehensive notes covering arrays, linked lists, stacks, queues, and trees with examples.',
    fileUrl: '#', fileName: 'DSA_Notes.pdf', fileSize: 2400000, uploadedBy: mockUsers[0],
    downloads: 156, rating: 4.5, ratingCount: 32, bookmarked: false, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: '2', title: 'Previous Year Question Paper - DBMS', subject: 'Database Management Systems', branch: 'Computer Science', semester: 4,
    type: 'paper', description: 'Collection of last 5 years question papers for DBMS with solutions.',
    fileUrl: '#', fileName: 'DBMS_PYQ.pdf', fileSize: 5100000, uploadedBy: mockUsers[1],
    downloads: 230, rating: 4.8, ratingCount: 45, bookmarked: true, createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: '3', title: 'Digital Electronics Assignment Solutions', subject: 'Digital Electronics', branch: 'Electronics', semester: 3,
    type: 'assignment', description: 'Complete solutions for DE assignment 1 to 5 with circuit diagrams.',
    fileUrl: '#', fileName: 'DE_Assignments.pdf', fileSize: 3200000, uploadedBy: mockUsers[2],
    downloads: 89, rating: 4.2, ratingCount: 18, bookmarked: false, createdAt: '2025-12-20T10:00:00Z', updatedAt: '2025-12-20T10:00:00Z',
  },
  {
    id: '4', title: 'Operating Systems Textbook Notes', subject: 'Operating Systems', branch: 'Computer Science', semester: 5,
    type: 'book', description: 'Summarized notes from Galvin OS textbook covering all important chapters.',
    fileUrl: '#', fileName: 'OS_Book_Notes.pdf', fileSize: 4800000, uploadedBy: mockUsers[3],
    downloads: 312, rating: 4.9, ratingCount: 67, bookmarked: true, createdAt: '2025-12-15T10:00:00Z', updatedAt: '2025-12-15T10:00:00Z',
  },
  {
    id: '5', title: 'Thermodynamics Lab Manual', subject: 'Thermodynamics', branch: 'Mechanical', semester: 4,
    type: 'notes', description: 'Complete lab manual with experiment procedures and observations.',
    fileUrl: '#', fileName: 'Thermo_Lab.pdf', fileSize: 1800000, uploadedBy: mockUsers[4],
    downloads: 67, rating: 3.8, ratingCount: 12, bookmarked: false, createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-11-28T10:00:00Z',
  },
  {
    id: '6', title: 'Computer Networks Complete Notes', subject: 'Computer Networks', branch: 'Information Technology', semester: 5,
    type: 'notes', description: 'All units covered with diagrams and protocol explanations.',
    fileUrl: '#', fileName: 'CN_Notes.pdf', fileSize: 3600000, uploadedBy: mockUsers[4],
    downloads: 198, rating: 4.6, ratingCount: 38, bookmarked: false, createdAt: '2025-11-15T10:00:00Z', updatedAt: '2025-11-15T10:00:00Z',
  },
];

export const mockComments: Comment[] = [
  { id: '1', content: 'These notes are really helpful! Covered everything for my exam.', user: mockUsers[1], createdAt: '2026-01-12T10:00:00Z' },
  { id: '2', content: 'Great resource, but could use more examples on trees.', user: mockUsers[2], createdAt: '2026-01-13T14:00:00Z' },
  { id: '3', content: 'Thanks for sharing! Saved me a lot of time.', user: mockUsers[3], createdAt: '2026-01-14T09:00:00Z' },
];

export const mockDashboardData: DashboardData = {
  contributionPoints: mockUser.contributionPoints,
  recentUploads: mockResources.filter(r => r.uploadedBy.id === mockUser.id),
  trendingResources: [...mockResources].sort((a, b) => b.downloads - a.downloads).slice(0, 4),
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: mockUsers[3], points: 410 },
  { rank: 2, user: mockUsers[1], points: 320 },
  { rank: 3, user: mockUsers[4], points: 290 },
  { rank: 4, user: mockUsers[0], points: 245 },
  { rank: 5, user: mockUsers[2], points: 180 },
];
