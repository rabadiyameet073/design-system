import { CommerceTemplate } from './commerce';
import { SaasTemplate } from './saas';
import { PortfolioTemplate } from './portfolio';
import { PublishingTemplate } from './publishing';
import { HospitalityTemplate } from './hospitality';
import { EducationTemplate } from './education';
import { ArchitectureTemplate } from './architecture';
import { FinanceTemplate } from './finance';
import { CategoryId } from '../../tokens/types';

export interface TemplateProps {
  brandName?: string;
  headline?: string;
  subtitle?: string;
  heroImage?: string;
  badge?: string;
  components?: {
    buttonStyle?: 'solid' | 'outline' | 'subtle' | 'minimal';
    buttonSize?: 'compact' | 'default' | 'large';
    cardStyle?: 'bordered' | 'elevated' | 'flat-tint';
    navStyle?: 'clean-inline' | 'floating' | 'bold-border';
    inputStyle?: 'understated' | 'bordered-focus' | 'filled';
    badgeStyle?: 'subtle-dot' | 'monochrome' | 'tinted';
    enabledComponents?: string[];
  };
  buttonStyle?: 'solid' | 'outline' | 'subtle' | 'minimal';
}

export const TEMPLATE_REGISTRY: Record<CategoryId, React.FC<TemplateProps>> = {
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

