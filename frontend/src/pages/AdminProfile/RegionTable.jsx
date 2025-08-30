import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "../../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pagination } from "../../components/Pagination";
import { Plus, Edit3, Trash2, Save, X, Search, MapPin } from "lucide-react";

export default function RegionTable({ setUsers }) {
  const [regionList, setRegionList] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [loading, setLoading] = useState(true);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/regions?page=${page}&limit=10`);
      setRegionList(res.data.regions);
      setNext(res.data.next);
      setPrev(res.data.prev);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setRegionList([]);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRegions();
  }, [page]);

  let regions = regionList.slice().reverse();

  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [newRegion, setNewRegion] = useState({ name: "", lat: "", lng: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (index) => {
    setEditIndex(index);
    const region = filteredRegions[index];
    setEditData({
      name: region.name,
      lat: region.lat,
      lng: region.lng,
    });
  };

  const saveEdit = async (id) => {
    try {
      setLoading(true);
      const res = await API.put(`/regions/${id}`, {
        name: editData.name,
        lat: parseFloat(editData.lat),
        lng: parseFloat(editData.lng),
      });
      toast.success(res.data.message);
      setEditIndex(null);
      fetchRegions();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setEditIndex(null);
      setLoading(false);
    }
  };

  const saveNewRegion = async () => {
    if (!newRegion.name || !newRegion.lat || !newRegion.lng) return;
    try {
      setLoading(true);
      const res = await API.post("/regions", {
        name: newRegion.name,
        lat: parseFloat(newRegion.lat),
        lng: parseFloat(newRegion.lng),
      });
      setNewRegion({ name: "", lat: "", lng: "" });
      setPage(1);
      fetchRegions();
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteRegion = async (id) => {
    try {
      setLoading(true);
      const res = await API.delete(`/regions/${id}`);
      fetchRegions();
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dhaka Regions
              </h1>
              <p className="text-sm text-gray-600">
                Manage geographical regions
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search regions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-64 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mx-4">
        <Table className="w-full ">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700 w-16">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Region Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Latitude
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Longitude
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-gradient-to-r from-blue-50 to-blue-50 border-l-4 border-blue-400 hover:from-blue-100 hover:to-blue-100 transition-all duration-200">
              <TableCell className="font-medium text-blue-600">
                <Plus className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Enter region name"
                  value={newRegion.name}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, name: e.target.value })
                  }
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="23.8103"
                  value={newRegion.lat}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, lat: e.target.value })
                  }
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="90.4125"
                  value={newRegion.lng}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, lng: e.target.value })
                  }
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  onClick={saveNewRegion}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={!newRegion.name || !newRegion.lat || !newRegion.lng}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </TableCell>
            </TableRow>

            {filteredRegions.map((region, index) => {
              const globalIndex = (page - 1) * 10 + index + 1;
              const isEditing = editIndex === index;

              return (
                <TableRow
                  key={region._id}
                  className={`group hover:bg-slate-50 transition-all duration-200 ${
                    isEditing ? "bg-blue-50 border-l-4 border-blue-400" : ""
                  }`}
                >
                  <TableCell className="font-medium text-gray-600">
                    {globalIndex}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {region.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={editData.lat}
                        onChange={(e) =>
                          setEditData({ ...editData, lat: e.target.value })
                        }
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="text-gray-700 font-mono text-sm">
                        {region.lat}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={editData.lng}
                        onChange={(e) =>
                          setEditData({ ...editData, lng: e.target.value })
                        }
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="text-gray-700 font-mono text-sm">
                        {region.lng}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveEdit(region._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditIndex(null)}
                            className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(index)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteRegion(region._id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer with Pagination */}
      {(next || prev) && (
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <Pagination setPage={setPage} prev={prev} page={page} next={next} />
        </div>
      )}
    </div>
  );
}
