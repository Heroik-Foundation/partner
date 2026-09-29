import { CurrencyCode } from "@/stores/currency";

export type EventOrganization = {
  fundRaised: number;
  totalDonations: number;
  _id: string;
  name: string;
  charityRegNumber: string;
  email: string;
  description: string;
  logo: string;
};

export type EventOrganization = {
  _id: string;
  name: string;
  charityRegNumber: string;
  email: string;
  description: string;
  logo: string;
  address: string;
  fundRaised: number;
  totalDonations: number;
};

export type EventSubcategory = {
  _id: string;
  name: string;
  image?: string;
};

export type EventCategory = {
  _id: string;
  name: string;
  image: string;
  subcategories: string[];
};

export type EventTicketing = {
  _id: string;
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  spotsLeft: number;
  isPayedTicket: boolean;
  ticketDetails?: string;
  absorbFees: boolean;
  salesStartDate: string;
  salesEndDate: string;
};

export type EventRecurrence = {
  _id: string;
  frequency: string; // e.g. "WEEKLY"
  interval: number;
  daysOfWeek: number[]; // e.g. [3, 5]
  endType: string; // e.g. "AFTER_OCCURRENCES"
  totalOccurrences: number;
  occurrenceCount: number;
};

export type Event = {
  absorbFees: boolean;
  __v: number;
  _id: string;

  // Core fields
  photo?: string;
  admin: {
    _id: string;
    email: string;
    name: string;
    photo: string;
    address: string;
  } | null;
  adminType: string;
  category: EventCategory;
  subcategory?: EventSubcategory | null;
  subCategory?: EventSubcategory | null;
  createdAt: string;
  description: string;
  endTime: string;
  eventEndDate: string;

  eventPledge: {
    organizations: EventOrganization[];
    totalPledgedAmount: number;
    minimumPledge: number;
  };
  fundRaiser: {
    recipientCharities: string[];
    organizations: any[];
    fundRaised: number;
    goalReached: boolean;
  };

  invitees: string[];
  members: Array<{
    _id: string;
    fullname: string;
    photo: string;
  }>;

  currency: CurrencyCode;
  eventStatus: "canceled" | "upcoming" | "ongoing" | "past";
  name: string;
  privacy: string;
  isTicketed: boolean;
  isRecurring: boolean;
  isPrimaryEvent: boolean;
  primaryEventId: string;
  ticketing: EventTicketing[];
  recurrence: EventRecurrence;
  isRefundable: boolean;

  updatedAt: string;
} & (
    | {
      address: string;
      loc: {
        type: "Point";
        coordinates: [number, number];
      };
      meetingLink?: never;
    }
    | {
      meetingLink: string;
      address?: never;
      loc?: never;
    }
  );

