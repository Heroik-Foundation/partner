export type Event = {
  __v: number;
  _id: string;
  address: string;
  admin: {
    _id: string;
    email: string;
    fullname: string;
    photo: string;
  };
  adminType: string;
  category: string;
  createdAt: string;
  description: string;
  endTime: string;
  eventEndDate: string;
  eventPledge: {
    organizations: string[];
    totalPledgedAmount: number;
  };
  eventTicket: {
    availableTickets: number;
    ticketPrice: number;
  };
  fundRaiser: {
    organizations: string[];
    fundRaised: number;
    goalReached: boolean;
  };
  invitees: string[];
  members: Array<{
    _id: string;
    fullname: string;
    photo: string;
  }>;
  minimumPledge: number;
  name: string;
  photo: string;
  privacy: string;
  signUpLimit: number;
  updatedAt: string;
};

export type Channel = {
  adminType: string;
  members: Array<{
    _id: string;
    fullname: string;
    photo: string;
  }>;
  invitees: string[];
  moderators: string[];
  privacy: string;
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

export type UserLocation = {
  type: string;
  coordinates: [number, number];
};

export type User = {
  accountClaimed: boolean;
  address: string;
  createdAt: string;
  email: string;
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
  attachments: string[];
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
  owner: {
    name: string;
    charityRegNumber: string;
    email: string;
    postalCode: string;
    country: string;
    city: string;
    address: string;
    pinSet: true;
    loc: {
      type: string;
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
  createdAt: string;
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
