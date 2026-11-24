import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/Stack";
import { pixel, proportional, Table } from "@astryxdesign/core/Table";
import type { TableColumn } from "@astryxdesign/core/Table";
import type { User } from "../types/user";

/** `User` extended to satisfy Table's `Record<string, unknown>` constraint. */
type UserRow = User & Record<string, unknown>;
const displayOrDash = (value?: string | null) => value?.trim() || "—";

interface ResultTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export function ResultTable({ users, onEdit, onDelete }: ResultTableProps) {
  const columns: TableColumn<UserRow>[] = [
    {
      key: "id",
      header: "Mã",
      width: pixel(72),
      renderCell: (user) => `#${user.id}`,
    },
    {
      key: "name",
      header: "Họ và tên",
      width: proportional(1, { minWidth: 160 }),
      renderCell: (user) => displayOrDash(user.name),
    },
    {
      key: "username",
      header: "Tên đăng nhập",
      width: proportional(1, { minWidth: 150 }),
      renderCell: (user) => displayOrDash(user.username),
    },
    {
      key: "email",
      header: "Email",
      width: proportional(1.5, { minWidth: 200 }),
      renderCell: (user) => displayOrDash(user.email),
    },
    {
      key: "address",
      header: "Địa chỉ",
      width: proportional(1.5, { minWidth: 230 }),
      renderCell: (user) => {
        const parts = [user.address?.street, user.address?.suite, user.address?.city]
          .map((part) => part?.trim())
          .filter(Boolean);
        return parts.join(", ") || "—";
      },
    },
    {
      key: "phone",
      header: "Số điện thoại",
      width: proportional(1, { minWidth: 180 }),
      renderCell: (user) => displayOrDash(user.phone),
    },
    {
      key: "actions",
      header: "Thao tác",
      width: pixel(176),
      align: "end",
      renderCell: (user) => (
        <HStack gap={2} hAlign="end">
          <Button label="Sửa" variant="secondary" onClick={() => onEdit(user)} />
          <Button label="Xóa" variant="destructive" onClick={() => onDelete(user.id)} />
        </HStack>
      ),
    },
  ];

  return (
    <Table
      data={users as UserRow[]}
      columns={columns}
      idKey="id"
      hasHover
      density="balanced"
      emptyState={
        <Heading level={4} color="secondary">
          Không có người dùng nào
        </Heading>
      }
    />
  );
}
