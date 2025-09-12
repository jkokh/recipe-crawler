import { PipelineStep, PipelineResult, Validator, Processor } from './types';

function isProcessor(fn: any): boolean {
  return fn.__type === 'processor';
}

function isValidator(fn: any): boolean {
  return fn.__type === 'validator';
}

export class Pipeline<T> {
  private steps: PipelineStep<T>[] = [];

  step(run: () => Promise<T>, ...funcs: any[]): Pipeline<T> {
    const processors: Processor<T>[] = [];
    const validators: Validator<T>[] = [];

    // Simple separation based on __type property
    for (const func of funcs) {
      if (isProcessor(func)) {
        processors.push(func);
      } else {
        // Default to validator (maintains backward compatibility)
        validators.push(func);
      }
    }

    this.steps.push({
      run,
      processors: processors.length > 0 ? processors : undefined,
      validators: validators.length > 0 ? validators : undefined
    });
    return this;
  }

  async execute(): Promise<PipelineResult<T>> {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];

      try {
        console.log(`Pipeline: Executing step ${i + 1}/${this.steps.length}`);

        let data = await step.run();

        // Run processors first (transform data)
        if (step.processors) {
          for (const processor of step.processors) {
            data = await processor(data);
          }
        }

        // Run validators (validate data)
        if (step.validators) {
          for (const validator of step.validators) {
            await validator(data);
          }
        }

        console.log(`Pipeline: Step ${i + 1} succeeded`);
        return {
          success: true,
          data,
          stepIndex: i
        };

      } catch (error: any) {
        console.log(`Pipeline: Step ${i + 1} failed: ${error.message}`);

        if (i === this.steps.length - 1) {
          return {
            success: false,
            error: error.message,
            stepIndex: i
          };
        }
      }
    }

    return {
      success: false,
      error: 'No steps in pipeline'
    };
  }
}

export function pipeline<T>(): Pipeline<T> {
  return new Pipeline<T>();
}