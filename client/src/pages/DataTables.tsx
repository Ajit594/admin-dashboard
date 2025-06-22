import { DataTable } from "@/components/DataTable";

export default function DataTables() {
  return (
    <div className="flex-1 overflow-auto">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Data Tables</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view your data with advanced table features.
          </p>
        </div>
      </header>

      <main className="p-4 lg:p-6">
        <DataTable />
      </main>
    </div>
  );
}
