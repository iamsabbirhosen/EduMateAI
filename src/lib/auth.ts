export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student';
  language: 'Bangla' | 'English';
  class?: number;
}

export const DUMMY_USERS: User[] = [
  {
    id: '1',
    email: 'arif@student.com',
    name: 'Arif',
    role: 'student',
    language: 'Bangla',
    class: 12,
  },
  {
    id: '2',
    email: 'sumi@student.com',
    name: 'Sumi',
    role: 'student',
    language: 'English',
    class: 11,
  },
  {
    id: '3',
    email: 'tanjim@student.com',
    name: 'Tanjim',
    role: 'student',
    language: 'Bangla',
    class: 10,
  },
];
