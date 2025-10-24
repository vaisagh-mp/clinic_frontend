import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageWithBasePath from "../../imageWithBasePath";
import { useNavigate } from "react-router-dom";

interface UserItem {
  id: number;
  name: string;
  role: string;
}

const SidebarTop = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Fetch all switchable users
    axios
      .get("http://3.109.62.26/api/admin-panel/switchable-users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users);

        // Set current acting user from localStorage
        const actingId = localStorage.getItem("acting_as_user_id");
        if (actingId) {
          const user = res.data.users.find((u: any) => u.id === Number(actingId));
          setSelectedUser(user);
        }
      })
      .catch((err) => console.error("Fetch users error:", err));
  }, []);

  const handleSwitch = async (user: UserItem) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await axios.post(
        "http://3.109.62.26/api/admin-panel/switch-panel/",
        { target_id: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save new JWT and acting info
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("acting_as_role", res.data.acting_as);
      localStorage.setItem("acting_as_user_id", res.data.target_id);

      setSelectedUser(user);
      setOpen(false);

      // Navigate to dashboard of the selected user
      if (user.role === "clinic") navigate("/clinic/dashboard", { replace: true });
      else if (user.role === "doctor") navigate("/doctor/dashboard", { replace: true });
    } catch (err: any) {
      console.error("User switch failed:", err.response || err);
    }
  };

  return (
    <div className="sidebar-top shadow-sm p-2 rounded-1 mb-3">
      <div
        className="d-flex justify-content-between align-items-center mb-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="d-flex align-items-center">
          <span className="avatar rounded-circle flex-shrink-0 p-2">
            <ImageWithBasePath src="./assets/img/icons/trustcare.svg" alt="img" />
          </span>
          <div className="ms-2">
            <h6 className="fs-14 fw-semibold mb-0">
              {selectedUser?.name || "Select User"}
            </h6>
            <p className="fs-13 mb-0">{selectedUser?.role?.toUpperCase() || ""}</p>
          </div>
        </div>
        <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="dropdown-menu show p-2 mt-1">
          {users.map((user) => (
            <button
              key={user.id}
              className={`dropdown-item d-flex justify-content-between align-items-center ${
                selectedUser?.id === user.id ? "active" : ""
              }`}
              onClick={() => handleSwitch(user)}
            >
              <span>{user.name}</span>
              <small className="text-muted ms-2">{user.role}</small>
            </button>
          ))}
          {users.length === 0 && <p className="text-muted mb-0">No users available</p>}
        </div>
      )}
    </div>
  );
};

export default SidebarTop;
