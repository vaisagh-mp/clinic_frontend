import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageWithBasePath from "../../imageWithBasePath";
import { useNavigate } from "react-router-dom";
import { all_routes } from "../../../feature-module/routes/all_routes";

interface UserItem {
  id: number;
  name: string;
  role: string;
  clinic_id: number | null;
}

const SidebarTop = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all switchable users
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get("http://3.109.62.26/api/admin-panel/switchable-users/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userList = res.data.users || [];
        setUsers(userList);

        const storedId = localStorage.getItem("acting_as_user_id");
        if (storedId) {
          const current = userList.find((u: UserItem) => u.id === Number(storedId));
          setSelectedUser(current || null);
        }

      } catch (err) {
        console.error("❌ Fetch users error:", err);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Handle switching between panels
const handleSwitch = async (user: UserItem & { doctor_id?: number }) => {
  console.log(user);
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await axios.post(
      "http://3.109.62.26/api/admin-panel/switch-panel/",
      { target_id: user.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { access, acting_as, target_id, target_name } = res.data;

    // ✅ Store new token & role context
    localStorage.setItem("access_token", access);
    localStorage.setItem("acting_as_role", acting_as);
    localStorage.setItem("acting_as_user_id", target_id.toString());
    localStorage.setItem("acting_as_user_name", target_name);

    // ✅ Store context IDs based on role
    if (user.role === "clinic" && user.clinic_id) {
      localStorage.setItem("clinic_id", user.clinic_id.toString());
      localStorage.removeItem("doctor_id");
    } 
    else if (user.role === "doctor") {
      // 👉 store doctor_id if available, otherwise fallback to user.id
      if (user.doctor_id) {
        localStorage.setItem("doctor_id", user.doctor_id.toString());
      } else {
        localStorage.setItem("doctor_id", user.id.toString());
      }
      // optional: store clinic_id if exists
      if (user.clinic_id) {
        localStorage.setItem("clinic_id", user.clinic_id.toString());
      } else {
        localStorage.removeItem("clinic_id");
      }
    } 
    else {
      // For superadmin or others
      localStorage.removeItem("clinic_id");
      localStorage.removeItem("doctor_id");
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    // ✅ Update UI
    setSelectedUser(user);
    setOpen(false);

    // ✅ Redirect based on acting_as
    if (acting_as === "clinic") {
      window.location.href = `/clinic/dashboard/${target_id}`;
    } else if (acting_as === "doctor") {
      window.location.href = `/doctor/dashboard/${target_id}`;
    } else {
      window.location.href = `/dashboard`;
    }
  } catch (err: any) {
    console.error("❌ Switch failed:", err.response || err);
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
              {selectedUser?.name || "Select Panel"}
            </h6>
            <p className="fs-13 mb-0 text-muted">
              {selectedUser?.role?.toUpperCase() || ""}
              {/* {selectedUser?.clinic_id && ` (Clinic ID: ${selectedUser.clinic_id})`} */}
            </p>
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
              <div className="d-flex flex-column align-items-start">
                <span>{user.name}</span>
                {/* {user.clinic_id && (
                  <small className="text-muted">Clinic ID: {user.clinic_id}</small>
                )} */}
              </div>
              <small className="text-muted ms-2">
                {user.role === "clinic"
                  ? "Clinic"
                  : user.role === "doctor"
                  ? "Doctor"
                  : user.role}
              </small>
            </button>
          ))}
          {users.length === 0 && (
            <p className="text-muted mb-0 text-center">No panels available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarTop;