import { useState } from "react";
import { useSelector } from "react-redux";
import API from "../../api/axios";
import toast from "react-hot-toast";
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

export default function UserTable({ users, fetchUsers }) {
  const [filter, setFilter] = useState("all");
  const authuser = useSelector((state) => state.auth.user);

  // Delete a user
  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`/users/${id}`);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  // Update role
  const handleRoleChange = async (id, role) => {
    try {
      await API.patch(`/users/${id}`, { role });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  // Filtered users
  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) =>
          filter === "admin"
            ? u.role === "admin" || u.role === "master_admin"
            : u.role === filter
        );

  // Filter buttons
  const roles = ["all", "admin", "user"];

  return (
    <div className="w-full max-w-6xl p-6 bg-slate-100 shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex gap-2">
          {roles.map((r) => (
            <Button
              key={r}
              size="sm"
              variant="primary"
              onClick={() => setFilter(r)}
              className={`${filter === r ? "bg-slate-500 text-white" : ""}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className=" bg-slate-100">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
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
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(value) => handleRoleChange(u._id, value)}
                    disabled={
                      u._id === authuser?._id || u.role === "master_admin"
                    }
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
                    onClick={() => handleDelete(u._id)}
                    disabled={
                      u._id === authuser?._id || u.role === "master_admin"
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
