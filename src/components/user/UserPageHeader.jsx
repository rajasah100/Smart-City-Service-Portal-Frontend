// Dashboard ka page haru ko sajha heading (nilo banner)
const UserPageHeader = ({ icon: Icon, title, text, children }) => (
    <div className="animate-fade-up relative overflow-hidden rounded-2xl bg-linear-to-r from-[#003893] to-[#0b1b3a] p-6 text-white shadow-md">
        <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 90% 20%, #d9a441 0%, transparent 35%)" }}
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                {Icon && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl text-[#f0c66b]">
                        <Icon />
                    </span>
                )}
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {text && <p className="mt-1 text-sm text-slate-300">{text}</p>}
                </div>
            </div>

            {children}
        </div>
    </div>
);

export default UserPageHeader;
