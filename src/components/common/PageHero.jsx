// Home bahek sabai public page ko common hero section (About Us page ko design)
const PageHero = ({ icon: Icon, badge, title, description, children }) => {
    return (
        <div className="pt-16">
            <div className="relative overflow-hidden bg-linear-to-br from-[#10151c] to-[#1e2a38] px-4 py-16">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                radial-gradient(circle at 20% 50%, #4a6c8f 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, #d9a441 0%, transparent 40%)
              `,
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative max-w-3xl mx-auto text-center">

                    {/* Badge */}
                    {badge && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#d9a441]">
                            {Icon && <Icon />}
                            {badge}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                        {title}
                    </h1>

                    {/* Description */}
                    {description && (
                        <p className="mt-4 text-base leading-7 text-slate-400">
                            {description}
                        </p>
                    )}

                    {/* Extra content (buttons, search, etc.) */}
                    {children && <div className="mt-8">{children}</div>}

                </div>
            </div>
        </div>
    );
};

export default PageHero;
