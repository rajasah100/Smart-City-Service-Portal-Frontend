import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUsers, LuRefreshCw } from "react-icons/lu";

import { getUsers } from "../../redux/slices/userSlice";

import UserStats from "../../components/admin/users/UserStats";
import UserSearch from "../../components/admin/users/UserSearch";
import UserTable from "../../components/admin/users/UserTable";
import UserPagination from "../../components/admin/users/UserPagination";
import UserViewModal from "../../components/admin/users/UserViewModal";
// import DeleteUserModal from "../../components/admin/users/DeleteUserModal";

const UserManagementPage = () => {
    const dispatch = useDispatch();

    const { users, loading } = useSelector((state) => state.user);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [selectedUser, setSelectedUser] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);
    // const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);


    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email?.toLowerCase().includes(search.toLowerCase()) ||
                user.phone?.includes(search);

            const matchesRole =
                role === "all" || user.role === role;

            return matchesSearch && matchesRole;
        });
    }, [users, search, role]);

    const totalPages = Math.ceil(
        filteredUsers.length / usersPerPage
    );

    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const handleView = (user) => {
        setSelectedUser(user);
        setViewOpen(true);
    };

    // const handleDelete = (user) => {
    //     setSelectedUser(user);
    //     setDeleteOpen(true);
    // };

    // const confirmDelete = async (id) => {
    //     await dispatch(deleteUser(id));

    //     setDeleteOpen(false);
    //     setSelectedUser(null);

    //     dispatch(getUsers());
    // };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <LuUsers className="text-blue-600" />
                        User Management
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage all registered users.
                    </p>
                </div>

                <button
                    onClick={() => dispatch(getUsers())}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    <LuRefreshCw />
                    Refresh
                </button>

            </div>

            {/* Stats */}
            <UserStats users={users} />

            {/* Search */}
            <UserSearch
                search={search}
                setSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                role={role}
                setRole={(value) => {
                    setRole(value);
                    setCurrentPage(1);
                }}
            />

            {/* Table */}
            <UserTable
                users={currentUsers}
                loading={loading}
                onView={handleView}
                // onDelete={handleDelete}
            />

            {/* Pagination */}
            <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalUsers={filteredUsers.length}
                usersPerPage={usersPerPage}
            />

            {/* View Modal */}
            <UserViewModal
                open={viewOpen}
                user={selectedUser}
                onClose={() => setViewOpen(false)}
            />

            {/* Delete Modal */}
            {/* <DeleteUserModal
                isOpen={deleteOpen}
                user={selectedUser}
                loading={loading}
                onClose={() => setDeleteOpen(false)}
                onDelete={confirmDelete}
            /> */}

        </div>
    );
};

export default UserManagementPage;