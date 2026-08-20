"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SortAsc, SortDesc, X } from "lucide-react"
import { Loading } from "@/components/ui/loading"

export interface Column<T> {
  key: string
  header: string
  cell: (item: T, index: number) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  sort?: {
    column: string | null
    direction: "asc" | "desc"
    onSort: (column: string, direction: "asc" | "desc") => void
  }
  emptyState?: React.ReactNode
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  pagination,
  search,
  sort,
  emptyState,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState(search?.value || "")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    search?.onChange(value)
  }

  const handleClearSearch = () => {
    setSearchValue("")
    search?.onChange("")
  }

  const handleSort = (column: string) => {
    if (!sort) return

    const newDirection = sort.column === column && sort.direction === "asc" ? "desc" : "asc"

    sort.onSort(column, newDirection)
  }

  const renderSortIcon = (column: string) => {
    if (!sort || !sort.column) return null

    if (sort.column !== column) return null

    return sort.direction === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
  }

  const renderPagination = () => {
    if (!pagination) return null

    const { page, pageSize, total, onPageChange } = pagination
    const totalPages = Math.ceil(total / pageSize)

    return (
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-500">
          显示 {total === 0 ? 0 : (page - 1) * pageSize + 1} 至 {Math.min(page * pageSize, total)} 条，共 {total} 条
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={page === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            第 {page} 页，共 {totalPages} 页
          </span>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const renderEmptyState = () => {
    if (loading) return null

    if (data.length > 0) return null

    if (emptyState) return emptyState

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-2">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-gray-500">暂无数据</p>
        {search && searchValue && (
          <Button variant="link" className="mt-2" onClick={handleClearSearch}>
            清除搜索条件
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {search && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={search.placeholder || "搜索..."}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  {column.sortable && sort ? (
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort(column.key)}>
                      {column.header}
                      {renderSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loading text="加载数据中..." />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  {renderEmptyState()}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.key}`}>{column.cell(item, index)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}
    </div>
  )
}