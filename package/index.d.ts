export interface FestiveTrigger {
  type: 'always' | 'date' | 'range';
  month?: number;
  day?: number;
  monthStart?: number;
  dayStart?: number;
  monthEnd?: number;
  dayEnd?: number;
}

export interface FestiveTheme {
  key: string;
  name: string;
  triggers?: FestiveTrigger[];
  apply: (
    container: HTMLElement,
    common: FestiveCommonOptions,
    params: Record<string, any>
  ) => (() => void) | void;
}

export interface FestiveCommonOptions {
  primaryColor: string;
  secondaryColor: string;
  primaryFont: string;
  secondaryFont: string;
}

export interface FestiveInitOptions {
  forceTheme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryFont?: string;
  secondaryFont?: string;
  themes?: Record<string, Record<string, any>>;
}

export interface FestiveInitResult {
  applied: boolean;
  theme?: string;
  reason?: string;
}

export declare class Festive {
  constructor();
  
  registerTheme(theme: FestiveTheme): void;
  unregisterTheme(key: string): void;
  clearThemes(): void;
  getRegisteredThemes(): FestiveTheme[];
  
  pickTheme(date?: Date, options?: FestiveInitOptions): FestiveTheme | null;
  
  destroy(): void;
  init(options?: FestiveInitOptions): FestiveInitResult;
}

declare const singleton: Festive;
export default singleton;