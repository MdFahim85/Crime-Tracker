import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "../../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotification();
  }, [notifications]);

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

  const unreadNotif = notifications?.filter((noti) => noti.isRead == false);

  return (
    <div className="max-w-screen h-9/12 mx-auto p-0 mt-20">
      <div className="bg-white">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadNotif.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {unreadNotif.length}
                </span>
              )}
            </div>
            <button
              onClick={fetchNotification}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh notifications"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.reportTitle}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Your report {notification.reportTitle} has been{" "}
                          {notification.status}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {notification.isRead ? (
                          <CheckCheck className="size-4" />
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() => onRead(notification._id)}
                          >
                            <Check />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(notification._id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
