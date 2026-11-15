export default function MainSvg() {
  return (
    <svg
      xmlns="http://w3.org"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="insta-gradient-id"
          x1="87%"
          y1="84%"
          x2="13%"
          y2="16%"
        >
          <stop offset="0%" stopColor="rgba(131, 58, 180, 1)" />
          <stop offset="36%" stopColor="rgba(225, 69, 252, 1)" />
          <stop offset="59%" stopColor="rgba(253, 29, 29, 1)" />
          <stop offset="69%" stopColor="rgba(253, 80, 43, 1)" />
          <stop offset="86%" stopColor="rgba(252, 147, 61, 1)" />
          <stop offset="93%" stopColor="rgba(252, 176, 69, 1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
