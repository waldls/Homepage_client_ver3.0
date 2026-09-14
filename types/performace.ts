export interface PerformanceResponse {
  id: number;
  poster_image_url: string;
  youtube_url: string;
  title: string;
  content: string;
  venue: string;
  address: string;
  performance_start_time: string;
  performance_end_time: string;
  freshman_price: string;
  freshman_max_purchase: number;
  general_price: string;
  general_max_purchase: number;
  booking_start_date: string;
  booking_end_date: string;
}

export interface PerformanceDetail extends PerformanceResponse {
  dateForMinute: string;
  dateOption: string;
  freshmanPrice: string;
  generalPrice: string;
}

export interface RecommendedPerformanceResponse {
  id: number;
  title: string;
  poster_image_url: string;
  booking_start_date: string;
  booking_end_date: string;
}
