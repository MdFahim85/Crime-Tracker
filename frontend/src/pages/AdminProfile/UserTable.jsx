import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../api/axios";
import UserModal from "./UserModal";
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
import { Pagination } from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Users, Filter, Trash2, Crown, User, Shield, Mail } from "lucide-react";

export default function UserTable({ fetchUsers }) {
  const [filter, setFilter] = useState("all");
  const authuser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [userId, setUserId] = useState(null);
  const fetchPageUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users?page=${page}&limit=10`);
      setUsers(res.data.users);
      setNext(res.data.next);
      setPrev(res.data.prev);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageUsers();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await API.delete(`/users/${id}`);
      toast.success(response.data.message);
      fetchUsers();
      fetchPageUsers();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await API.patch(`/users/${id}`, { role });
      toast.success("Role updated successfully");
      fetchUsers();
      fetchPageUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating role");
    }
  };

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) =>
          filter === "admin"
            ? u.role === "admin" || u.role === "master_admin"
            : u.role === filter
        );

  const roles = [
    { value: "all", label: "All Users", icon: Users },
    { value: "admin", label: "Admins", icon: Shield },
    { value: "user", label: "Users", icon: User },
  ];

  const getRoleIcon = (role) => {
    if (role === "master_admin")
      return <Crown className="h-4 w-4 text-yellow-600" />;
    if (role === "admin") return <Shield className="h-4 w-4 text-blue-600" />;
    return <User className="h-4 w-4 text-gray-600" />;
  };

  const getRoleBadgeStyle = (role) => {
    if (role === "master_admin")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (role === "admin") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                User Management
              </h2>
              <p className="text-sm text-gray-600">
                Manage user roles and permissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-2">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <Button
                    key={role.value}
                    size="sm"
                    variant="outline"
                    onClick={() => setFilter(role.value)}
                    className={`transition-all duration-200 ${
                      filter === role.value
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {role.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mx-4">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filter
            </p>
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700 w-16">
                  #
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                </TableHead>
                <TableHead className="hidden sm:table-cell font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((u, index) => {
                const globalIndex = (page - 1) * 10 + index + 1;
                const isCurrentUser = u._id === authuser?._id;
                const isMasterAdmin = u.role === "master_admin";
                const isDisabled = isCurrentUser || isMasterAdmin;

                return (
                  <TableRow
                    key={u._id}
                    className={`group hover:bg-slate-50 transition-all duration-200 ${
                      isCurrentUser
                        ? "bg-blue-50/50 border-l-4 border-blue-400"
                        : ""
                    }`}
                  >
                    <TableCell className="font-medium text-gray-600">
                      {globalIndex}
                    </TableCell>
                    <TableCell
                      onClick={() => setUserId(u._id)}
                      className="hover:cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {isCurrentUser && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                        <span className="font-medium text-gray-900">
                          {u.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-gray-700">{u.email}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(u.role)}
                        {isDisabled ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyle(
                              u.role
                            )}`}
                          >
                            {u.role === "master_admin"
                              ? "Master Admin"
                              : u.role.charAt(0).toUpperCase() +
                                u.role.slice(1)}
                          </span>
                        ) : (
                          <Select
                            value={u.role}
                            onValueChange={(value) =>
                              handleRoleChange(u._id, value)
                            }
                          >
                            <SelectTrigger className="w-[130px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  User
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  Admin
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(u._id)}
                          disabled={isDisabled}
                          className={`transition-all duration-200 ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <UserModal
        userId={userId}
        open={!!userId}
        onClose={() => setUserId(null)}
      />

      {filteredUsers.length && (next || prev) && (
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <Pagination setPage={setPage} prev={prev} page={page} next={next} />
        </div>
      )}
    </div>
  );
}
