import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="1em"
    height="1em"
    {...props}
  >
    <g fill="currentColor">
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
      <path d="M168 96h-24a8 8 0 0 0-8 8v56a8 8 0 0 0 16 0v-24h16a8 8 0 0 0 0-16h-16v-8h16a8 8 0 0 0 0-16Z" />
      <path d="M112 96H92a8 8 0 0 0-8 8v56a8 8 0 0 0 16 0v-48h12a8 8 0 0 0 0-16Z" />
    </g>
  </svg>
);

export default Logo;
