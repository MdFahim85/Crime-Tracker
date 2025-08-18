"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { addRegion, editRegion, deleteRegion } from "../../feature/regionSlice";

export default function RegionTable() {
  const dispatch = useDispatch();
  const regionList = useSelector((state) => state.region?.regionList || []);
  let regions = regionList.slice().reverse();

  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: "", lat: "", lng: "" });
  const [newRegion, setNewRegion] = useState({ name: "", lat: "", lng: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);

  const startEdit = (index) => {
    setEditIndex(index);
    const region = filteredRegions[index];
    setEditData({
      name: region.name,
      lat: region.latlng[0],
      lng: region.latlng[1],
    });
  };

  const saveEdit = () => {
    dispatch(
      editRegion({
        name: editData.name,
        latlng: [parseFloat(editData.lat), parseFloat(editData.lng)],
      })
    );
    setEditIndex(null);
  };

  const saveNewRegion = () => {
    if (!newRegion.name || !newRegion.lat || !newRegion.lng) return;
    dispatch(
      addRegion({
        name: newRegion.name,
        latlng: [parseFloat(newRegion.lat), parseFloat(newRegion.lng)],
      })
    );
    setNewRegion({ name: "", lat: "", lng: "" });
    setCurrentPage(1);
  };

  const sortByName = () => {};

  const paginatedRegions = filteredRegions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-10">
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

          {paginatedRegions.map((region, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index;
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
                    region.latlng[0]
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
                    region.latlng[1]
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  {editIndex === globalIndex ? (
                    <>
                      <Button size="sm" variant="primary" onClick={saveEdit}>
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
                        onClick={() => dispatch(deleteRegion(region.name))}
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

      <div className="flex gap-2 justify-center mt-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </Button>
        <span className="px-2 py-1 text-slate-500">
          <span className="font-normal text-slate-900">{currentPage}</span> /{" "}
          <span className="font-bold">{totalPages}</span>
        </span>
        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {">"}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
}
