export const colorMaps = {
  text: {
    "neon-green": "text-neon-green",
    "vibrant-yellow": "text-vibrant-yellow",
    primary: "text-primary",
    "electric-blue": "text-electric-blue",
    "secondary-text": "text-secondary-text",
  } as Record<string, string>,
  
  bg: {
    primary: "bg-primary",
    "neon-green": "bg-neon-green",
    "vibrant-yellow": "bg-vibrant-yellow",
    "electric-blue": "bg-electric-blue",
    "wire-red": "bg-wire-red",
  } as Record<string, string>,

  level: {
    primary: "bg-primary/10 text-primary",
    "vibrant-yellow": "bg-vibrant-yellow/10 text-vibrant-yellow",
    "electric-blue": "bg-electric-blue/10 text-electric-blue",
  } as Record<string, string>,

  border: {
    primary: "border-l-primary",
    "vibrant-yellow": "border-l-vibrant-yellow",
    "electric-blue": "border-l-electric-blue",
  } as Record<string, string>,

  gradient: {
    primary: "from-primary/40",
    "vibrant-yellow": "from-vibrant-yellow/40",
    "electric-blue": "from-electric-blue/40",
  } as Record<string, string>,
};
