export function BackgroundPattern() {
  return (
    <>
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="diamonds"
              patternUnits="userSpaceOnUse"
              width="60"
              height="60"
              patternTransform="rotate(45)"
            >
              <rect
                width="20"
                height="20"
                fill="rgba(138, 97, 255, 0.1)"
                strokeWidth="1"
                stroke="rgba(138, 97, 255, 0.2)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diamonds)" />
        </svg>
      </div>
      <div className="absolute inset-0 z-1 bg-black/60 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-background via-transparent to-transparent"></div>
    </>
  );
}
