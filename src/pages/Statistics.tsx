/**
 * Statistics Page
 * Displays AOI inspection results with filtering, pagination, and export
 */

import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Download, Search, List, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useStatistics, useAllStatistics, exportStatisticsCSV } from '@/hooks/useStatistics';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';

type ViewMode = 'filtered' | 'all';

export default function Statistics() {
  const { toast } = useToast();
  
  // Date states - default: end = today, start = 7 days ago
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 50;
  
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('filtered');
  const [isExporting, setIsExporting] = useState(false);

  // Format dates for API
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  // Queries
  const filteredQuery = useStatistics(
    {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      page,
      page_size: pageSize,
    },
    viewMode === 'filtered'
  );

  const allQuery = useAllStatistics(page, 100, viewMode === 'all');

  // Current data based on view mode
  const currentQuery = viewMode === 'filtered' ? filteredQuery : allQuery;
  const { data, isLoading, isError, refetch } = currentQuery;

  // Pagination calculations
  const totalPages = data ? Math.ceil(data.total / (viewMode === 'filtered' ? pageSize : 100)) : 0;
  const currentPageSize = viewMode === 'filtered' ? pageSize : 100;

  // Handlers
  const handleSearch = () => {
    setViewMode('filtered');
    setPage(1);
    if (viewMode === 'filtered') {
      refetch();
    }
  };

  const handleShowAll = () => {
    setViewMode('all');
    setPage(1);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      if (viewMode === 'filtered') {
        await exportStatisticsCSV(formattedStartDate, formattedEndDate);
      } else {
        await exportStatisticsCSV();
      }
      toast({
        title: 'Xuất CSV thành công',
        description: 'File đã được tải xuống.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi xuất CSV',
        description: 'Không thể xuất file CSV. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push(-2);
        pages.push(totalPages);
      }
    }
    return pages;
  }, [page, totalPages]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Thống kê</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Xem và xuất kết quả kiểm tra AOI
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4 p-6 bg-card border border-border rounded-lg">
        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-xl font-medium text-foreground">Từ ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left text-xl h-12",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {startDate ? format(startDate, "dd/MM/yyyy") : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-xl font-medium text-foreground">Đến ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left text-xl h-12",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSearch} 
            className="h-12 px-6 text-xl"
            disabled={isLoading}
          >
            <Search className="mr-2 h-5 w-5" />
            Tìm kiếm
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleShowAll}
            className="h-12 px-6 text-xl"
            disabled={isLoading}
          >
            <List className="mr-2 h-5 w-5" />
            Hiển thị tất cả
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="h-12 px-6 text-xl"
            disabled={isExporting || isLoading}
          >
            <Download className="mr-2 h-5 w-5" />
            {isExporting ? 'Đang xuất...' : 'Xuất CSV'}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Table Header Info */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Kết quả kiểm tra
          </h2>
          {data && (
            <span className="text-xl text-muted-foreground">
              Tổng: {data.total} bản ghi
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xl font-semibold w-[80px]">STT</TableHead>
                <TableHead className="text-xl font-semibold">Tên nhật ký</TableHead>
                <TableHead className="text-xl font-semibold w-[120px]">Trạng thái</TableHead>
                <TableHead className="text-xl font-semibold">Lỗi</TableHead>
                <TableHead className="text-xl font-semibold w-[200px]">Thời gian ghi nhận</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-36" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                // Error state
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-xl text-destructive">Lỗi tải dữ liệu</p>
                      <Button onClick={() => refetch()} variant="outline" className="text-xl">
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Thử lại
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !data?.items?.length ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <p className="text-xl text-muted-foreground">Không có dữ liệu thống kê</p>
                  </TableCell>
                </TableRow>
              ) : (
                // Data rows
                data.items.map((item, index) => (
                  <TableRow 
                    key={item.stt} 
                    className={cn(
                      "hover:bg-muted/50 transition-colors",
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <TableCell className="text-xl font-medium">{item.stt}</TableCell>
                    <TableCell className="text-xl">{item.log_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === 'GOOD' ? 'default' : 'destructive'}
                        className={cn(
                          "text-lg px-3 py-1",
                          item.status === 'GOOD' 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-red-500 hover:bg-red-600"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xl">
                      {item.status === 'GOOD' ? 'None' : item.error_detail}
                    </TableCell>
                    <TableCell className="text-xl text-muted-foreground">
                      {formatDateTime(item.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.total > currentPageSize && (
          <div className="px-6 py-4 border-t border-border">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={cn(
                      "text-xl cursor-pointer",
                      page === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                
                {pageNumbers.map((pageNum, idx) => (
                  <PaginationItem key={idx}>
                    {pageNum < 0 ? (
                      <span className="px-4 text-xl">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className="text-xl cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className={cn(
                      "text-xl cursor-pointer",
                      page === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <p className="text-center text-xl text-muted-foreground mt-3">
              Trang {page} / {totalPages} • Hiển thị {currentPageSize} mục mỗi trang
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
