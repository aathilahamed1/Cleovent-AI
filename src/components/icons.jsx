import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="currentColor"
        d="M216 208H40a16 16 0 0 1-16-16V64a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16v128a16 16 0 0 1-16 16Zm-24-48V80H64v80Zm-56-8v-29.32a32 32 0 1 0-24 0V152Z"
        opacity=".2"
      />
      <path
        fill="currentColor"
        d="M216 40H40a24 24 0 0 0-24 24v128a24 24 0 0 0 24 24h176a24 24 0 0 0 24-24V64a24 24 0 0 0-24-24Zm8 152a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8ZM72 88h112a8 8 0 0 0 0-16H72a8 8 0 0 0 0 16Zm112 80H72a8 8 0 0 0-8 8v8a8 8 0 0 0 8 8h112a8 8 0 0 0 8-8v-8a8 8 0 0 0-8-8Zm-40-56a40 40 0 0 0-64 0 8 8 0 0 0 8 11.31V128a8 8 0 0 0 16 0v-14.69a24 24 0 0 1 40-11.31V128a8 8 0 0 0 16 0v-29.31A8 8 0 0 0 144 112Zm-24-20a24 24 0 1 1-24 24 24 24 0 0 1 24-24Z"
      />
    </svg>
  );
}
