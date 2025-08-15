"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef((props, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        props.className
      )}
      {...props}
    />
  )
})

const AvatarImage = React.forwardRef((props, ref) => {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", props.className)}
      {...props}
    />
  )
})

const AvatarFallback = React.forwardRef((props, ref) => {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        props.className
      )}
      {...props}
    />
  )
})

export { Avatar, AvatarImage, AvatarFallback }


