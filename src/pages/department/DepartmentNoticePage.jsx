import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepartmentNotices,
  deleteNotice,
} from "../../redux/slices/noticeSlice";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

import NoticeTable from "../../components/department/NoticeTable";
import NoticeForm from "../../components/department/NoticeForm";
import NoticeView from "../../components/department/NoticeView";

const DepartmentNoticePage = () => {
  const dispatch = useDispatch();

  const { departmentNotices, loading } = useSelector((state) => state.notice);

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    dispatch(getDepartmentNotices());
  }, [dispatch]);

  const handleView = (notice) => {
    setSelectedNotice(notice);
    setShowView(true);
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedNotice(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await dispatch(deleteNotice(id)).unwrap();
      toast.success("Notice deleted successfully");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Department Notices</h1>

          <p className="text-slate-500">Manage your department notices</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#0f4c81] text-white px-5 py-3 rounded-lg hover:bg-[#0d3f69]"
        >
          <FaPlus />
          Add Notice
        </button>
      </div>

      {/* Table */}

      <NoticeTable
        notices={departmentNotices}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit */}

      {showForm && (
        <NoticeForm
          notice={selectedNotice}
          onClose={() => {
            setShowForm(false);
            setSelectedNotice(null);
          }}
        />
      )}

      {/* View */}

      {showView && (
        <NoticeView
          notice={selectedNotice}
          onClose={() => {
            setShowView(false);
            setSelectedNotice(null);
          }}
        />
      )}
    </div>
  );
};

export default DepartmentNoticePage;
