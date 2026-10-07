// AI ko jawaf (sano markdown): **bold**, "- " / "1. " list, para. Phone number thichda call.
const PHONE = /(\b0\d{1,2}-\d{5,8}\b|\b9[678]\d{8}\b|\b(?:100|101|102|103|1098|1144|1145)\b)/g;

const withPhones = (text, keyBase) =>
    text.split(PHONE).map((part, index) =>
        index % 2 === 1 ? (
            <a key={`${keyBase}-${index}`} href={`tel:${part}`} className="font-semibold text-[#003893] underline decoration-dotted underline-offset-2">
                {part}
            </a>
        ) : (
            part
        )
    );

const inline = (text, keyBase) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
        index % 2 === 1 ? (
            <strong key={`${keyBase}-b${index}`} className="font-semibold text-slate-900">
                {withPhones(part, `${keyBase}-b${index}`)}
            </strong>
        ) : (
            withPhones(part.replace(/(^|\s)\*(?=\S)|(?<=\S)\*(\s|$)/g, "$1$2"), `${keyBase}-t${index}`)
        )
    );

const AIText = ({ text }) => {
    const blocks = [];
    let list = null;

    text.split("\n").forEach((raw) => {
        const line = raw.trim();
        const bullet = line.match(/^[-*•]\s+(.*)/);
        const numbered = line.match(/^\d+[.)]\s+(.*)/);

        if (bullet || numbered) {
            const type = numbered ? "ol" : "ul";
            if (!list || list.type !== type) {
                list = { type, items: [] };
                blocks.push(list);
            }
            list.items.push((bullet || numbered)[1]);
            return;
        }

        list = null;
        if (line) blocks.push({ type: "p", text: line });
    });

    return (
        <div className="space-y-2 leading-6">
            {blocks.map((block, index) => {
                if (block.type === "p") return <p key={index}>{inline(block.text, index)}</p>;

                const Tag = block.type;
                return (
                    <Tag key={index} className={`space-y-1 pl-5 ${Tag === "ol" ? "list-decimal" : "list-disc"} marker:text-[#003893]`}>
                        {block.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{inline(item, `${index}-${itemIndex}`)}</li>
                        ))}
                    </Tag>
                );
            })}
        </div>
    );
};

export default AIText;
