import { error } from './../node_modules/@modelcontextprotocol/sdk/node_modules/ajv/lib/vocabularies/jtd/properties';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axiosInstanceAuth from "./axios-instance-auth"
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
