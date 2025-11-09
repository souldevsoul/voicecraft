"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Play, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Audio = {
  id: string
  filename: string
  audioUrl: string
  duration: number | null
  fileSize: number | null
  format: string
  voiceName: string | null
  text: string | null
  status: string
  createdAt: string
}

export const columns: ColumnDef<Audio>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "filename",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-yellow-100"
        >
          Filename
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const filename = row.getValue("filename") as string
      return <div className="font-medium">{filename}</div>
    },
  },
  {
    accessorKey: "voiceName",
    header: "Voice",
    cell: ({ row }) => {
      const voiceName = row.getValue("voiceName") as string | null
      return voiceName ? (
        <Badge variant="default">{voiceName}</Badge>
      ) : (
        <span className="text-slate-400">-</span>
      )
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-yellow-100"
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number | null
      if (!duration) return <span className="text-slate-400">-</span>
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      return <div>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>
    },
  },
  {
    accessorKey: "fileSize",
    header: "Size",
    cell: ({ row }) => {
      const fileSize = row.getValue("fileSize") as number | null
      if (!fileSize) return <span className="text-slate-400">-</span>
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2)
      return <div>{sizeMB} MB</div>
    },
  },
  {
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => {
      const format = row.getValue("format") as string
      return <Badge variant="outline">{format.toUpperCase()}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant =
        status === "ready" ? "success" :
        status === "processing" ? "warning" :
        status === "failed" ? "danger" : "default"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-yellow-100"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const audio = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-yellow-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(audio.id)}
            >
              Copy audio ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open(audio.audioUrl, '_blank')}>
              <Play className="mr-2 h-4 w-4" />
              Play
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(audio.audioUrl, '_blank')}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
