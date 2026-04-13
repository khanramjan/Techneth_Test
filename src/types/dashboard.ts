export type RailItem = {
  id: number;
  icon: string;
  active?: boolean;
  dot?: boolean;
};

export type Contact = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

export type ContactSection = {
  id: number;
  title: string;
  count: number;
  contacts: Contact[];
};

export type ContactMeta = {
  id: number;
  icon: string;
  label: string;
  value: string;
};

export type SelectedContact = {
  name: string;
  role: string;
  avatar: string;
  meta: ContactMeta[];
  tabs: string[];
};

export type AnalyticsPoint = {
  label: string;
  score: number;
  started: number;
  lost: number;
  won: number;
  focus: number;
};

export type AnalyticsData = {
  averageScore: number;
  delta: string;
  range: string;
  series: AnalyticsPoint[];
};

export type DealMetric = {
  id: number;
  label: string;
  value: number;
  progress: number;
  accent: string;
  delta: string;
};

export type NoteTask = {
  id: number;
  text: string;
  time: string;
  done: boolean;
};

export type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  time: string;
  mine: boolean;
};

export type ChatAttachment = {
  id: number;
  title: string;
};

export type DashboardData = {
  brand: string;
  searchPlaceholder: string;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  railItems: RailItem[];
  contactSections: ContactSection[];
  selectedContact: SelectedContact;
  analytics: AnalyticsData;
  dealMetrics: DealMetric[];
  tasks: NoteTask[];
  chat: {
    messages: ChatMessage[];
    attachments: ChatAttachment[];
  };
  property: {
    title: string;
    image: string;
  };
}
