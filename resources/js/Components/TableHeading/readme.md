import { TransactionsHeader } from "@/Components/TransactionsHeader";
import {
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
  FunnelIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <TableHeader
      searchValue=""
      onSearchChange={(v) => console.log(v)}
      actions={[
        {
          label: "Download",
          icon: <ArrowDownTrayIcon className="h-4 w-4" />,
          onClick: () => console.log("download"),
        },
        {
          label: "Add",
          icon: <PlusIcon className="h-4 w-4" />,
          variant: "secondary",
          onClick: () => console.log("add"),
        },
      ]}
      dropdownLabel="More"
      dropdownActions={[
        {
          label: "Edit columns",
          icon: <PencilSquareIcon className="h-4 w-4" />,
          onClick: () => console.log("edit columns"),
        },
        {
          label: "Filter",
          icon: <FunnelIcon className="h-4 w-4" />,
          onClick: () => console.log("filter"),
        },
        {
          label: "Delete selected",
          icon: <TrashIcon className="h-4 w-4" />,
          danger: true,
          onClick: () => console.log("delete selected"),
        },
      ]}
    />
  );
}
