"use client";

import UsersTable, { User } from "../../../components/UsersTable";

const cashiers: User[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: "Cashier " + (i + 1),
  phone: "+1 (415) 555-200" + i,
  email: `cashier${i + 1}@email.com`,
  avatar: "/avatar.png",
}));

export default function CashiersPage() {
  return <UsersTable title="Cashiers" users={cashiers} />;
}
