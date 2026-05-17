import { EditTarget } from "@/hooks/crud/useFormModal";

export interface Group {
  id: number | string;
  type?: string;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
  ownerId?: string | number | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  displayName?: string;
}

export interface GroupFormProps {
  show: boolean;
  group?: Group | null;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export interface AdminGroupsProps {
  title?: string;
  createButtonText?: string;
}

export interface CreateGroupProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditGroupProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}
