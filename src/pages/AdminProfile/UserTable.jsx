import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserTable({ users }) {
  const [localUsers, setLocalUsers] = useState(users);

  const handleDelete = (id) => {
    setLocalUsers(localUsers.filter((u) => u.id !== id));
  };

  const handleRoleChange = (id, newRole) => {
    setLocalUsers(
      localUsers.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="w-full max-w-6xl p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localUsers.map((u, index) => (
            <TableRow key={u.id || index}>
              <TableCell>{u.id || index + 1}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell className="hidden sm:table-cell">{u.email}</TableCell>
              <TableCell>
                <Select
                  value={u.role}
                  onValueChange={(value) => handleRoleChange(u.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="second"
                  size="sm"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
