import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { updateRole, deleteUser } from "../../feature/registerSlice";
export default function UserTable() {
  const users = useSelector((state) => state.register.users);
  const authuser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");

  const handleDelete = (username) => {
    dispatch(deleteUser(username));
  };

  const handleRoleChange = (username, role) => {
    dispatch(updateRole({ username, role }));
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  if (filteredUsers.length === 0) {
    return (
      <Card className="w-full h-fit max-w-8xl p-4 bg-slate-100 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <p className="text-gray-500">No users found.</p>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl p-6 bg-slate-100 shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setFilter("all")}
            className={`${filter === "all" ? "bg-slate-500 text-white" : ""}`}
          >
            All
          </Button>
          <Button
            size="sm"
            variant="primary"
            className={`${filter === "admin" ? "bg-slate-500 text-white" : ""}`}
            onClick={() => setFilter("admin")}
          >
            Admin
          </Button>
          <Button
            size="sm"
            variant="primary"
            className={`${filter === "user" ? "bg-slate-500 text-white" : ""}`}
            onClick={() => setFilter("user")}
          >
            User
          </Button>
        </div>
      </div>

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
          {filteredUsers.map((u, index) => (
            <TableRow key={u.id || index}>
              <TableCell>{u.id || index + 1}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell className="hidden sm:table-cell">{u.email}</TableCell>
              <TableCell>
                <Select
                  value={u.role}
                  onValueChange={(value) => handleRoleChange(u.username, value)}
                  disabled={u.username === authuser?.username}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-100">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="second"
                  size="sm"
                  onClick={() => handleDelete(u.username)}
                  disabled={u.username === authuser?.username}
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
