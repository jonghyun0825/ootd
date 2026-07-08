import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "홈", icon: "\u{1F3E0}" },
  { to: "/filter", label: "필터", icon: "\u{1F3F7}️" },
  { to: "/upload", label: "업로드", icon: "\u{2795}" },
  { to: "/archive", label: "아카이브", icon: "\u{1F5C2}️" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => `bottom-nav__item${isActive ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
