import { TextInput } from "@astryxdesign/core/TextInput";

interface SearchFormProps {
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
}

/** Controlled search input. Lifts the keyword up to `App` on every change. */
export function SearchForm({ keyword, onChangeKeyword }: SearchFormProps) {
  return (
    <TextInput
      type="search"
      size="lg"
      label="Tìm kiếm người dùng"
      placeholder="Tìm theo họ tên hoặc tên đăng nhập"
      value={keyword}
      onChange={onChangeKeyword}
      hasClear
      width="100%"
    />
  );
}
