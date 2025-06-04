import React, { PropsWithChildren, ReactNode } from 'react'

type BoxProps = {
  row?: boolean
  col?: boolean
  children?: ReactNode
}

export default function Box(props: BoxProps) {

  return (
    <div 
      className={`
        flex gap-2
        ${props.row && "flex-row"} 
        ${props.col && "flex-col"
      }`
    }>
      { props.children }
    </div>
  )
}
