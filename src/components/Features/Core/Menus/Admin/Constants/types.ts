import { MenuTreeItem } from "@/hooks/data/system/useMenus";
import { EditTarget } from "@/hooks/crud/useFormModal";

export interface Menu {
  id: string;
  code: string;
  name: string;
  path?: string | null;
  apiPath?: string | null;
  icon?: string | null;
  type?: string;
  status?: string;
  parentId?: string | null;
  sortOrder?: number;
  isPublic?: boolean;
  showInMenu?: boolean;
  requiredPermissionCode?: string | null;
  group?: string;
  parent?: { id: string; name: string; code: string };
  displayName?: string;
}

export interface AdminMenusProps {
  title?: string;
  createButtonText?: string;
}

export interface MenuFormProps {
  show: boolean;
  menu?: Menu | null;
  statusEnums?: Array<{ value: string; label: string }>;
  parentMenus?: MenuTreeItem[];
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export interface CreateMenuProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  parentMenus?: MenuTreeItem[];
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditMenuProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  parentMenus?: MenuTreeItem[];
  onSuccess?: () => void;
  onClose?: () => void;
}

