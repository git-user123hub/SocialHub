function Logo() {
  return (
    <svg
      className="w-7 h-7"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeWidth="37"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="28" y="28" width="456" height="456" rx="82" />
      <path d="M72 414 L190 296 Q206 280 222 296 L350 438" />
      <path d="M278 354 L344 288 Q359 273 375 289 L438 354" />
      <circle cx="290" cy="211" r="34" />
      <path d="M282 352 C332 324 370 292 387 245 C392 232 395 218 395 204" />
      <path d="M394 103 L450 82 L426 156 L408 126 L394 103 Z" />
      <path d="M394 103 L426 156 L414 116 L394 103" />
    </svg>
  );
}

export default Logo;
