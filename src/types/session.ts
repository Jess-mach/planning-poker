export type UserRole = 'facilitator' | 'voter' | 'observer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  hasVoted: boolean;
  vote?: number | string;
}

export interface Session {
  id: string;
  name: string;
  deckType: 'fibonacci' | 'powersOf2' | 'tshirt';
  users: User[];
  isRevealed: boolean;
  facilitatorId: string;
}

