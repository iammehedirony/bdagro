
 export interface User {
    id: string;
    name: string;
    role: string;
    roleType: 'admin' | 'farmer' | 'investor';
  }