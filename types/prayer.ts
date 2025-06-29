export type PrayerStatus = 'jamaah' | 'alone' | 'late' | 'missed';

export type Prayer = {
  name: string;
  arabicName: string;
  time: string;
  status?: PrayerStatus;
};

export type DayPrayers = {
  date: string;
  prayers: Prayer[];
};

export type MonthlyStats = {
  totalPrayers: number;
  onTime: number;
  jamaah: number;
  late: number;
  missed: number;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isPrivate: boolean;
};

export type Friend = User & {
  status: 'pending' | 'accepted' | 'blocked';
  canViewPrayers: boolean;
};