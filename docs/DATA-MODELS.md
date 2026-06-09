# Chronos Engine — Data Models

**Version:** 1.0  
**Date:** June 9, 2026

---

## Core Types

```typescript
// src/types/index.ts

// ============================================
// Enums
// ============================================

export type TimelineStatus = 'draft' | 'generating' | 'completed' | 'failed';

export type EventType = 
  | 'technology' | 'politics' | 'economics' 
  | 'culture' | 'science' | 'military';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type EntityImpact = 'minor' | 'moderate' | 'significant' | 'revolutionary';

export type CompanyStatus = 'startup' | 'growing' | 'established' | 'acquired' | 'defunct' | 'ipo';

export type TechMaturity = 'concept' | 'prototype' | 'early_adoption' | 'production' | 'legacy';

export type TechLevel = 'primitive' | 'developing' | 'modern' | 'advanced' | 'futuristic';

export type GovernmentType = 
  | 'democracy' | 'republic' | 'monarchy' | 'technocracy' 
  | 'authoritarian' | 'federation' | 'theocracy';

export type ProductCategory = 
  | 'communication' | 'computing' | 'transportation' 
  | 'medicine' | 'entertainment' | 'energy';

export type PersonSignificance = 'low' | 'medium' | 'high' | 'legendary';

export type DivergenceMagnitude = 'minor' | 'moderate' | 'major' | 'world_changing';

// ============================================
// Core Entities
// ============================================

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
}

export interface DivergencePoint {
  id: string;
  timelineId: string;
  originalYear: number;
  category: EventType;
  title: string;
  description: string;
  prompt: string;
  magnitude: DivergenceMagnitude;
}

export interface Event {
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
  ceo?: PersonReference;
}

export interface Person {
  id: string;
  timelineId: string;
  name: string;
  bornYear: number;
  diedYear?: number;
  nationality: string;
  occupation: string;
  biography: string;
  significance: PersonSignificance;
  achievements: string[];
  alternateFate: string;
  realWorldEquivalent?: string;
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

export interface Country {
  id: string;
  timelineId: string;
  name: string;
  isoCode: string;
  formedYear: number;
  dissolvedYear?: number;
  governmentType: GovernmentType;
  population: number;
  gdp: number;
  gdpPerCapita: number;
  technologyLevel: TechLevel;
  description: string;
}

export interface Technology {
  id: string;
  timelineId: string;
  name: string;
  category: string;
  inventedYear: number;
  description: string;
  maturity: TechMaturity;
}

export interface NewsArticle {
  id: string;
  timelineId: string;
  newspaperName: string;
  date: Date;
  headline: string;
  subheadline?: string;
  body: string;
  author: string;
  category: EventType;
}

export interface WikiArticle {
  id: string;
  timelineId: string;
  title: string;
  category: 'company' | 'country' | 'event' | 'person' | 'technology';
  content: string;
  lastEdited: Date;
}

export interface EconomicSnapshot {
  id: string;
  timelineId: string;
  countryId: string;
  year: number;
  gdp: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  population: number;
  giniCoefficient: number;
  literacyRate: number;
  lifeExpectancy: number;
}

// ============================================
// References (lightweight pointers)
// ============================================

export interface PersonReference {
  id: string;
  name: string;
}

export interface CompanyReference {
  id: string;
  name: string;
}

export interface EventReference {
  id: string;
  title: string;
  year: number;
}

export interface EntityReference {
  id: string;
  type: 'company' | 'person' | 'product' | 'country' | 'technology';
  name: string;
}

// ============================================
// Relationships
// ============================================

export interface CausalRelationship {
  sourceId: string;
  targetId: string;
  strength: number; // 0-1
  description: string;
}

export interface TemporalRelationship {
  earlierId: string;
  laterId: string;
  type: 'precedes' | 'follows';
}

// ============================================
// Generation Schemas (input/output)
// ============================================

export interface DivergenceInput {
  year: number;
  subject: string;
  type: EventType;
  description: string;
  magnitude: DivergenceMagnitude;
}

export interface GeneratedEvent {
  year: number;
  title: string;
  description: string;
  category: EventType;
  impact: ImpactLevel;
  causalityStrength: number;
  affectedEntities: EntityReference[];
}

export interface GeneratedCompany {
  name: string;
  foundedYear: number;
  industry: string;
  valuation: number;
  headquarters: string;
  ceo: {
    name: string;
    background: string;
  };
  status: CompanyStatus;
  description: string;
  keyProduct: string;
  employees: number;
}

export interface GeneratedProduct {
  name: string;
  category: ProductCategory;
  launchYear: number;
  description: string;
  impact: EntityImpact;
  priceUSD: number;
  manufacturer: string;
  specifications: Record<string, string>;
}

export interface GeneratedPerson {
  name: string;
  bornYear: number;
  diedYear?: number;
  nationality: string;
  occupation: string;
  biography: string;
  significance: PersonSignificance;
  achievements: string[];
  alternateFate: string;
  realWorldEquivalent?: string;
}

export interface GeneratedNewsArticle {
  newspaperName: string;
  date: string; // ISO date
  headline: string;
  subheadline?: string;
  body: string;
  author: string;
  category: EventType;
  mentionedEntities: EntityReference[];
}

export interface GeneratedCountry {
  name: string;
  isoCode: string;
  formedYear: number;
  dissolvedYear?: number;
  governmentType: GovernmentType;
  population: number;
  gdp: number;
  technologyLevel: TechLevel;
  description: string;
  neighbors: string[];
  allies: string[];
  rivals: string[];
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
    statusCode: number;
  };
}

export interface TimelineCreateRequest {
  divergence: string;
  options?: {
    maxYears?: number;
    detailLevel?: 'minimal' | 'standard' | 'full';
    includeCompanies?: boolean;
    includePeople?: boolean;
    includeProducts?: boolean;
    includeNews?: boolean;
    includeWiki?: boolean;
    includeMap?: boolean;
    includeEconomics?: boolean;
  };
}

export interface TimelineResponse {
  id: string;
  name: string;
  status: TimelineStatus;
  consistencyScore: number;
  divergence: DivergenceInput;
  stats: TimelineStats;
  yearRange: {
    start: number;
    end: number;
  };
  createdAt: string;
  completedAt?: string;
}

export interface TimelineStats {
  events: number;
  companies: number;
  people: number;
  products: number;
  countries: number;
  technologies: number;
  newsArticles: number;
  wikiArticles: number;
  economicSnapshots: number;
}

// ============================================
// SSE Events
// ============================================

export type SSEEvent = 
  | { type: 'phase'; phase: string; message?: string }
  | { type: 'parsed'; data: DivergenceInput }
  | { type: 'events'; decade: number; data: GeneratedEvent[] }
  | { type: 'companies'; decade: number; data: GeneratedCompany[] }
  | { type: 'products'; decade: number; data: GeneratedProduct[] }
  | { type: 'people'; decade: number; data: GeneratedPerson[] }
  | { type: 'news'; decade: number; data: GeneratedNewsArticle[] }
  | { type: 'validation'; data: ConsistencyResult }
  | { type: 'complete'; timelineId: string; totalEvents: number }
  | { type: 'error'; message: string };

export interface ConsistencyResult {
  score: number;
  issues: ConsistencyIssue[];
  suggestedFixes: SuggestedFix[];
}

export interface ConsistencyIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  entityIds: string[];
}

export interface SuggestedFix {
  issue: string;
  fix: string;
}
```
