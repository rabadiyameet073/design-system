import { CommerceTemplate } from './commerce';
import { SaasTemplate } from './saas';
import { PortfolioTemplate } from './portfolio';
import { PublishingTemplate } from './publishing';
import { HospitalityTemplate } from './hospitality';
import { EducationTemplate } from './education';
import { ArchitectureTemplate } from './architecture';
import { FinanceTemplate } from './finance';
import { CategoryId } from '../../tokens/types';

export const TEMPLATE_REGISTRY: Record<CategoryId, React.FC<{ brandName?: string; heroImage?: string }>> = {
  commerce: CommerceTemplate,
  saas: SaasTemplate,
  portfolio: PortfolioTemplate,
  publishing: PublishingTemplate,
  hospitality: HospitalityTemplate,
  education: EducationTemplate,
  architecture: ArchitectureTemplate,
  finance: FinanceTemplate
};

export {
  CommerceTemplate,
  SaasTemplate,
  PortfolioTemplate,
  PublishingTemplate,
  HospitalityTemplate,
  EducationTemplate,
  ArchitectureTemplate,
  FinanceTemplate
};
