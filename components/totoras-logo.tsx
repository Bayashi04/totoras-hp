interface TOTORASLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function TOTORASLogo({ className = "", size = "md" }: TOTORASLogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl md:text-6xl",
  }

  return (
    <div
      className={`font-extrabold tracking-wide ${sizeClasses[size]} ${className}`}
      style={{
        background:
          "linear-gradient(135deg, #ff6b6b 0%, #ff6b6b 33%, #4ecdc4 33%, #4ecdc4 66%, #ffd93d 66%, #ffd93d 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        letterSpacing: "1px",
      }}
    >
      TOTORAS
    </div>
  )
}
