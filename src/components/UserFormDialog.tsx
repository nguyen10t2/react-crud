import { useState } from "react";
import type { SVGProps } from "react";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutFooter } from "@astryxdesign/core/Layout";
import { HStack, Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import type { UserAddress, UserFormValues } from "../types/user";

function RequiredAsterisk(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      {...props}
    >
      <path d="M12 5v14M5.94 8l12.12 8M18.06 8L5.94 16" />
    </svg>
  );
}

function RequiredFieldLabel({ id, children }: { id: string; children: string }) {
  return (
    <label htmlFor={id}>
      <HStack as="span" gap={1} vAlign="center">
        <Text weight="semibold">{children}</Text>
        <Icon icon={RequiredAsterisk} size="xsm" color="error" />
      </HStack>
    </label>
  );
}

const EMPTY_FORM: UserFormValues = {
  name: "",
  username: "",
  email: "",
  address: { street: "", suite: "", city: "" },
  phone: "",
  website: "",
};

interface UserFormDialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  /** Seed the form. `undefined` resets to an empty form. */
  initialValues?: UserFormValues;
}

export function UserFormDialog({
  title,
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: UserFormDialogProps) {
  const [values, setValues] = useState<UserFormValues>(initialValues ?? EMPTY_FORM);
  const isAdding = title === "Thêm người dùng";

  const handleChange = (key: keyof UserFormValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressChange = (key: keyof UserAddress) => (value: string) => {
    setValues((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleSubmit = () => {
    if (values.name.trim() === "" || values.username.trim() === "") {
      alert("Vui lòng nhập họ tên và tên đăng nhập.");
      return;
    }
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      width="min(1080px, calc(100vw - 2rem))"
      maxHeight="90dvh"
      purpose="form"
    >
      <Layout
        header={
          <DialogHeader
            title={
              <Text as="span" size="3xl" weight="semibold">
                {title}
              </Text>
            }
            subtitle={
              <Text size="lg" color="secondary">
                {isAdding
                  ? "Nhập thông tin người dùng mới. Các trường có dấu * là bắt buộc."
                  : "Cập nhật thông tin người dùng."}
              </Text>
            }
            onOpenChange={() => onClose()}
          />
        }
        content={
          <LayoutContent label="Thông tin người dùng">
            <Stack gap={4} padding={4}>
              <Divider label="THÔNG TIN CƠ BẢN" />
              <Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
                <Stack gap={1}>
                  <RequiredFieldLabel id="user-name">Họ và tên</RequiredFieldLabel>
                  <TextInput
                    id="user-name"
                    label="Họ và tên"
                    value={values.name}
                    onChange={handleChange("name")}
                    htmlName="name"
                    size="lg"
                    isLabelHidden
                    isRequired
                  />
                </Stack>
                <Stack gap={1}>
                  <RequiredFieldLabel id="user-username">Tên đăng nhập</RequiredFieldLabel>
                  <TextInput
                    id="user-username"
                    label="Tên đăng nhập"
                    value={values.username}
                    onChange={handleChange("username")}
                    htmlName="username"
                    size="lg"
                    isLabelHidden
                    isRequired
                  />
                </Stack>
                <TextInput
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  htmlName="email"
                  size="lg"
                />
                <TextInput
                  label="Số điện thoại"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange("phone")}
                  htmlName="phone"
                  size="lg"
                />
              </Grid>
              <TextInput
                label="Website"
                type="url"
                value={values.website}
                onChange={handleChange("website")}
                htmlName="website"
                size="lg"
              />
              <Divider label="ĐỊA CHỈ" />
              <Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
                <TextInput
                  label="Tên đường"
                  value={values.address.street}
                  onChange={handleAddressChange("street")}
                  htmlName="street"
                  size="lg"
                />
                <TextInput
                  label="Số nhà / căn hộ"
                  value={values.address.suite}
                  onChange={handleAddressChange("suite")}
                  htmlName="suite"
                  size="lg"
                />
              </Grid>
              <TextInput
                label="Thành phố"
                value={values.address.city}
                onChange={handleAddressChange("city")}
                htmlName="city"
                size="lg"
              />
            </Stack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider padding={4} label="Tác vụ biểu mẫu">
            <HStack gap={3} hAlign="end">
              <Button label="Hủy" variant="secondary" size="lg" onClick={onClose} />
              <Button
                label={isAdding ? "Thêm người dùng" : "Lưu thay đổi"}
                variant="primary"
                size="lg"
                onClick={handleSubmit}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
