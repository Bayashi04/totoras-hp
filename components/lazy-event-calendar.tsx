"use client"

import { lazyImport } from "@/lib/lazy-import"

export const LazyEventCalendar = lazyImport(() => import("@/components/event-calendar"), "EventCalendar")
