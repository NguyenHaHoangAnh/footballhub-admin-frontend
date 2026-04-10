import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";
import { Filter, Pagination, Sort } from "@/app/types/table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | undefined) {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");1
}

export function formatDateTime(date: string | undefined) {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
}

export function getParams(
  filter: Record<string, Filter>,
  sort: Record<string, Sort>,
  pagination: Pagination
) {
  let params = new URLSearchParams();

  // filter
  if (filter) {
    const filterList = Object.entries(filter).map(([key, value]) => ({
      field: value.field,
      type: value.type,
      compare: value.operator,
      value: value.value,
    }));

    if (filterList.length > 0) {
      // encode JSON
      params.append("filters", JSON.stringify(filterList));
    }
  }

  // sort
  if (sort) {
    Object.values(sort).forEach((s) => {
      params.append("sort", `${s.column},${s.value}`);
    });
  }

  // pagination
  if (pagination) {
    params.append("page", pagination.page.toString());
    params.append("size", pagination.size.toString());
  }

  return params.toString();
}