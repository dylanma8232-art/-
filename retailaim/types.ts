import { LucideIcon } from 'lucide-react';

export enum ModuleType {
  COMPANY_INTRO = 'COMPANY_INTRO',
  DATA_DASHBOARD = 'DATA_DASHBOARD',
  SUPPLY_MAP = 'SUPPLY_MAP',
  AI_SALES = 'AI_SALES',
  AI_GUIDE_EMPOWERMENT = 'AI_GUIDE_EMPOWERMENT',
  CLAIRVOYANCE = 'CLAIRVOYANCE',
}

export interface BlockData {
  id: ModuleType;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  description: string;
}