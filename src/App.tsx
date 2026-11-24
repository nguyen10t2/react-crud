import { useEffect, useMemo, useState } from "react";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Pagination } from "@astryxdesign/core/Pagination";
import { HStack, Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { ResultTable } from "./components/ResultTable";
import { SearchForm } from "./components/SearchForm";
import { UserFormDialog } from "./components/UserFormDialog";
import { fetchUsers } from "./services/userService";
import type { User, UserFormValues } from "./types/user";

const PAGE_SIZE = 10;

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Load data once when the component mounts.
  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(keyword.toLowerCase()) ||
          u.username.toLowerCase().includes(keyword.toLowerCase()),
      ),
    [users, keyword],
  );
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Keep the newest or recently edited record first.
  const handleAdd = (values: UserFormValues) => {
    setUsers((prev) => [
      { ...values, id: prev.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1 },
      ...prev,
    ]);
    setPage(1);
  };

  const handleEdit = (id: number, values: UserFormValues) => {
    setUsers((prev) => [
      { ...values, id },
      ...prev.filter((user) => user.id !== id),
    ]);
    setPage(1);
    setEditing(null);
  };

  // DELETE: create a new array without the target id.
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Stack
      as="main"
      gap={4}
      padding={4}
      width="100%"
      maxWidth={1440}
      style={{ marginInline: "auto" }}
    >
      <Stack
        as="section"
        gap={4}
        padding={5}
        style={{
          background: "var(--color-background-surface)",
          border: "var(--border-width) solid var(--color-accent)",
          borderRadius: "var(--radius-container)",
        }}
      >
        <Grid columns={{ minWidth: 300, max: 2 }} gap={4} align="center">
          <Stack gap={2}>
            <Text type="label" color="accent">
              QUẢN LÝ HỆ THỐNG
            </Text>
            <Heading level={1} type="display-1">
              Quản lý người dùng
            </Heading>
            <Text color="secondary">
              Tìm kiếm, thêm mới và cập nhật thông tin người dùng.
            </Text>
          </Stack>
          <HStack hAlign="end">
            <Card padding={4}>
              <Stack gap={1}>
                <Text color="secondary">Tổng người dùng</Text>
                <Heading level={2} color="accent">
                  {users.length}
                </Heading>
              </Stack>
            </Card>
          </HStack>
        </Grid>
      </Stack>

      <Card padding={4}>
        <Stack gap={4}>
          <HStack hAlign="between" vAlign="center">
            <Heading level={2}>Danh sách người dùng</Heading>
            <Text color="secondary">{filteredUsers.length} kết quả</Text>
          </HStack>
          <Grid columns={{ minWidth: 300, max: 2 }} gap={3} align="center">
            <SearchForm
              keyword={keyword}
              onChangeKeyword={(value) => {
                setKeyword(value);
                setPage(1);
              }}
            />
            <HStack hAlign="end">
              <Button
                label="Thêm người dùng"
                variant="primary"
                size="lg"
                onClick={() => setIsAddOpen(true)}
              />
            </HStack>
          </Grid>
          {isLoading ? (
            <Text color="secondary">Đang tải...</Text>
          ) : (
            <ResultTable users={pageUsers} onEdit={setEditing} onDelete={handleDelete} />
          )}
          {filteredUsers.length > PAGE_SIZE && !isLoading && (
            <Grid columns={{ minWidth: 280, max: 2 }} gap={3} align="center">
              <Text color="secondary">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} trong {filteredUsers.length} người dùng
              </Text>
              <HStack hAlign="end">
                <Pagination
                  page={currentPage}
                  onChange={setPage}
                  totalItems={filteredUsers.length}
                  pageSize={PAGE_SIZE}
                  variant="pages"
                  label="Phân trang danh sách người dùng"
                />
              </HStack>
            </Grid>
          )}
        </Stack>
      </Card>

      {/* `key` remounts the dialog so each open starts from fresh/seeded values. */}
      <UserFormDialog
        key="add"
        title="Thêm người dùng"
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />
      {editing && (
        <UserFormDialog
          key="edit"
          title="Sửa người dùng"
          isOpen
          initialValues={{ ...editing, address: { ...editing.address } }}
          onClose={() => setEditing(null)}
          onSubmit={(values) => handleEdit(editing.id, values)}
        />
      )}
    </Stack>
  );
}
