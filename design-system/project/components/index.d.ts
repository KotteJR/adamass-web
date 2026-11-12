import type * as React from 'react';
export interface LogoProps { variant?: 'lockup' | 'mark'; size?: number; className?: string }
export declare function Logo(props: LogoProps): React.ReactElement;
export interface ButtonProps { variant?: 'ink' | 'blue' | 'quiet' | 'glass'; size?: 'md' | 'sm'; href?: string; arrow?: boolean; disabled?: boolean; type?: 'button' | 'submit'; onClick?: (e: React.MouseEvent) => void; className?: string; children?: React.ReactNode }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface LabelProps { tone?: 'muted' | 'blue' | 'ink'; className?: string; children?: React.ReactNode }
export declare function Label(props: LabelProps): React.ReactElement;
export interface TagProps { className?: string; children?: React.ReactNode }
export declare function Tag(props: TagProps): React.ReactElement;
export interface ChipProps { selected?: boolean; onClick?: () => void; children?: React.ReactNode }
export declare function Chip(props: ChipProps): React.ReactElement;
export interface HeadlineProps { lead: React.ReactNode; tail?: React.ReactNode; tone?: 'gray' | 'blue'; size?: 'display' | 'h2'; as?: 'h1' | 'h2' | 'h3'; className?: string }
export declare function Headline(props: HeadlineProps): React.ReactElement;
export interface NavLink { label: string; href?: string; active?: boolean }
export interface NavPillProps { links: NavLink[]; cta?: { label: string; href?: string }; onToggleTheme?: () => void; homeHref?: string }
export declare function NavPill(props: NavPillProps): React.ReactElement;
export interface HeroAction { label: string; href?: string; variant?: ButtonProps['variant'] }
export interface HeroProps { image?: string; imageDark?: string; label?: React.ReactNode; lead: React.ReactNode; tail?: React.ReactNode; body?: React.ReactNode; actions?: HeroAction[]; children?: React.ReactNode }
export declare function Hero(props: HeroProps): React.ReactElement;
export interface ProductTab { name: string; status?: string; mark?: string; src: string; srcDark?: string; phone?: string; phoneDark?: string; alt?: string }
export interface ProductWindowProps { tabs: ProductTab[]; auto?: boolean; interval?: number; yours?: boolean; yoursHref?: string }
export declare function ProductWindow(props: ProductWindowProps): React.ReactElement;
export interface StatementProps { lead: React.ReactNode; tail?: React.ReactNode; columns: { text: string; emphasis?: string }[]; actions?: HeroAction[] }
export declare function Statement(props: StatementProps): React.ReactElement;
export type IllustrationKind = 'iso' | 'schematic' | 'contour' | 'stack' | 'globe';
export interface IllustrationProps { kind: IllustrationKind; plate?: boolean; title?: string; className?: string }
export declare function Illustration(props: IllustrationProps): React.ReactElement;
export interface CapabilityCardProps { art: IllustrationKind; title: string; body: string; tags?: string[] }
export declare function CapabilityCard(props: CapabilityCardProps): React.ReactElement;
export interface ProjectCardProps { name: string; kind?: 'product' | 'client'; year?: string; oneLiner: string; src?: string; srcDark?: string; art?: IllustrationKind; tags?: string[]; href?: string }
export declare function ProjectCard(props: ProjectCardProps): React.ReactElement;
export interface SpecsProps { rows: { k: string; v: string }[]; className?: string }
export declare function Specs(props: SpecsProps): React.ReactElement;
export interface ProcessStepsProps { steps: { title: string; body: string }[] }
export declare function ProcessSteps(props: ProcessStepsProps): React.ReactElement;
export type AwsNode = 'org' | 'identity' | 'security' | 'log' | 'audit' | 'workloads' | 'dev' | 'staging' | 'prod' | 'vpc' | 'app' | 'data' | 'bedrock' | 'vpn' | 'budgets';
export interface AwsOffer { id: string; title: string; short: string; body: string; marketplace?: string; nodes: AwsNode[]; specs: { k: string; v: string }[] }
export interface AwsExplorerProps { offers: AwsOffer[] }
export declare function AwsExplorer(props: AwsExplorerProps): React.ReactElement;
export interface ScoperProps { initial?: { kind?: string; stage?: string; team?: string; when?: string }; email?: string }
export declare function Scoper(props: ScoperProps): React.ReactElement;
declare global { interface Window { Adamass: { Logo: typeof Logo; Button: typeof Button; Label: typeof Label; Tag: typeof Tag; Chip: typeof Chip; Headline: typeof Headline; NavPill: typeof NavPill; Hero: typeof Hero; ProductWindow: typeof ProductWindow; Statement: typeof Statement; Illustration: typeof Illustration; CapabilityCard: typeof CapabilityCard; ProjectCard: typeof ProjectCard; Specs: typeof Specs; ProcessSteps: typeof ProcessSteps; AwsExplorer: typeof AwsExplorer; Scoper: typeof Scoper } } }
