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

export default function RegionTable() {
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

  useEffect(() => {
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
    <div className="mt-6 bg-slate-100 px-10 py-8 rounded-xl shadow-md">
      <div className="flex flex-col justify-center items-start gap-2 mb-4">
        <h1 className="text-xl font-bold">Dhaka Regions</h1>
        <Input
          placeholder="Search Region..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64"
        />
      </div>

      <Table className="w-full mb-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input
                placeholder="Region Name"
                value={newRegion.name}
                onChange={(e) =>
                  setNewRegion({ ...newRegion, name: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Input
                placeholder="Latitude"
                value={newRegion.lat}
                onChange={(e) =>
                  setNewRegion({ ...newRegion, lat: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Input
                placeholder="Longitude"
                value={newRegion.lng}
                onChange={(e) =>
                  setNewRegion({ ...newRegion, lng: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Button size="sm" variant="primary" onClick={saveNewRegion}>
                Add
              </Button>
            </TableCell>
          </TableRow>

          {filteredRegions.map((region, index) => {
            const globalIndex = index;
            return (
              <TableRow key={globalIndex}>
                <TableCell>
                  {editIndex === globalIndex ? (
                    <Input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  ) : (
                    region.name
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === globalIndex ? (
                    <Input
                      value={editData.lat}
                      onChange={(e) =>
                        setEditData({ ...editData, lat: e.target.value })
                      }
                    />
                  ) : (
                    region.lat
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === globalIndex ? (
                    <Input
                      value={editData.lng}
                      onChange={(e) =>
                        setEditData({ ...editData, lng: e.target.value })
                      }
                    />
                  ) : (
                    region.lng
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  {editIndex === globalIndex ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => saveEdit(region._id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="second"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => startEdit(globalIndex)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="second"
                        onClick={() => deleteRegion(region._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {next || prev ? (
        <Pagination setPage={setPage} prev={prev} page={page} next={next} />
      ) : (
        ""
      )}
    </div>
  );
}