export type Channel = {
  adminType: string;
  members: Array<{
    _id: string;
    fullname: string;
    photo: string;
  }>;
  invitees: string[];
  moderators: string[];
  privacy: "invite-only" | "public";
  _id: string;
  interests: string[];
  name: string;
  description: string;
  admin: {
    _id: string;
    name: string;
    charityRegNumber: string;
    email: string;
    description: string;
    logo: string;
  };
  photo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Location = {
  type: string;
  coordinates: [number, number];
};

export type CurrentUser = {
  _id: string;
  fullname: string;
  username: string;
  phone: string;
  photo: string;
  birthDate: string;
  callingCode: string;
  isAdmin: boolean;
  blocked: boolean;
  isAccountSetup: boolean;
  role: string;
  loc: {
    type: "Point";
    coordinates: [number, number];
  };
  email: string;
  blockedUsers: string[];
  followers: string[];
  following: string[];
};

export type User = {
  accountClaimed: boolean;
  address: string;
  createdAt: string;
  email: string;
  bio: string;
  eventsPerYear: number;
  isVerified: boolean;
  logo: string;
  name: string;
  telephone: string;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
};

export type Post = {
  __v: number;
  _id: string;
  attachments: {
    createdAt: string;
    image: string;
    updatedAt: string;
    __v: number;
    _id: string;
  }[];
  comments: string[];
  community: {
    adminType: string;
    members: string[];
    invitees: string[];
    moderators: string[];
    privacy: string;
  };
  content: string;
  createdAt: string;
  isAnnouncement: boolean;
  key?: string;
  likes: string[];
  updatedAt: string;
  user: {
    _id: string;
    email: string;
    photo: string;
    fullname: string;
  };
  userType: string;
};

export type Charity = {
  _id: string;
  userId: string;
  name: string;
  logo: string;
  charityRegNumber: string;
  email: string;
  postalCode: string;
  country: string;
  city: string;
  address: string;
  loc: {
    lat: number;
    long: number;
  };
  description: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  sortCode: string;
  accountClaimed: boolean;
};

export type Comment = {
  __v: number;
  _id: string;
  content: string;
  createdAt: string;
  likes: string[];
  post: string;
  replies: any[];
  updatedAt: string;
  user: {
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    isActive: boolean;
    isAdmin: boolean;
    blocked: boolean;
    isDeleted: boolean;
    [key: string]: any;
  };
};

export type Member = {
  _id: string;
  fullname: string;
  username: string;
  phone: string;
  photo: string;
  birthDate: string; // ISO date string
  callingCode: string;
  isAdmin: boolean;
  blocked: boolean;
  isAccountSetup: boolean;
  role: string;
  loc: {
    type: string;
    coordinates: [number, number];
  };
  email: string;
  blockedUsers: string[];
  followers: string[];
  following: string[];
};

export type Wallet = {
  _id: string;
  currency: "gbp";
  owner: {
    name: string;
    charityRegNumber: string;
    email: string;
    postalCode: string;
    country: string;
    city: string;
    address: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    subcategories: string[];
    description: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    sortCode: string;
    fundRaised: string;
    totalDonations: string;
    incomeCategory: string;
    annualIncome: string;
    accountClaimed: boolean;
    latitude: string;
    longitude: string;
    pinSet: boolean;
  };
  ownerType: string;
  balance: number;
};

export type TicketSale = {
  _id: string;
  event: {
    _id: string;
    photo: string;
    name: string;
    description: string;
    fundRaiser: {
      fundRaised: number;
      goalReached: boolean;
      fundRaisingGoal: number;
      organizations: string[];
    };
    eventTicket: {
      totalTicket: number;
      availableTickets: number;
      ticketPrice: number;
    };
    eventPledge: {
      minimumPledge: number;
      totalPledgedAmount: number;
      organizations: string[];
    };
    organization: string;
    category: {
      _id: string;
      image: string;
      name: string;
      subcategories: {
        _id: string;
        image: string;
        name: string;
      }[];
    };
    subcategory: {
      _id: string;
      image: string;
      name: string;
    };
    signUpLimit: string;
    eventEndDate: string;
    privacy: string;
    endTime: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    members: string[];
    community: {
      _id: string;
      members: string[];
      invitees: string[];
      moderators: string[];
      name: string;
      description: string;
      privacy: string;
      admin: {
        _id: string;
        fullname: string;
        username: string;
        phone: string;
        photo: string;
        birthDate: string;
        callingCode: string;
        isAdmin: boolean;
        blocked: boolean;
        isAccountSetup: boolean;
        role: string;
        loc: {
          type: "Point";
          coordinates: [number, number];
        };
        email: string;
        blockedUsers: string[];
        followers: string[];
        following: string[];
      };
      posts: {
        totalPosts: number;
      }[];
      totalMembers: number;
      totalPosts: number;
    };
    admin: string;
  };
  user: string;
  totalTickets: number;
  tickets: string[];
  createdAt: string;
};

export type WithdrawalLog = {
  organization: {
    name: string;
    charityRegNumber: string;
    email: string;
    postalCode: string;
    country: string;
    city: string;
    address: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    subcategories: string[];
    description: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    sortCode: string;
    fundRaised: string;
    totalDonations: string;
    incomeCategory: string;
    annualIncome: string;
    accountClaimed: boolean;
    latitude: string;
    longitude: string;
    pinSet: boolean;
  };
  eventPartner: {
    name: string;
    logo: string;
    bio: string;
    address: string;
    email: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    sortCode: string;
    telephone: string;
    eventsPerYear: number;
    pinSet: boolean;
  };
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  sortCode: string;
  currency: CurrencyCode;
  createdAt: string;
};

export type Category = {
  _id: string;
  image: string;
  name: string;
  subcategories: {
    _id: string;
    image: string;
    name: string;
  }[];
};

export type Caller = {
  name: string;
  charityRegNumber: string;
  email: string;
  postalCode: string;
  country: string;
  city: string;
  address: string;
  loc: Location;
  subcategories: string[];
  description: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  sortCode: string;
  fundRaised: string;
  totalDonations: string;
  incomeCategory: string;
  annualIncome: string;
  accountClaimed: boolean;
  latitude: string;
  longitude: string;
  pinSet: boolean;
};

export type ScannedTicket = {
  _id: string;
  event: string;
  attendee: string;
  ticketId: string;
  callerType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: {
    _id: string;
    fullname: string;
    photo: string;
  };
  caller: {
    _id: string;
    name: string;
    logo: string;
  };
};

export type Conversation = {
  _id: string;
  participants: {
    participantType: "User" | "EventPartner";
    event?: Event;
    participant: {
      _id: string;
      createdAt: string;
      fullname?: string;
      photo?: string;
      name?: string;
      logo?: string;
    };
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage: {
    senderType: "User" | "EventPartner";
    recipientType: "User" | "EventPartner";
    status: "unread" | "read";
    _id: string;
    conversation: string;
    message: string;
    sender: string;
    recipient: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  unreadMessages: number;
};

export type EventTicket = {
  _id: string;
  event: Event;
  user: {
    _id: string;
    fullname: string;
    username: string;
    phone: string;
    photo: string;
    birthDate: string;
    callingCode: string;
    isAdmin: boolean;
    blocked: boolean;
    isAccountSetup: boolean;
    role: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    email: string;
    blockedUsers: string[];
    followers: string[];
    following: string[];
  };
  totalTickets: number;
  ticketType: {
    ticketType: string;
    ticketPrice: number;
    signUpLimit: number;
    salesStartDate: string;
    salesEndDate: string;
  };
  tickets: {
    code: string;
    isGifted: boolean;
    giftedBy: string;
    giftedAt: string;
  }[];
  updatedAt: string;
};

export type EventMessageUser = {
  _id: string;
  fullname: string;
  username: string;
  phone: string;
  photo: string;
  birthDate: string;
  callingCode: string;
  isAdmin: boolean;
  blocked: boolean;
  isAccountSetup: boolean;
  role: string;
  loc: Location;
  email: string;
  blockedUsers: string[];
  followers: string[];
  following: string[];
};

export interface Message {
  _id: string;
  sender: EventMessageUser;
  senderType: string;
  recipient: EventMessageUser;
  recipientType: string;
  conversation: Conversation;
  message: string;
  attachment: string;
  replying: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type Notification = {
  _id: string;
  recipient: {
    _id: string;
    fullname: string;
    username: string;
    phone: string;
    photo: string;
    birthDate: string;
    callingCode: string;
    isAdmin: boolean;
    blocked: boolean;
    isAccountSetup: boolean;
    role: string;
    loc: Location;
    email: string;
    blockedUsers: string[];
    followers: string[];
    following: string[];
  };
  message: string;
  title: string;
  type:
  | "FOLLOW"
  | "EVENT_INVITE"
  | "EVENT_UPDATE"
  | "EVENT_STARTED"
  | "COMMUNITY_INVITE"
  | "NEW_LIKE"
  | "NEW_COMMENT"
  | "POST_REPORT"
  | "COMMUNITY_REPORT"
  | "NEW_PAYMENT"
  | "NEW_CHAT"
  | "NEW_DONATION"
  | "NEW_POST";
  actionId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NestedPaginatedResponse<T, K extends string = "name"> = {
  [key in K]: {
    currentPage: number;
    data: T[];
    totalCount: number;
    totalPages: number;
  };
};

export type PaginatedResponse<T> = {
  currentPage: number;
  data: T[];
  totalCount: number;
  totalPages: number;
};
