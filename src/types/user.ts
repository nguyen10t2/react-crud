export interface UserAddress {
  street: string;
  suite: string;
  city: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: UserAddress;
  phone: string;
  website: string;
}

/** Form values are the editable subset of a user (no id until saved). */
export type UserFormValues = Omit<User, "id">;
