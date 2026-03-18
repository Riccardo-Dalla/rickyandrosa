interface RRLogoProps {
  className?: string;
}

export function RRLogo({ className = "" }: RRLogoProps) {
  return (
    <span className={`rr-logo ${className}`}>
      <span className="rr-letter">R</span>
      <span className="rr-amp">&</span>
      <span className="rr-letter">R</span>
    </span>
  );
}
