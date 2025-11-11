'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FilterOption = 'all' | 'active' | 'on-hold' | 'completed'

interface ProjectFiltersProps {
  onSearchChange?: (search: string) => void
  onFilterChange?: (filter: FilterOption) => void
}

export function ProjectFilters({
  onSearchChange,
  onFilterChange
}: ProjectFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter)
    onFilterChange?.(filter)
  }

  const filters: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' }
  ]

  return (
    <Card className="bg-[#18181b] border-zinc-800 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-zinc-800 text-sm text-zinc-50 placeholder-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={cn(
                'flex-1 md:flex-initial px-4 py-2 text-sm font-medium transition-colors',
                activeFilter === filter.value
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-50 hover:bg-zinc-800/50'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50'
              )}
              variant="outline"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
