import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const fetchNotification = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (error) {
      console.log(error.data.message);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const unreadNotif = notifications?.filter((noti) => noti.isRead == false);

  const onRead = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}`);
      toast.success(res.data.message);
      fetchNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await API.delete(`/notifications/${id}`);
      toast.success(res.data.message);
      fetchNotification();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex">
          <Bell />
          {unreadNotif?.length ? (
            <sup>
              <Badge variant="destructive">{unreadNotif.length}</Badge>
            </sup>
          ) : (
            ""
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <DropdownMenuLabel>
            <div className="flex justify-between">
              Notifications <Link to="/notifications">See All</Link>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications?.length ? (
            notifications.map((noti) => (
              <DropdownMenuItem key={noti._id}>
                <div className="flex gap-2 items-center ps-2">
                  <Link to={`/crime/${noti.reportId}`}>
                    Your report {noti.reportTitle} has been {noti.status}{" "}
                  </Link>

                  {noti.isRead ? (
                    <CheckCheck />
                  ) : (
                    <Button variant="ghost" onClick={() => onRead(noti._id)}>
                      <Check />
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => onDelete(noti._id)}>
                    <Trash2 />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>No new notification</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
