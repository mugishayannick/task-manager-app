/**
 * API Client
 * Centralized HTTP client using axios
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { API_BASE_URL } from '../constants'
import type { ApiResponse } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url)
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    }
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data)
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    }
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data)
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url)
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    }
  }
}

export const apiClient = new ApiClient()
