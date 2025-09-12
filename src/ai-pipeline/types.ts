export interface Validator<T> {
  (data: T): Promise<void> | void;
}

// Allow processors to transform between different types
export type Processor<TIn, TOut = TIn> = (data: TIn) => Promise<TOut> | TOut;

export interface PipelineStep<T> {
  run: () => Promise<T>;
  processors?: Processor<any, any>[]; // More flexible typing
  validators?: Validator<any>[];
}

export interface PipelineResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  stepIndex?: number;
}

// Updated helper functions
export function processor<TIn, TOut = TIn>(
    fn: (data: TIn) => Promise<TOut> | TOut
): Processor<TIn, TOut> & { __type: 'processor' } {
  (fn as any).__type = 'processor';
  return fn as Processor<TIn, TOut> & { __type: 'processor' };
}

export function validator<T>(
    fn: (data: T) => Promise<void> | void
): Validator<T> & { __type: 'validator' } {
  (fn as any).__type = 'validator';
  return fn as Validator<T> & { __type: 'validator' };
}