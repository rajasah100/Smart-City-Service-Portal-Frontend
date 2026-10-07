import { useState } from "react";
import ContentManager from "../../components/admin/content/ContentManager";

const DOCUMENT_CATEGORIES = [
    { value: "act", label: "Act (ऐन)" },
    { value: "regulation", label: "Regulation (नियमावली)" },
    { value: "procedure", label: "Procedure (कार्यविधि)" },
    { value: "form", label: "Form (फारम)" },
    { value: "report", label: "Report (प्रतिवेदन)" },
    { value: "other", label: "Other (अन्य)" },
];

const TABS = [
    {
        key: "officials",
        label: "Officials",
        config: {
            endpoint: "/officials",
            singular: "Official",
            help: "Mayor, Deputy Mayor, Chief Administrative Officer etc. Shown on the Home page. The section stays hidden until you add someone.",
            fileField: "photo",
            fileLabel: "Photo",
            fileAccept: "image/*",
            fields: [
                { name: "nameNe", label: "Name (Nepali)", required: true, placeholder: "नाम" },
                { name: "nameEn", label: "Name (English)", placeholder: "Name" },
                { name: "designationNe", label: "Designation (Nepali)", required: true, placeholder: "नगर प्रमुख" },
                { name: "designationEn", label: "Designation (English)", placeholder: "Mayor" },
                { name: "phone", label: "Phone", placeholder: "98XXXXXXXX" },
                { name: "email", label: "Email", placeholder: "name@example.gov.np" },
            ],
            columns: [
                { name: "nameNe", label: "Name" },
                { name: "designationNe", label: "Designation" },
                { name: "phone", label: "Phone" },
            ],
        },
    },
    {
        key: "slides",
        label: "Home Slider",
        config: {
            endpoint: "/slides",
            singular: "Slide",
            help: "Photos for the Home page slider. If no slide is added, 3 default photos are shown. Use wide photos (about 1600x900).",
            fileField: "image",
            fileLabel: "Photo",
            fileAccept: "image/*",
            fileRequired: true,
            fields: [
                { name: "titleNe", label: "Title (Nepali)", required: true, wide: true },
                { name: "titleEn", label: "Title (English)", wide: true },
                { name: "textNe", label: "Text (Nepali)", type: "textarea" },
                { name: "textEn", label: "Text (English)", type: "textarea" },
                { name: "link", label: "Button link (optional)", placeholder: "/complaint or https://...", wide: true },
            ],
            columns: [
                { name: "titleNe", label: "Title" },
                { name: "link", label: "Link" },
            ],
        },
    },
    {
        key: "documents",
        label: "Downloads",
        config: {
            endpoint: "/documents",
            singular: "Document",
            help: "Acts, regulations, forms and reports (PDF or image). Shown on the Downloads page and the Home page.",
            fileField: "file",
            fileLabel: "File (PDF or image)",
            fileAccept: "application/pdf,image/*",
            fileRequired: true,
            fields: [
                { name: "titleNe", label: "Title (Nepali)", required: true, wide: true },
                { name: "titleEn", label: "Title (English)", wide: true },
                { name: "category", label: "Category", type: "select", options: DOCUMENT_CATEGORIES },
            ],
            columns: [
                { name: "titleNe", label: "Title" },
                {
                    name: "category",
                    label: "Category",
                    render: (value) => DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label || value,
                },
            ],
        },
    },
];

const AdminHomeContentPage = () => {
    const [active, setActive] = useState(TABS[0].key);
    const tab = TABS.find((item) => item.key === active);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold sm:text-2xl">Home Page Content</h1>
                <p className="text-sm text-gray-500 sm:text-base">
                    Officials, Home slider photos and downloadable documents.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {TABS.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                            active === item.key ? "bg-gray-900 text-white" : "border bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <ContentManager key={tab.key} config={tab.config} />
        </div>
    );
};

export default AdminHomeContentPage;
