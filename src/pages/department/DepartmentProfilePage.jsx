import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuBuilding2, LuInfo, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { localizePlace } from "../../data/nepalLocation";
import { initials, serviceAreaText } from "../../components/department/deptUtils";

// Department ko vivaran ra sewa kshetra (herna matra; badalna admin)
const DepartmentProfilePage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";
  const { department } = useSelector((state) => state.department);

  if (!department) return <div className="h-64 animate-pulse rounded-2xl bg-white" />;

  const area = department.serviceArea || {};
  const rows = [
    { icon: LuMail, label: t("deptDash.profile.email"), value: department.email, href: `mailto:${department.email}` },
    { icon: LuPhone, label: t("deptDash.profile.phone"), value: department.phone, href: `tel:${department.phone}` },
    { icon: LuBuilding2, label: t("deptDash.profile.address"), value: department.address },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
        <div className="bg-linear-to-r from-[#002a6e] to-[#003893] px-6 py-8 text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-bold text-[#002a6e]">
            {initials(department.name)}
          </span>
          <h2 className="mt-4 text-2xl font-bold">{department.name}</h2>
          <p className="mt-1 text-sm text-white/70">{t("deptDash.profile.details")}</p>
        </div>

        <dl className="divide-y divide-slate-100 px-6">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003893]/10 text-[#003893]">
                <Icon />
              </span>
              <div className="min-w-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="truncate font-medium text-slate-900">
                  {href && value ? <a href={href} className="hover:text-[#003893] hover:underline">{value}</a> : value || "-"}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {department.description && (
          <div className="border-t border-slate-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("deptDash.profile.description")}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{department.description}</p>
          </div>
        )}
      </section>

      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            <LuMapPin className="text-[#dc143c]" />
            {t("deptDash.area.label")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("deptDash.profile.areaText")}</p>
          <p className="mt-4 rounded-xl bg-[#003893]/5 px-4 py-3 font-semibold text-[#003893]">{serviceAreaText(area, t, isEn)}</p>

          {area.municipalities?.length > 0 && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{t("deptDash.profile.localLevels")}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {area.municipalities.map((name) => (
                  <li key={name} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {localizePlace({ ...area, municipality: name }, isEn).municipality}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <p className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <LuInfo className="mt-1 shrink-0" />
          {t("deptDash.profile.contactAdmin")}
        </p>
      </div>
    </div>
  );
};

export default DepartmentProfilePage;
