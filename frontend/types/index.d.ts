// types/index.d.ts 

// For Company Overview
export interface CompanyOverview {
  firm: string;
  avg_overall_rating: number;
}

// For individual review
export interface Review {
  id: number;
  firm: string;
  date_review: string; // ISO date string
  job_title: string | null;
  current_status: string | null;
  location: string | null;
  overall_rating: number;
  work_life_balance: number | null;
  culture_values: number | null;
  diversity_inclusion: number | null;
  career_opp: number | null;
  comp_benefits: number | null;
  senior_mgmt: number | null;
  recommend: 'o' | 'x' | 'v' | null;
  ceo_approv: 'o' | 'x' | 'v' | null;
  outlook: 'o' | 'x' | 'v' | 'r' | null;
  headline: string | null;
  pros: string | null;
  cons: string | null;
}

// For company statistics
export interface CompanyStatistics {
  firm: string;
  avg_overall_rating: number;
  avg_work_life_balance: number | null;
  avg_culture_values: number | null;
  avg_diversity_inclusion: number | null;
  avg_career_opp: number | null;
  avg_comp_benefits: number | null;
  avg_senior_mgmt: number | null;
  recommend_yes: string; // come as strings from DB COUNT
  recommend_no: string;
  recommend_mixed: string;
  ceo_approv_yes: string;
  ceo_approv_no: string;
  ceo_approv_mixed: string;
  outlook_positive: string;
  outlook_neutral: string;
  outlook_negative: string;
  total_reviews_count: string; // Comes as string from DB COUNT
}

// For pagination metadata
export interface Pagination {
  currentPage: number;
  limit: number;
  totalReviews: number;
  totalPages: number;
}

// Combined type for detailed company data
export interface CompanyDetailData {
  firm: string;
  statistics: CompanyStatistics;
  reviews: Review[];
  pagination: Pagination;
}