export const sortBy = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
];

export const budgetCategory = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "personal Care",
  "Education",
];

export const budgetThemes = [
  { label: "Green", value: "#277C78", color: "#277C78" },
  { label: "Yellow", value: "#F2CDAC", color: "#F2CDAC" },
  { label: "Cyan", value: "#82C9D7", color: "#82C9D7" },
  { label: "Navy", value: "#626070", color: "#626070" },
  { label: "Red", value: "#C94736", color: "#C94736" },
  { label: "Purple", value: "#826CB0", color: "#826CB0" },
  { label: "Turquoise", value: "#597C7C", color: "#597C7C" },
];

export type Payment = {
  id: string;
  avatar: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  recurring: boolean;
  dueDate: string;
  status: string;
};

export interface TransactionArray {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;

  dueDate?: string;
  status?: "paid" | "unpaid" | "overdue";
  paidDate?: string | null;
}

export const category = [
  "All transactions",
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
];

export const payments: Payment[] = [
  {
    id: "8ytg",
    avatar: "/images/avatars/emma-richardson.jpg",
    name: "Emma Richardson",
    category: "General",
    date: "2026-02-19T14:23:11Z",
    amount: 75.5,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytgyyy",
    avatar: "/images/avatars/lily-ramirez.jpg",
    name: "Lily Ramirez",
    category: "General",
    date: "2026-02-14T13:05:27Z",
    amount: 50.0,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytgysdsdyy",
    avatar: "/images/avatars/ethan-clark.jpg",
    name: "Ethan Clark",
    category: "Dining Out",
    date: "2026-02-13T20:15:59Z",
    amount: -32.5,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytglklkyyy",
    avatar: "/images/avatars/james-thompson.jpg",
    name: "James Thompson",
    category: "Entertainment",
    date: "2026-02-11T15:45:38Z",
    amount: -5.0,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytgdfdfyyy",
    avatar: "/images/avatars/pixel-playground.jpg",
    name: "Pixel Playground",
    category: "Entertainment",
    date: "2026-02-11T18:45:38Z",
    amount: -10.0,
    recurring: true,
    dueDate: "2026-02-11T18:45:38Z",
    status: "paid",
  },
  {
    id: "8ytgdfdsdsdfyyy",
    avatar: "/images/avatars/ella-phillips.jpg",
    name: "Ella Phillips",
    category: "Dining Out",
    date: "2026-02-10T19:22:51Z",
    amount: -45.0,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytgdfdmkmkfyyy",
    avatar: "/images/avatars/sofia-peterson.jpg",
    name: "Sofia Peterson",
    category: "Transportation",
    date: "2026-02-08T08:55:17Z",
    amount: -15.0,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytgdfdwasasfyyy",
    avatar: "/images/avatars/mason-martinez.jpg",
    name: "Mason Martinez",
    category: "Lifestyle",
    date: "2026-02-07T17:40:29Z",
    amount: -35.25,
    recurring: false,
    dueDate: "",
    status: "",
  },
  {
    id: "8ytgsdsdsddfdfyyy",
    avatar: "/images/avatars/green-plate-eatery.jpg",
    name: "Green Plate Eatery",
    category: "Groceries",
    date: "2026-02-06T08:25:44Z",
    amount: -78.5,
    recurring: false,
    dueDate: "",
    status: "",
  },
];

//Array Types
