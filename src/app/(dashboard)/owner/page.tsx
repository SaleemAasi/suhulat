"use client";

import UsersTable, { User } from "../../../components/UsersTable";

const owners: User[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: "Owner " + (i + 1),
  phone: "+1 (415) 555-000" + i,
  email: `owner${i + 1}@email.com`,
  avatar: "/avatar.png",
}));

export default function OwnersPage() {
  return <UsersTable title="Owners" users={owners} />;
}
