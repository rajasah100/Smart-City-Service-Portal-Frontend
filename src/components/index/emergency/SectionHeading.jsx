// Emergency page ka sabai section ko ekai kisim ko heading
const SectionHeading = ({ label, title, description }) => {
    return (
        <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                {label}
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                {title}
            </h2>

            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />

            {description && (
                <p className="mx-auto mt-5 max-w-2xl text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
