// Chronos Engine — Core Types

export type TimelineStatus = 'draft' | 'generating' | 'completed' | 'failed';

export type EventType =
  | 'technology' | 'politics' | 'economics'
  | 'culture' | 'science' | 'military';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type EntityImpact = 'minor' | 'moderate' | 'significant' | 'revolutionary';

export type CompanyStatus = 'startup' | 'growing' | 'established' | 'acquired' | 'defunct' | 'ipo';

export type ProductCategory =
  | 'communication' | 'computing' | 'transportation'
  | 'medicine' | 'entertainment' | 'energy';

export type DivergenceMagnitude = 'minor' | 'moderate' | 'major' | 'world_changing';

export interface Timeline {
  id: string;
  name: string;
  divergenceYear: number;
  divergencePoint: string;
  description: string;
  status: TimelineStatus;
  consistencyScore: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  events: TimelineEvent[];
  companies: Company[];
  products: Product[];
}

export interface DivergencePoint {
  year: number;
  subject: string;
  type: EventType;
  description: string;
  magnitude: DivergenceMagnitude;
}

export interface TimelineEvent {
  id: string;
  timelineId: string;
  year: number;
  title: string;
  description: string;
  category: EventType;
  impact: ImpactLevel;
  causalityStrength: number;
}

export interface Company {
  id: string;
  timelineId: string;
  name: string;
  foundedYear: number;
  industry: string;
  valuation: number;
  headquarters: string;
  status: CompanyStatus;
  description: string;
  keyProduct: string;
  employees: number;
  ceo: {
    name: string;
    background: string;
  };
}

export interface Product {
  id: string;
  timelineId: string;
  name: string;
  category: ProductCategory;
  launchYear: number;
  description: string;
  impact: EntityImpact;
  priceUSD: number;
  manufacturer: string;
  specifications: Record<string, string>;
}

export interface TimelineStats {
  events: number;
  companies: number;
  products: number;
}

export interface TimelineCreateRequest {
  divergence: string;
}

export interface TimelineResponse {
  id: string;
  name: string;
  status: TimelineStatus;
  consistencyScore: number;
  divergence: DivergencePoint;
  stats: TimelineStats;
  yearRange: { start: number; end: number };
  createdAt: string;
  completedAt?: string;
}

export type SSEEvent =
  | { type: 'phase'; phase: string; message?: string }
  | { type: 'parsed'; data: DivergencePoint }
  | { type: 'events'; decade: number; data: Record<string, unknown>[] }
  | { type: 'companies'; decade: number; data: Record<string, unknown>[] }
  | { type: 'products'; decade: number; data: Record<string, unknown>[] }
  | { type: 'complete'; timelineId: string; totalEvents: number }
  | { type: 'error'; message: string };
