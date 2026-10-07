import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPencilAlt, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import apiRequest from "../../../utils/apiRequest";

// Sajha admin CRUD (janapratinidhi, slider, download)
// config: { endpoint, fields: [{ name, label, type, required, options }], fileField, fileLabel, fileAccept, fileRequired, columns }
const ContentManager = ({ config }) => {
    const [items, setItems] = useState(null);
    const [editing, setEditing] = useState(undefined); // undefined = modal band, null = naya, object = edit

    const load = useCallback(
        () =>
            apiRequest
                .get(config.endpoint, { params: { all: true } })
                .then(({ data }) => setItems(data.items || []))
                .catch(() => {
                    setItems([]);
                    toast.error("Failed to load.");
                }),
        [config.endpoint]
    );

    useEffect(() => {
        const timer = setTimeout(load, 0);
        return () => clearTimeout(timer);
    }, [load]);

    const handleDelete = async (item) => {
        if (!window.confirm("Delete this item?")) return;

        try {
            await apiRequest.delete(`${config.endpoint}/${item._id}`);
            setItems((prev) => prev.filter((i) => i._id !== item._id));
            toast.success("Deleted.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed.");
        }
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">{config.help}</p>

                <button
                    onClick={() => setEditing(null)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <FaPlus size={14} />
                    Add
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">{config.fileLabel}</th>
                            {config.columns.map((column) => (
                                <th key={column.name} className="px-4 py-3 text-left">{column.label}</th>
                            ))}
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items === null ? (
                            <tr>
                                <td colSpan={config.columns.length + 4} className="py-6 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={config.columns.length + 4} className="py-6 text-center text-gray-500">Nothing added yet.</td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const file = item[config.fileField];

                                return (
                                    <tr key={item._id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {file?.url ? (
                                                file.resourceType === "image" ? (
                                                    <img src={file.url} alt="" className="h-12 w-16 rounded object-cover" />
                                                ) : (
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        Open file
                                                    </a>
                                                )
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        {config.columns.map((column) => (
                                            <td key={column.name} className="max-w-xs truncate px-4 py-3">
                                                {column.render ? column.render(item[column.name]) : item[column.name] || "-"}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">{item.order}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                                {item.isActive ? "Active" : "Hidden"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => setEditing(item)}
                                                    className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                                                    aria-label="Edit"
                                                >
                                                    <FaPencilAlt size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="rounded bg-red-600 p-2 text-white hover:bg-red-700"
                                                    aria-label="Delete"
                                                >
                                                    <FaTrash size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {editing !== undefined && (
                <ContentForm
                    key={editing?._id || "new"}
                    config={config}
                    item={editing}
                    onClose={() => setEditing(undefined)}
                    onSaved={() => {
                        setEditing(undefined);
                        load();
                    }}
                />
            )}
        </div>
    );
};

const ContentForm = ({ config, item, onClose, onSaved }) => {
    const [formData, setFormData] = useState(() => {
        const initial = {};

        config.fields.forEach((field) => {
            initial[field.name] = item?.[field.name] ?? (field.type === "select" ? field.options[0].value : "");
        });

        initial.order = item?.order ?? 0;
        initial.isActive = item?.isActive ?? true;

        return initial;
    });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (config.fileRequired && !file && !item?.[config.fileField]?.url) {
            toast.error(`${config.fileLabel} is required.`);
            return;
        }

        if (file && file.size > 10 * 1024 * 1024) {
            toast.error("File must be smaller than 10MB.");
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (file) data.append("file", file);

        setSaving(true);

        try {
            if (item) {
                await apiRequest.put(`${config.endpoint}/${item._id}`, data);
            } else {
                await apiRequest.post(config.endpoint, data);
            }

            toast.success("Saved.");
            onSaved();
        } catch (error) {
            toast.error(error.response?.data?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{item ? "Edit" : "Add"} {config.singular}</h2>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {config.fields.map((field) => (
                            <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
                                <label className="mb-1 block text-sm font-medium">
                                    {field.label} {field.required && "*"}
                                </label>

                                {field.type === "select" ? (
                                    <select name={field.name} value={formData[field.name]} onChange={handleChange} className={inputClass}>
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                ) : field.type === "textarea" ? (
                                    <textarea
                                        name={field.name}
                                        rows={3}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className={inputClass}
                                    />
                                ) : (
                                    <input
                                        name={field.name}
                                        required={field.required}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className={inputClass}
                                    />
                                )}
                            </div>
                        ))}

                        <div>
                            <label className="mb-1 block text-sm font-medium">Order (small number first)</label>
                            <input type="number" name="order" value={formData.order} onChange={handleChange} className={inputClass} />
                        </div>

                        <label className="flex items-center gap-2 self-end pb-2">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4" />
                            <span className="text-sm">Show on website</span>
                        </label>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            {config.fileLabel} {config.fileRequired && !item && "*"}
                        </label>
                        <input type="file" accept={config.fileAccept} onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                        {item?.[config.fileField]?.url && (
                            <p className="mt-1 text-xs text-gray-500">Leave empty to keep the current file.</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentManager;
