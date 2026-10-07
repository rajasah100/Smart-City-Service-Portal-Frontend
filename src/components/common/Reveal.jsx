import { useEffect, useRef, useState } from "react";

// Screen ma aaepachhi bistarai dekhine wrapper (CSS: index.css ko .reveal)
const Reveal = ({ as: Tag = "div", delay = 0, className = "", children, ...rest }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(
        () => typeof window === "undefined" || !("IntersectionObserver" in window)
    );

    useEffect(() => {
        if (visible || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? "is-visible" : ""} ${className}`}
            style={{ "--reveal-delay": `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
