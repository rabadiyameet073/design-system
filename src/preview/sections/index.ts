import { Header } from './Header';
import { Hero } from './Hero';
import { FeatureGrid } from './FeatureGrid';
import { ProductGrid } from './ProductGrid';
import { PricingTable } from './PricingTable';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { Gallery } from './Gallery';
import { ArticleList } from './ArticleList';
import { ArticleBody } from './ArticleBody';
import { BookingWidget } from './BookingWidget';
import { CourseCards } from './CourseCards';
import { ProjectGrid } from './ProjectGrid';
import { StatsRow } from './StatsRow';
import { ComponentsShowcase } from './ComponentsShowcase';
import { TypeSpecimen } from './TypeSpecimen';
import { Footer } from './Footer';

export const SECTION_REGISTRY = {
  header: Header,
  hero: Hero,
  features: FeatureGrid,
  products: ProductGrid,
  pricing: PricingTable,
  testimonials: Testimonials,
  faq: FAQ,
  gallery: Gallery,
  articleList: ArticleList,
  articleBody: ArticleBody,
  booking: BookingWidget,
  courses: CourseCards,
  projects: ProjectGrid,
  stats: StatsRow,
  componentsShowcase: ComponentsShowcase,
  typeSpecimen: TypeSpecimen,
  footer: Footer
} as const;

export type SectionType = keyof typeof SECTION_REGISTRY;

export {
  Header,
  Hero,
  FeatureGrid,
  ProductGrid,
  PricingTable,
  Testimonials,
  FAQ,
  Gallery,
  ArticleList,
  ArticleBody,
  BookingWidget,
  CourseCards,
  ProjectGrid,
  StatsRow,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
};
