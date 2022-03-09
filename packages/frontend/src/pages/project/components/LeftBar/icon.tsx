import React from 'react'

export interface IconProps {
  active: boolean
}

export enum IconEnum {
  HTML5 = 'HTML5',
}

export const icons = {
  HTML5: ({ active }: IconProps) => {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={active ? '#E44D26' : '#79798c'}
          d="M64 32l34.94 403.21L255.77 480 413 435.15 448 32zm308 132H188l4 51h176l-13.51 151.39L256 394.48l-98.68-28-6.78-77.48h48.26l3.42 39.29L256 343.07l53.42-14.92L315 264H148l-12.59-149.59H376.2z"
        ></path>
      </svg>
    )
  }
}
