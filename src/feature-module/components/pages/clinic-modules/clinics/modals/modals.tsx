import { useState } from "react";
import axios from "axios";
import ImageWithBasePath from "../../../../../../core/imageWithBasePath";

interface ModalsProps {
  clinicId: number | null; // clinic ID to delete
  onDeleteSuccess?: () => void; // callback after deletion
  closeModal: () => void; // function to close modal
}

const Modals = ({ clinicId, onDeleteSuccess, closeModal }: ModalsProps) => {
  const [loading, setLoading] = useState(false);

  const deleteClinic = async () => {
    if (!clinicId) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://3.109.62.26/api/admin-panel/clinics/${clinicId}/`
      );

      if (response.status === 204 || response.status === 200) {
        alert("Clinic deleted successfully!");
        if (onDeleteSuccess) onDeleteSuccess(); // Refresh parent data
        closeModal(); // Close modal automatically
      } else {
        alert("Failed to delete clinic!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the clinic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="delete_modal">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content">
          <div className="modal-body text-center position-relative z-1">
            <ImageWithBasePath
              src="assets/img/bg/delete-modal-bg-01.png"
              alt=""
              className="img-fluid position-absolute top-0 start-0 z-n1"
            />
            <ImageWithBasePath
              src="assets/img/bg/delete-modal-bg-02.png"
              alt=""
              className="img-fluid position-absolute bottom-0 end-0 z-n1"
            />
            <div className="mb-3">
              <span className="avatar avatar-lg bg-danger text-white">
                <i className="ti ti-trash fs-24" />
              </span>
            </div>
            <h5 className="fw-bold mb-1">Delete Confirmation</h5>
            <p className="mb-3">Are you sure want to delete?</p>
            <div className="d-flex justify-content-center">
              <button
                onClick={closeModal}
                className="btn btn-light position-relative z-1 me-3"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deleteClinic}
                className="btn btn-danger position-relative z-1"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modals;
