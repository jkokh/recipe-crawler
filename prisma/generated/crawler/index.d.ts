
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model Ingredient
 * 
 */
export type Ingredient = $Result.DefaultSelection<Prisma.$IngredientPayload>
/**
 * Model Phrase
 * 
 */
export type Phrase = $Result.DefaultSelection<Prisma.$PhrasePayload>
/**
 * Model Source
 * 
 */
export type Source = $Result.DefaultSelection<Prisma.$SourcePayload>
/**
 * Model SourceImage
 * 
 */
export type SourceImage = $Result.DefaultSelection<Prisma.$SourceImagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Categories
 * const categories = await prisma.category.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ingredient`: Exposes CRUD operations for the **Ingredient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ingredients
    * const ingredients = await prisma.ingredient.findMany()
    * ```
    */
  get ingredient(): Prisma.IngredientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.phrase`: Exposes CRUD operations for the **Phrase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Phrases
    * const phrases = await prisma.phrase.findMany()
    * ```
    */
  get phrase(): Prisma.PhraseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.source`: Exposes CRUD operations for the **Source** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sources
    * const sources = await prisma.source.findMany()
    * ```
    */
  get source(): Prisma.SourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sourceImage`: Exposes CRUD operations for the **SourceImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SourceImages
    * const sourceImages = await prisma.sourceImage.findMany()
    * ```
    */
  get sourceImage(): Prisma.SourceImageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Category: 'Category',
    Tag: 'Tag',
    Ingredient: 'Ingredient',
    Phrase: 'Phrase',
    Source: 'Source',
    SourceImage: 'SourceImage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "category" | "tag" | "ingredient" | "phrase" | "source" | "sourceImage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      Ingredient: {
        payload: Prisma.$IngredientPayload<ExtArgs>
        fields: Prisma.IngredientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngredientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngredientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          findFirst: {
            args: Prisma.IngredientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngredientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          findMany: {
            args: Prisma.IngredientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>[]
          }
          create: {
            args: Prisma.IngredientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          createMany: {
            args: Prisma.IngredientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.IngredientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          update: {
            args: Prisma.IngredientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          deleteMany: {
            args: Prisma.IngredientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IngredientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IngredientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          aggregate: {
            args: Prisma.IngredientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIngredient>
          }
          groupBy: {
            args: Prisma.IngredientGroupByArgs<ExtArgs>
            result: $Utils.Optional<IngredientGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngredientCountArgs<ExtArgs>
            result: $Utils.Optional<IngredientCountAggregateOutputType> | number
          }
        }
      }
      Phrase: {
        payload: Prisma.$PhrasePayload<ExtArgs>
        fields: Prisma.PhraseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhraseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhraseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>
          }
          findFirst: {
            args: Prisma.PhraseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhraseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>
          }
          findMany: {
            args: Prisma.PhraseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>[]
          }
          create: {
            args: Prisma.PhraseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>
          }
          createMany: {
            args: Prisma.PhraseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PhraseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>
          }
          update: {
            args: Prisma.PhraseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>
          }
          deleteMany: {
            args: Prisma.PhraseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhraseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PhraseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhrasePayload>
          }
          aggregate: {
            args: Prisma.PhraseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhrase>
          }
          groupBy: {
            args: Prisma.PhraseGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhraseGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhraseCountArgs<ExtArgs>
            result: $Utils.Optional<PhraseCountAggregateOutputType> | number
          }
        }
      }
      Source: {
        payload: Prisma.$SourcePayload<ExtArgs>
        fields: Prisma.SourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          findFirst: {
            args: Prisma.SourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          findMany: {
            args: Prisma.SourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>[]
          }
          create: {
            args: Prisma.SourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          createMany: {
            args: Prisma.SourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          update: {
            args: Prisma.SourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          deleteMany: {
            args: Prisma.SourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          aggregate: {
            args: Prisma.SourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSource>
          }
          groupBy: {
            args: Prisma.SourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<SourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.SourceCountArgs<ExtArgs>
            result: $Utils.Optional<SourceCountAggregateOutputType> | number
          }
        }
      }
      SourceImage: {
        payload: Prisma.$SourceImagePayload<ExtArgs>
        fields: Prisma.SourceImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SourceImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SourceImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>
          }
          findFirst: {
            args: Prisma.SourceImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SourceImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>
          }
          findMany: {
            args: Prisma.SourceImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>[]
          }
          create: {
            args: Prisma.SourceImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>
          }
          createMany: {
            args: Prisma.SourceImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SourceImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>
          }
          update: {
            args: Prisma.SourceImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>
          }
          deleteMany: {
            args: Prisma.SourceImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SourceImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SourceImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceImagePayload>
          }
          aggregate: {
            args: Prisma.SourceImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSourceImage>
          }
          groupBy: {
            args: Prisma.SourceImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<SourceImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.SourceImageCountArgs<ExtArgs>
            result: $Utils.Optional<SourceImageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    category?: CategoryOmit
    tag?: TagOmit
    ingredient?: IngredientOmit
    phrase?: PhraseOmit
    source?: SourceOmit
    sourceImage?: SourceImageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    children: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | CategoryCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
  }


  /**
   * Count Type SourceCountOutputType
   */

  export type SourceCountOutputType = {
    sourceImages: number
  }

  export type SourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sourceImages?: boolean | SourceCountOutputTypeCountSourceImagesArgs
  }

  // Custom InputTypes
  /**
   * SourceCountOutputType without action
   */
  export type SourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceCountOutputType
     */
    select?: SourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SourceCountOutputType without action
   */
  export type SourceCountOutputTypeCountSourceImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceImageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
    parentId: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
    parentId: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    parentId: number | null
    title: string | null
    slug: string | null
    createdAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    parentId: number | null
    title: string | null
    slug: string | null
    createdAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    parentId: number
    title: number
    slug: number
    keywords: number
    createdAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
    parentId?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
    parentId?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    parentId?: true
    title?: true
    slug?: true
    createdAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    parentId?: true
    title?: true
    slug?: true
    createdAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    parentId?: true
    title?: true
    slug?: true
    keywords?: true
    createdAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    parentId: number | null
    title: string
    slug: string
    keywords: JsonValue | null
    createdAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentId?: boolean
    title?: boolean
    slug?: boolean
    keywords?: boolean
    createdAt?: boolean
    parent?: boolean | Category$parentArgs<ExtArgs>
    children?: boolean | Category$childrenArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>



  export type CategorySelectScalar = {
    id?: boolean
    parentId?: boolean
    title?: boolean
    slug?: boolean
    keywords?: boolean
    createdAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "parentId" | "title" | "slug" | "keywords" | "createdAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Category$parentArgs<ExtArgs>
    children?: boolean | Category$childrenArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      parent: Prisma.$CategoryPayload<ExtArgs> | null
      children: Prisma.$CategoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      parentId: number | null
      title: string
      slug: string
      keywords: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Category$parentArgs<ExtArgs> = {}>(args?: Subset<T, Category$parentArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends Category$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Category$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly parentId: FieldRef<"Category", 'Int'>
    readonly title: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly keywords: FieldRef<"Category", 'Json'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.parent
   */
  export type Category$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Category.children
   */
  export type Category$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    cursor?: CategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagAvgAggregateOutputType = {
    id: number | null
  }

  export type TagSumAggregateOutputType = {
    id: number | null
  }

  export type TagMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    createdAt: Date | null
  }

  export type TagMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    createdAt: Date | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    _all: number
  }


  export type TagAvgAggregateInputType = {
    id?: true
  }

  export type TagSumAggregateInputType = {
    id?: true
  }

  export type TagMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TagAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TagSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _avg?: TagAvgAggregateInputType
    _sum?: TagSumAggregateInputType
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: number
    name: string
    slug: string
    createdAt: Date
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tag"]>



  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt", ExtArgs["result"]["tag"]>

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      createdAt: Date
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'Int'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly slug: FieldRef<"Tag", 'String'>
    readonly createdAt: FieldRef<"Tag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
  }


  /**
   * Model Ingredient
   */

  export type AggregateIngredient = {
    _count: IngredientCountAggregateOutputType | null
    _avg: IngredientAvgAggregateOutputType | null
    _sum: IngredientSumAggregateOutputType | null
    _min: IngredientMinAggregateOutputType | null
    _max: IngredientMaxAggregateOutputType | null
  }

  export type IngredientAvgAggregateOutputType = {
    id: number | null
  }

  export type IngredientSumAggregateOutputType = {
    id: bigint | null
  }

  export type IngredientMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    slug: string | null
    createdAt: Date | null
  }

  export type IngredientMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    slug: string | null
    createdAt: Date | null
  }

  export type IngredientCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    _all: number
  }


  export type IngredientAvgAggregateInputType = {
    id?: true
  }

  export type IngredientSumAggregateInputType = {
    id?: true
  }

  export type IngredientMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
  }

  export type IngredientMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
  }

  export type IngredientCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    _all?: true
  }

  export type IngredientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ingredient to aggregate.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ingredients
    **/
    _count?: true | IngredientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IngredientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IngredientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngredientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngredientMaxAggregateInputType
  }

  export type GetIngredientAggregateType<T extends IngredientAggregateArgs> = {
        [P in keyof T & keyof AggregateIngredient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngredient[P]>
      : GetScalarType<T[P], AggregateIngredient[P]>
  }




  export type IngredientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngredientWhereInput
    orderBy?: IngredientOrderByWithAggregationInput | IngredientOrderByWithAggregationInput[]
    by: IngredientScalarFieldEnum[] | IngredientScalarFieldEnum
    having?: IngredientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngredientCountAggregateInputType | true
    _avg?: IngredientAvgAggregateInputType
    _sum?: IngredientSumAggregateInputType
    _min?: IngredientMinAggregateInputType
    _max?: IngredientMaxAggregateInputType
  }

  export type IngredientGroupByOutputType = {
    id: bigint
    name: string
    slug: string
    createdAt: Date
    _count: IngredientCountAggregateOutputType | null
    _avg: IngredientAvgAggregateOutputType | null
    _sum: IngredientSumAggregateOutputType | null
    _min: IngredientMinAggregateOutputType | null
    _max: IngredientMaxAggregateOutputType | null
  }

  type GetIngredientGroupByPayload<T extends IngredientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngredientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngredientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngredientGroupByOutputType[P]>
            : GetScalarType<T[P], IngredientGroupByOutputType[P]>
        }
      >
    >


  export type IngredientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ingredient"]>



  export type IngredientSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
  }

  export type IngredientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt", ExtArgs["result"]["ingredient"]>

  export type $IngredientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ingredient"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      slug: string
      createdAt: Date
    }, ExtArgs["result"]["ingredient"]>
    composites: {}
  }

  type IngredientGetPayload<S extends boolean | null | undefined | IngredientDefaultArgs> = $Result.GetResult<Prisma.$IngredientPayload, S>

  type IngredientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IngredientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IngredientCountAggregateInputType | true
    }

  export interface IngredientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ingredient'], meta: { name: 'Ingredient' } }
    /**
     * Find zero or one Ingredient that matches the filter.
     * @param {IngredientFindUniqueArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngredientFindUniqueArgs>(args: SelectSubset<T, IngredientFindUniqueArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ingredient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IngredientFindUniqueOrThrowArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngredientFindUniqueOrThrowArgs>(args: SelectSubset<T, IngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ingredient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindFirstArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngredientFindFirstArgs>(args?: SelectSubset<T, IngredientFindFirstArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ingredient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindFirstOrThrowArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngredientFindFirstOrThrowArgs>(args?: SelectSubset<T, IngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ingredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ingredients
     * const ingredients = await prisma.ingredient.findMany()
     * 
     * // Get first 10 Ingredients
     * const ingredients = await prisma.ingredient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ingredientWithIdOnly = await prisma.ingredient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IngredientFindManyArgs>(args?: SelectSubset<T, IngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ingredient.
     * @param {IngredientCreateArgs} args - Arguments to create a Ingredient.
     * @example
     * // Create one Ingredient
     * const Ingredient = await prisma.ingredient.create({
     *   data: {
     *     // ... data to create a Ingredient
     *   }
     * })
     * 
     */
    create<T extends IngredientCreateArgs>(args: SelectSubset<T, IngredientCreateArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ingredients.
     * @param {IngredientCreateManyArgs} args - Arguments to create many Ingredients.
     * @example
     * // Create many Ingredients
     * const ingredient = await prisma.ingredient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IngredientCreateManyArgs>(args?: SelectSubset<T, IngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Ingredient.
     * @param {IngredientDeleteArgs} args - Arguments to delete one Ingredient.
     * @example
     * // Delete one Ingredient
     * const Ingredient = await prisma.ingredient.delete({
     *   where: {
     *     // ... filter to delete one Ingredient
     *   }
     * })
     * 
     */
    delete<T extends IngredientDeleteArgs>(args: SelectSubset<T, IngredientDeleteArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ingredient.
     * @param {IngredientUpdateArgs} args - Arguments to update one Ingredient.
     * @example
     * // Update one Ingredient
     * const ingredient = await prisma.ingredient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IngredientUpdateArgs>(args: SelectSubset<T, IngredientUpdateArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ingredients.
     * @param {IngredientDeleteManyArgs} args - Arguments to filter Ingredients to delete.
     * @example
     * // Delete a few Ingredients
     * const { count } = await prisma.ingredient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IngredientDeleteManyArgs>(args?: SelectSubset<T, IngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ingredients
     * const ingredient = await prisma.ingredient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IngredientUpdateManyArgs>(args: SelectSubset<T, IngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ingredient.
     * @param {IngredientUpsertArgs} args - Arguments to update or create a Ingredient.
     * @example
     * // Update or create a Ingredient
     * const ingredient = await prisma.ingredient.upsert({
     *   create: {
     *     // ... data to create a Ingredient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ingredient we want to update
     *   }
     * })
     */
    upsert<T extends IngredientUpsertArgs>(args: SelectSubset<T, IngredientUpsertArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientCountArgs} args - Arguments to filter Ingredients to count.
     * @example
     * // Count the number of Ingredients
     * const count = await prisma.ingredient.count({
     *   where: {
     *     // ... the filter for the Ingredients we want to count
     *   }
     * })
    **/
    count<T extends IngredientCountArgs>(
      args?: Subset<T, IngredientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngredientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ingredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngredientAggregateArgs>(args: Subset<T, IngredientAggregateArgs>): Prisma.PrismaPromise<GetIngredientAggregateType<T>>

    /**
     * Group by Ingredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngredientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngredientGroupByArgs['orderBy'] }
        : { orderBy?: IngredientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ingredient model
   */
  readonly fields: IngredientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ingredient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IngredientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ingredient model
   */
  interface IngredientFieldRefs {
    readonly id: FieldRef<"Ingredient", 'BigInt'>
    readonly name: FieldRef<"Ingredient", 'String'>
    readonly slug: FieldRef<"Ingredient", 'String'>
    readonly createdAt: FieldRef<"Ingredient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ingredient findUnique
   */
  export type IngredientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient findUniqueOrThrow
   */
  export type IngredientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient findFirst
   */
  export type IngredientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ingredients.
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ingredients.
     */
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Ingredient findFirstOrThrow
   */
  export type IngredientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ingredients.
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ingredients.
     */
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Ingredient findMany
   */
  export type IngredientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * Filter, which Ingredients to fetch.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ingredients.
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Ingredient create
   */
  export type IngredientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * The data needed to create a Ingredient.
     */
    data: XOR<IngredientCreateInput, IngredientUncheckedCreateInput>
  }

  /**
   * Ingredient createMany
   */
  export type IngredientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ingredients.
     */
    data: IngredientCreateManyInput | IngredientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ingredient update
   */
  export type IngredientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * The data needed to update a Ingredient.
     */
    data: XOR<IngredientUpdateInput, IngredientUncheckedUpdateInput>
    /**
     * Choose, which Ingredient to update.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient updateMany
   */
  export type IngredientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ingredients.
     */
    data: XOR<IngredientUpdateManyMutationInput, IngredientUncheckedUpdateManyInput>
    /**
     * Filter which Ingredients to update
     */
    where?: IngredientWhereInput
    /**
     * Limit how many Ingredients to update.
     */
    limit?: number
  }

  /**
   * Ingredient upsert
   */
  export type IngredientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * The filter to search for the Ingredient to update in case it exists.
     */
    where: IngredientWhereUniqueInput
    /**
     * In case the Ingredient found by the `where` argument doesn't exist, create a new Ingredient with this data.
     */
    create: XOR<IngredientCreateInput, IngredientUncheckedCreateInput>
    /**
     * In case the Ingredient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngredientUpdateInput, IngredientUncheckedUpdateInput>
  }

  /**
   * Ingredient delete
   */
  export type IngredientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
    /**
     * Filter which Ingredient to delete.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient deleteMany
   */
  export type IngredientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ingredients to delete
     */
    where?: IngredientWhereInput
    /**
     * Limit how many Ingredients to delete.
     */
    limit?: number
  }

  /**
   * Ingredient without action
   */
  export type IngredientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: IngredientOmit<ExtArgs> | null
  }


  /**
   * Model Phrase
   */

  export type AggregatePhrase = {
    _count: PhraseCountAggregateOutputType | null
    _avg: PhraseAvgAggregateOutputType | null
    _sum: PhraseSumAggregateOutputType | null
    _min: PhraseMinAggregateOutputType | null
    _max: PhraseMaxAggregateOutputType | null
  }

  export type PhraseAvgAggregateOutputType = {
    id: number | null
    sourceId: number | null
    index: number | null
  }

  export type PhraseSumAggregateOutputType = {
    id: bigint | null
    sourceId: number | null
    index: number | null
  }

  export type PhraseMinAggregateOutputType = {
    id: bigint | null
    sourceId: number | null
    type: string | null
    version: string | null
    index: number | null
    hash: string | null
    text: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PhraseMaxAggregateOutputType = {
    id: bigint | null
    sourceId: number | null
    type: string | null
    version: string | null
    index: number | null
    hash: string | null
    text: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PhraseCountAggregateOutputType = {
    id: number
    sourceId: number
    type: number
    version: number
    index: number
    hash: number
    text: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PhraseAvgAggregateInputType = {
    id?: true
    sourceId?: true
    index?: true
  }

  export type PhraseSumAggregateInputType = {
    id?: true
    sourceId?: true
    index?: true
  }

  export type PhraseMinAggregateInputType = {
    id?: true
    sourceId?: true
    type?: true
    version?: true
    index?: true
    hash?: true
    text?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PhraseMaxAggregateInputType = {
    id?: true
    sourceId?: true
    type?: true
    version?: true
    index?: true
    hash?: true
    text?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PhraseCountAggregateInputType = {
    id?: true
    sourceId?: true
    type?: true
    version?: true
    index?: true
    hash?: true
    text?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PhraseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Phrase to aggregate.
     */
    where?: PhraseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phrases to fetch.
     */
    orderBy?: PhraseOrderByWithRelationInput | PhraseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhraseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phrases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phrases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Phrases
    **/
    _count?: true | PhraseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhraseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhraseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhraseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhraseMaxAggregateInputType
  }

  export type GetPhraseAggregateType<T extends PhraseAggregateArgs> = {
        [P in keyof T & keyof AggregatePhrase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhrase[P]>
      : GetScalarType<T[P], AggregatePhrase[P]>
  }




  export type PhraseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhraseWhereInput
    orderBy?: PhraseOrderByWithAggregationInput | PhraseOrderByWithAggregationInput[]
    by: PhraseScalarFieldEnum[] | PhraseScalarFieldEnum
    having?: PhraseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhraseCountAggregateInputType | true
    _avg?: PhraseAvgAggregateInputType
    _sum?: PhraseSumAggregateInputType
    _min?: PhraseMinAggregateInputType
    _max?: PhraseMaxAggregateInputType
  }

  export type PhraseGroupByOutputType = {
    id: bigint
    sourceId: number
    type: string
    version: string
    index: number
    hash: string
    text: string
    createdAt: Date
    updatedAt: Date
    _count: PhraseCountAggregateOutputType | null
    _avg: PhraseAvgAggregateOutputType | null
    _sum: PhraseSumAggregateOutputType | null
    _min: PhraseMinAggregateOutputType | null
    _max: PhraseMaxAggregateOutputType | null
  }

  type GetPhraseGroupByPayload<T extends PhraseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhraseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhraseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhraseGroupByOutputType[P]>
            : GetScalarType<T[P], PhraseGroupByOutputType[P]>
        }
      >
    >


  export type PhraseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    type?: boolean
    version?: boolean
    index?: boolean
    hash?: boolean
    text?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["phrase"]>



  export type PhraseSelectScalar = {
    id?: boolean
    sourceId?: boolean
    type?: boolean
    version?: boolean
    index?: boolean
    hash?: boolean
    text?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PhraseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "type" | "version" | "index" | "hash" | "text" | "createdAt" | "updatedAt", ExtArgs["result"]["phrase"]>

  export type $PhrasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Phrase"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      sourceId: number
      type: string
      version: string
      index: number
      hash: string
      text: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["phrase"]>
    composites: {}
  }

  type PhraseGetPayload<S extends boolean | null | undefined | PhraseDefaultArgs> = $Result.GetResult<Prisma.$PhrasePayload, S>

  type PhraseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhraseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhraseCountAggregateInputType | true
    }

  export interface PhraseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Phrase'], meta: { name: 'Phrase' } }
    /**
     * Find zero or one Phrase that matches the filter.
     * @param {PhraseFindUniqueArgs} args - Arguments to find a Phrase
     * @example
     * // Get one Phrase
     * const phrase = await prisma.phrase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhraseFindUniqueArgs>(args: SelectSubset<T, PhraseFindUniqueArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Phrase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhraseFindUniqueOrThrowArgs} args - Arguments to find a Phrase
     * @example
     * // Get one Phrase
     * const phrase = await prisma.phrase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhraseFindUniqueOrThrowArgs>(args: SelectSubset<T, PhraseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Phrase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseFindFirstArgs} args - Arguments to find a Phrase
     * @example
     * // Get one Phrase
     * const phrase = await prisma.phrase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhraseFindFirstArgs>(args?: SelectSubset<T, PhraseFindFirstArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Phrase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseFindFirstOrThrowArgs} args - Arguments to find a Phrase
     * @example
     * // Get one Phrase
     * const phrase = await prisma.phrase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhraseFindFirstOrThrowArgs>(args?: SelectSubset<T, PhraseFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Phrases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Phrases
     * const phrases = await prisma.phrase.findMany()
     * 
     * // Get first 10 Phrases
     * const phrases = await prisma.phrase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const phraseWithIdOnly = await prisma.phrase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhraseFindManyArgs>(args?: SelectSubset<T, PhraseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Phrase.
     * @param {PhraseCreateArgs} args - Arguments to create a Phrase.
     * @example
     * // Create one Phrase
     * const Phrase = await prisma.phrase.create({
     *   data: {
     *     // ... data to create a Phrase
     *   }
     * })
     * 
     */
    create<T extends PhraseCreateArgs>(args: SelectSubset<T, PhraseCreateArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Phrases.
     * @param {PhraseCreateManyArgs} args - Arguments to create many Phrases.
     * @example
     * // Create many Phrases
     * const phrase = await prisma.phrase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhraseCreateManyArgs>(args?: SelectSubset<T, PhraseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Phrase.
     * @param {PhraseDeleteArgs} args - Arguments to delete one Phrase.
     * @example
     * // Delete one Phrase
     * const Phrase = await prisma.phrase.delete({
     *   where: {
     *     // ... filter to delete one Phrase
     *   }
     * })
     * 
     */
    delete<T extends PhraseDeleteArgs>(args: SelectSubset<T, PhraseDeleteArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Phrase.
     * @param {PhraseUpdateArgs} args - Arguments to update one Phrase.
     * @example
     * // Update one Phrase
     * const phrase = await prisma.phrase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhraseUpdateArgs>(args: SelectSubset<T, PhraseUpdateArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Phrases.
     * @param {PhraseDeleteManyArgs} args - Arguments to filter Phrases to delete.
     * @example
     * // Delete a few Phrases
     * const { count } = await prisma.phrase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhraseDeleteManyArgs>(args?: SelectSubset<T, PhraseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Phrases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Phrases
     * const phrase = await prisma.phrase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhraseUpdateManyArgs>(args: SelectSubset<T, PhraseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Phrase.
     * @param {PhraseUpsertArgs} args - Arguments to update or create a Phrase.
     * @example
     * // Update or create a Phrase
     * const phrase = await prisma.phrase.upsert({
     *   create: {
     *     // ... data to create a Phrase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Phrase we want to update
     *   }
     * })
     */
    upsert<T extends PhraseUpsertArgs>(args: SelectSubset<T, PhraseUpsertArgs<ExtArgs>>): Prisma__PhraseClient<$Result.GetResult<Prisma.$PhrasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Phrases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseCountArgs} args - Arguments to filter Phrases to count.
     * @example
     * // Count the number of Phrases
     * const count = await prisma.phrase.count({
     *   where: {
     *     // ... the filter for the Phrases we want to count
     *   }
     * })
    **/
    count<T extends PhraseCountArgs>(
      args?: Subset<T, PhraseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhraseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Phrase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhraseAggregateArgs>(args: Subset<T, PhraseAggregateArgs>): Prisma.PrismaPromise<GetPhraseAggregateType<T>>

    /**
     * Group by Phrase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhraseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhraseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhraseGroupByArgs['orderBy'] }
        : { orderBy?: PhraseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhraseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhraseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Phrase model
   */
  readonly fields: PhraseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Phrase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhraseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Phrase model
   */
  interface PhraseFieldRefs {
    readonly id: FieldRef<"Phrase", 'BigInt'>
    readonly sourceId: FieldRef<"Phrase", 'Int'>
    readonly type: FieldRef<"Phrase", 'String'>
    readonly version: FieldRef<"Phrase", 'String'>
    readonly index: FieldRef<"Phrase", 'Int'>
    readonly hash: FieldRef<"Phrase", 'String'>
    readonly text: FieldRef<"Phrase", 'String'>
    readonly createdAt: FieldRef<"Phrase", 'DateTime'>
    readonly updatedAt: FieldRef<"Phrase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Phrase findUnique
   */
  export type PhraseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * Filter, which Phrase to fetch.
     */
    where: PhraseWhereUniqueInput
  }

  /**
   * Phrase findUniqueOrThrow
   */
  export type PhraseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * Filter, which Phrase to fetch.
     */
    where: PhraseWhereUniqueInput
  }

  /**
   * Phrase findFirst
   */
  export type PhraseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * Filter, which Phrase to fetch.
     */
    where?: PhraseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phrases to fetch.
     */
    orderBy?: PhraseOrderByWithRelationInput | PhraseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Phrases.
     */
    cursor?: PhraseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phrases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phrases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Phrases.
     */
    distinct?: PhraseScalarFieldEnum | PhraseScalarFieldEnum[]
  }

  /**
   * Phrase findFirstOrThrow
   */
  export type PhraseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * Filter, which Phrase to fetch.
     */
    where?: PhraseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phrases to fetch.
     */
    orderBy?: PhraseOrderByWithRelationInput | PhraseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Phrases.
     */
    cursor?: PhraseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phrases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phrases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Phrases.
     */
    distinct?: PhraseScalarFieldEnum | PhraseScalarFieldEnum[]
  }

  /**
   * Phrase findMany
   */
  export type PhraseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * Filter, which Phrases to fetch.
     */
    where?: PhraseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phrases to fetch.
     */
    orderBy?: PhraseOrderByWithRelationInput | PhraseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Phrases.
     */
    cursor?: PhraseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phrases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phrases.
     */
    skip?: number
    distinct?: PhraseScalarFieldEnum | PhraseScalarFieldEnum[]
  }

  /**
   * Phrase create
   */
  export type PhraseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * The data needed to create a Phrase.
     */
    data: XOR<PhraseCreateInput, PhraseUncheckedCreateInput>
  }

  /**
   * Phrase createMany
   */
  export type PhraseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Phrases.
     */
    data: PhraseCreateManyInput | PhraseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Phrase update
   */
  export type PhraseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * The data needed to update a Phrase.
     */
    data: XOR<PhraseUpdateInput, PhraseUncheckedUpdateInput>
    /**
     * Choose, which Phrase to update.
     */
    where: PhraseWhereUniqueInput
  }

  /**
   * Phrase updateMany
   */
  export type PhraseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Phrases.
     */
    data: XOR<PhraseUpdateManyMutationInput, PhraseUncheckedUpdateManyInput>
    /**
     * Filter which Phrases to update
     */
    where?: PhraseWhereInput
    /**
     * Limit how many Phrases to update.
     */
    limit?: number
  }

  /**
   * Phrase upsert
   */
  export type PhraseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * The filter to search for the Phrase to update in case it exists.
     */
    where: PhraseWhereUniqueInput
    /**
     * In case the Phrase found by the `where` argument doesn't exist, create a new Phrase with this data.
     */
    create: XOR<PhraseCreateInput, PhraseUncheckedCreateInput>
    /**
     * In case the Phrase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhraseUpdateInput, PhraseUncheckedUpdateInput>
  }

  /**
   * Phrase delete
   */
  export type PhraseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
    /**
     * Filter which Phrase to delete.
     */
    where: PhraseWhereUniqueInput
  }

  /**
   * Phrase deleteMany
   */
  export type PhraseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Phrases to delete
     */
    where?: PhraseWhereInput
    /**
     * Limit how many Phrases to delete.
     */
    limit?: number
  }

  /**
   * Phrase without action
   */
  export type PhraseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phrase
     */
    select?: PhraseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Phrase
     */
    omit?: PhraseOmit<ExtArgs> | null
  }


  /**
   * Model Source
   */

  export type AggregateSource = {
    _count: SourceCountAggregateOutputType | null
    _avg: SourceAvgAggregateOutputType | null
    _sum: SourceSumAggregateOutputType | null
    _min: SourceMinAggregateOutputType | null
    _max: SourceMaxAggregateOutputType | null
  }

  export type SourceAvgAggregateOutputType = {
    id: number | null
  }

  export type SourceSumAggregateOutputType = {
    id: number | null
  }

  export type SourceMinAggregateOutputType = {
    id: number | null
    recipeUrl: string | null
    recipeDate: Date | null
    htmlContent: string | null
    version: string | null
    createdAt: Date | null
    updatedAt: Date | null
    checked: boolean | null
    flagged: boolean | null
    needsReview: string | null
  }

  export type SourceMaxAggregateOutputType = {
    id: number | null
    recipeUrl: string | null
    recipeDate: Date | null
    htmlContent: string | null
    version: string | null
    createdAt: Date | null
    updatedAt: Date | null
    checked: boolean | null
    flagged: boolean | null
    needsReview: string | null
  }

  export type SourceCountAggregateOutputType = {
    id: number
    recipeUrl: number
    recipeDate: number
    htmlContent: number
    jsonParsed: number
    jsonAltered: number
    version: number
    createdAt: number
    updatedAt: number
    checked: number
    flagged: number
    needsReview: number
    _all: number
  }


  export type SourceAvgAggregateInputType = {
    id?: true
  }

  export type SourceSumAggregateInputType = {
    id?: true
  }

  export type SourceMinAggregateInputType = {
    id?: true
    recipeUrl?: true
    recipeDate?: true
    htmlContent?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    checked?: true
    flagged?: true
    needsReview?: true
  }

  export type SourceMaxAggregateInputType = {
    id?: true
    recipeUrl?: true
    recipeDate?: true
    htmlContent?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    checked?: true
    flagged?: true
    needsReview?: true
  }

  export type SourceCountAggregateInputType = {
    id?: true
    recipeUrl?: true
    recipeDate?: true
    htmlContent?: true
    jsonParsed?: true
    jsonAltered?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    checked?: true
    flagged?: true
    needsReview?: true
    _all?: true
  }

  export type SourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Source to aggregate.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sources
    **/
    _count?: true | SourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SourceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SourceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SourceMaxAggregateInputType
  }

  export type GetSourceAggregateType<T extends SourceAggregateArgs> = {
        [P in keyof T & keyof AggregateSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSource[P]>
      : GetScalarType<T[P], AggregateSource[P]>
  }




  export type SourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceWhereInput
    orderBy?: SourceOrderByWithAggregationInput | SourceOrderByWithAggregationInput[]
    by: SourceScalarFieldEnum[] | SourceScalarFieldEnum
    having?: SourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SourceCountAggregateInputType | true
    _avg?: SourceAvgAggregateInputType
    _sum?: SourceSumAggregateInputType
    _min?: SourceMinAggregateInputType
    _max?: SourceMaxAggregateInputType
  }

  export type SourceGroupByOutputType = {
    id: number
    recipeUrl: string
    recipeDate: Date | null
    htmlContent: string | null
    jsonParsed: JsonValue | null
    jsonAltered: JsonValue | null
    version: string
    createdAt: Date
    updatedAt: Date
    checked: boolean
    flagged: boolean
    needsReview: string | null
    _count: SourceCountAggregateOutputType | null
    _avg: SourceAvgAggregateOutputType | null
    _sum: SourceSumAggregateOutputType | null
    _min: SourceMinAggregateOutputType | null
    _max: SourceMaxAggregateOutputType | null
  }

  type GetSourceGroupByPayload<T extends SourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SourceGroupByOutputType[P]>
            : GetScalarType<T[P], SourceGroupByOutputType[P]>
        }
      >
    >


  export type SourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipeUrl?: boolean
    recipeDate?: boolean
    htmlContent?: boolean
    jsonParsed?: boolean
    jsonAltered?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    checked?: boolean
    flagged?: boolean
    needsReview?: boolean
    sourceImages?: boolean | Source$sourceImagesArgs<ExtArgs>
    _count?: boolean | SourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["source"]>



  export type SourceSelectScalar = {
    id?: boolean
    recipeUrl?: boolean
    recipeDate?: boolean
    htmlContent?: boolean
    jsonParsed?: boolean
    jsonAltered?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    checked?: boolean
    flagged?: boolean
    needsReview?: boolean
  }

  export type SourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "recipeUrl" | "recipeDate" | "htmlContent" | "jsonParsed" | "jsonAltered" | "version" | "createdAt" | "updatedAt" | "checked" | "flagged" | "needsReview", ExtArgs["result"]["source"]>
  export type SourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sourceImages?: boolean | Source$sourceImagesArgs<ExtArgs>
    _count?: boolean | SourceCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Source"
    objects: {
      sourceImages: Prisma.$SourceImagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      recipeUrl: string
      recipeDate: Date | null
      htmlContent: string | null
      jsonParsed: Prisma.JsonValue | null
      jsonAltered: Prisma.JsonValue | null
      version: string
      createdAt: Date
      updatedAt: Date
      checked: boolean
      flagged: boolean
      needsReview: string | null
    }, ExtArgs["result"]["source"]>
    composites: {}
  }

  type SourceGetPayload<S extends boolean | null | undefined | SourceDefaultArgs> = $Result.GetResult<Prisma.$SourcePayload, S>

  type SourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SourceCountAggregateInputType | true
    }

  export interface SourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Source'], meta: { name: 'Source' } }
    /**
     * Find zero or one Source that matches the filter.
     * @param {SourceFindUniqueArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SourceFindUniqueArgs>(args: SelectSubset<T, SourceFindUniqueArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Source that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SourceFindUniqueOrThrowArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SourceFindUniqueOrThrowArgs>(args: SelectSubset<T, SourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Source that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceFindFirstArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SourceFindFirstArgs>(args?: SelectSubset<T, SourceFindFirstArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Source that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceFindFirstOrThrowArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SourceFindFirstOrThrowArgs>(args?: SelectSubset<T, SourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sources
     * const sources = await prisma.source.findMany()
     * 
     * // Get first 10 Sources
     * const sources = await prisma.source.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sourceWithIdOnly = await prisma.source.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SourceFindManyArgs>(args?: SelectSubset<T, SourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Source.
     * @param {SourceCreateArgs} args - Arguments to create a Source.
     * @example
     * // Create one Source
     * const Source = await prisma.source.create({
     *   data: {
     *     // ... data to create a Source
     *   }
     * })
     * 
     */
    create<T extends SourceCreateArgs>(args: SelectSubset<T, SourceCreateArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sources.
     * @param {SourceCreateManyArgs} args - Arguments to create many Sources.
     * @example
     * // Create many Sources
     * const source = await prisma.source.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SourceCreateManyArgs>(args?: SelectSubset<T, SourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Source.
     * @param {SourceDeleteArgs} args - Arguments to delete one Source.
     * @example
     * // Delete one Source
     * const Source = await prisma.source.delete({
     *   where: {
     *     // ... filter to delete one Source
     *   }
     * })
     * 
     */
    delete<T extends SourceDeleteArgs>(args: SelectSubset<T, SourceDeleteArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Source.
     * @param {SourceUpdateArgs} args - Arguments to update one Source.
     * @example
     * // Update one Source
     * const source = await prisma.source.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SourceUpdateArgs>(args: SelectSubset<T, SourceUpdateArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sources.
     * @param {SourceDeleteManyArgs} args - Arguments to filter Sources to delete.
     * @example
     * // Delete a few Sources
     * const { count } = await prisma.source.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SourceDeleteManyArgs>(args?: SelectSubset<T, SourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sources
     * const source = await prisma.source.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SourceUpdateManyArgs>(args: SelectSubset<T, SourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Source.
     * @param {SourceUpsertArgs} args - Arguments to update or create a Source.
     * @example
     * // Update or create a Source
     * const source = await prisma.source.upsert({
     *   create: {
     *     // ... data to create a Source
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Source we want to update
     *   }
     * })
     */
    upsert<T extends SourceUpsertArgs>(args: SelectSubset<T, SourceUpsertArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceCountArgs} args - Arguments to filter Sources to count.
     * @example
     * // Count the number of Sources
     * const count = await prisma.source.count({
     *   where: {
     *     // ... the filter for the Sources we want to count
     *   }
     * })
    **/
    count<T extends SourceCountArgs>(
      args?: Subset<T, SourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Source.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SourceAggregateArgs>(args: Subset<T, SourceAggregateArgs>): Prisma.PrismaPromise<GetSourceAggregateType<T>>

    /**
     * Group by Source.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SourceGroupByArgs['orderBy'] }
        : { orderBy?: SourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Source model
   */
  readonly fields: SourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Source.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sourceImages<T extends Source$sourceImagesArgs<ExtArgs> = {}>(args?: Subset<T, Source$sourceImagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Source model
   */
  interface SourceFieldRefs {
    readonly id: FieldRef<"Source", 'Int'>
    readonly recipeUrl: FieldRef<"Source", 'String'>
    readonly recipeDate: FieldRef<"Source", 'DateTime'>
    readonly htmlContent: FieldRef<"Source", 'String'>
    readonly jsonParsed: FieldRef<"Source", 'Json'>
    readonly jsonAltered: FieldRef<"Source", 'Json'>
    readonly version: FieldRef<"Source", 'String'>
    readonly createdAt: FieldRef<"Source", 'DateTime'>
    readonly updatedAt: FieldRef<"Source", 'DateTime'>
    readonly checked: FieldRef<"Source", 'Boolean'>
    readonly flagged: FieldRef<"Source", 'Boolean'>
    readonly needsReview: FieldRef<"Source", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Source findUnique
   */
  export type SourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source findUniqueOrThrow
   */
  export type SourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source findFirst
   */
  export type SourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sources.
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sources.
     */
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * Source findFirstOrThrow
   */
  export type SourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sources.
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sources.
     */
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * Source findMany
   */
  export type SourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Sources to fetch.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sources.
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * Source create
   */
  export type SourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * The data needed to create a Source.
     */
    data: XOR<SourceCreateInput, SourceUncheckedCreateInput>
  }

  /**
   * Source createMany
   */
  export type SourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sources.
     */
    data: SourceCreateManyInput | SourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Source update
   */
  export type SourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * The data needed to update a Source.
     */
    data: XOR<SourceUpdateInput, SourceUncheckedUpdateInput>
    /**
     * Choose, which Source to update.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source updateMany
   */
  export type SourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sources.
     */
    data: XOR<SourceUpdateManyMutationInput, SourceUncheckedUpdateManyInput>
    /**
     * Filter which Sources to update
     */
    where?: SourceWhereInput
    /**
     * Limit how many Sources to update.
     */
    limit?: number
  }

  /**
   * Source upsert
   */
  export type SourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * The filter to search for the Source to update in case it exists.
     */
    where: SourceWhereUniqueInput
    /**
     * In case the Source found by the `where` argument doesn't exist, create a new Source with this data.
     */
    create: XOR<SourceCreateInput, SourceUncheckedCreateInput>
    /**
     * In case the Source was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SourceUpdateInput, SourceUncheckedUpdateInput>
  }

  /**
   * Source delete
   */
  export type SourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter which Source to delete.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source deleteMany
   */
  export type SourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sources to delete
     */
    where?: SourceWhereInput
    /**
     * Limit how many Sources to delete.
     */
    limit?: number
  }

  /**
   * Source.sourceImages
   */
  export type Source$sourceImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    where?: SourceImageWhereInput
    orderBy?: SourceImageOrderByWithRelationInput | SourceImageOrderByWithRelationInput[]
    cursor?: SourceImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SourceImageScalarFieldEnum | SourceImageScalarFieldEnum[]
  }

  /**
   * Source without action
   */
  export type SourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
  }


  /**
   * Model SourceImage
   */

  export type AggregateSourceImage = {
    _count: SourceImageCountAggregateOutputType | null
    _avg: SourceImageAvgAggregateOutputType | null
    _sum: SourceImageSumAggregateOutputType | null
    _min: SourceImageMinAggregateOutputType | null
    _max: SourceImageMaxAggregateOutputType | null
  }

  export type SourceImageAvgAggregateOutputType = {
    id: number | null
    sourceId: number | null
    order: number | null
  }

  export type SourceImageSumAggregateOutputType = {
    id: number | null
    sourceId: number | null
    order: number | null
  }

  export type SourceImageMinAggregateOutputType = {
    id: number | null
    sourceId: number | null
    stableId: string | null
    url: string | null
    alt: string | null
    isLead: boolean | null
    order: number | null
    downloaded: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SourceImageMaxAggregateOutputType = {
    id: number | null
    sourceId: number | null
    stableId: string | null
    url: string | null
    alt: string | null
    isLead: boolean | null
    order: number | null
    downloaded: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SourceImageCountAggregateOutputType = {
    id: number
    sourceId: number
    stableId: number
    url: number
    alt: number
    isLead: number
    order: number
    downloaded: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SourceImageAvgAggregateInputType = {
    id?: true
    sourceId?: true
    order?: true
  }

  export type SourceImageSumAggregateInputType = {
    id?: true
    sourceId?: true
    order?: true
  }

  export type SourceImageMinAggregateInputType = {
    id?: true
    sourceId?: true
    stableId?: true
    url?: true
    alt?: true
    isLead?: true
    order?: true
    downloaded?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SourceImageMaxAggregateInputType = {
    id?: true
    sourceId?: true
    stableId?: true
    url?: true
    alt?: true
    isLead?: true
    order?: true
    downloaded?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SourceImageCountAggregateInputType = {
    id?: true
    sourceId?: true
    stableId?: true
    url?: true
    alt?: true
    isLead?: true
    order?: true
    downloaded?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SourceImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceImage to aggregate.
     */
    where?: SourceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceImages to fetch.
     */
    orderBy?: SourceImageOrderByWithRelationInput | SourceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SourceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SourceImages
    **/
    _count?: true | SourceImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SourceImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SourceImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SourceImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SourceImageMaxAggregateInputType
  }

  export type GetSourceImageAggregateType<T extends SourceImageAggregateArgs> = {
        [P in keyof T & keyof AggregateSourceImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSourceImage[P]>
      : GetScalarType<T[P], AggregateSourceImage[P]>
  }




  export type SourceImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceImageWhereInput
    orderBy?: SourceImageOrderByWithAggregationInput | SourceImageOrderByWithAggregationInput[]
    by: SourceImageScalarFieldEnum[] | SourceImageScalarFieldEnum
    having?: SourceImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SourceImageCountAggregateInputType | true
    _avg?: SourceImageAvgAggregateInputType
    _sum?: SourceImageSumAggregateInputType
    _min?: SourceImageMinAggregateInputType
    _max?: SourceImageMaxAggregateInputType
  }

  export type SourceImageGroupByOutputType = {
    id: number
    sourceId: number | null
    stableId: string | null
    url: string | null
    alt: string | null
    isLead: boolean
    order: number
    downloaded: boolean
    createdAt: Date
    updatedAt: Date
    _count: SourceImageCountAggregateOutputType | null
    _avg: SourceImageAvgAggregateOutputType | null
    _sum: SourceImageSumAggregateOutputType | null
    _min: SourceImageMinAggregateOutputType | null
    _max: SourceImageMaxAggregateOutputType | null
  }

  type GetSourceImageGroupByPayload<T extends SourceImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SourceImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SourceImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SourceImageGroupByOutputType[P]>
            : GetScalarType<T[P], SourceImageGroupByOutputType[P]>
        }
      >
    >


  export type SourceImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    stableId?: boolean
    url?: boolean
    alt?: boolean
    isLead?: boolean
    order?: boolean
    downloaded?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    source?: boolean | SourceImage$sourceArgs<ExtArgs>
  }, ExtArgs["result"]["sourceImage"]>



  export type SourceImageSelectScalar = {
    id?: boolean
    sourceId?: boolean
    stableId?: boolean
    url?: boolean
    alt?: boolean
    isLead?: boolean
    order?: boolean
    downloaded?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SourceImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "stableId" | "url" | "alt" | "isLead" | "order" | "downloaded" | "createdAt" | "updatedAt", ExtArgs["result"]["sourceImage"]>
  export type SourceImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceImage$sourceArgs<ExtArgs>
  }

  export type $SourceImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SourceImage"
    objects: {
      source: Prisma.$SourcePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      sourceId: number | null
      stableId: string | null
      url: string | null
      alt: string | null
      isLead: boolean
      order: number
      downloaded: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sourceImage"]>
    composites: {}
  }

  type SourceImageGetPayload<S extends boolean | null | undefined | SourceImageDefaultArgs> = $Result.GetResult<Prisma.$SourceImagePayload, S>

  type SourceImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SourceImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SourceImageCountAggregateInputType | true
    }

  export interface SourceImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SourceImage'], meta: { name: 'SourceImage' } }
    /**
     * Find zero or one SourceImage that matches the filter.
     * @param {SourceImageFindUniqueArgs} args - Arguments to find a SourceImage
     * @example
     * // Get one SourceImage
     * const sourceImage = await prisma.sourceImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SourceImageFindUniqueArgs>(args: SelectSubset<T, SourceImageFindUniqueArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SourceImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SourceImageFindUniqueOrThrowArgs} args - Arguments to find a SourceImage
     * @example
     * // Get one SourceImage
     * const sourceImage = await prisma.sourceImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SourceImageFindUniqueOrThrowArgs>(args: SelectSubset<T, SourceImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SourceImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageFindFirstArgs} args - Arguments to find a SourceImage
     * @example
     * // Get one SourceImage
     * const sourceImage = await prisma.sourceImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SourceImageFindFirstArgs>(args?: SelectSubset<T, SourceImageFindFirstArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SourceImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageFindFirstOrThrowArgs} args - Arguments to find a SourceImage
     * @example
     * // Get one SourceImage
     * const sourceImage = await prisma.sourceImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SourceImageFindFirstOrThrowArgs>(args?: SelectSubset<T, SourceImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SourceImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SourceImages
     * const sourceImages = await prisma.sourceImage.findMany()
     * 
     * // Get first 10 SourceImages
     * const sourceImages = await prisma.sourceImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sourceImageWithIdOnly = await prisma.sourceImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SourceImageFindManyArgs>(args?: SelectSubset<T, SourceImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SourceImage.
     * @param {SourceImageCreateArgs} args - Arguments to create a SourceImage.
     * @example
     * // Create one SourceImage
     * const SourceImage = await prisma.sourceImage.create({
     *   data: {
     *     // ... data to create a SourceImage
     *   }
     * })
     * 
     */
    create<T extends SourceImageCreateArgs>(args: SelectSubset<T, SourceImageCreateArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SourceImages.
     * @param {SourceImageCreateManyArgs} args - Arguments to create many SourceImages.
     * @example
     * // Create many SourceImages
     * const sourceImage = await prisma.sourceImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SourceImageCreateManyArgs>(args?: SelectSubset<T, SourceImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SourceImage.
     * @param {SourceImageDeleteArgs} args - Arguments to delete one SourceImage.
     * @example
     * // Delete one SourceImage
     * const SourceImage = await prisma.sourceImage.delete({
     *   where: {
     *     // ... filter to delete one SourceImage
     *   }
     * })
     * 
     */
    delete<T extends SourceImageDeleteArgs>(args: SelectSubset<T, SourceImageDeleteArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SourceImage.
     * @param {SourceImageUpdateArgs} args - Arguments to update one SourceImage.
     * @example
     * // Update one SourceImage
     * const sourceImage = await prisma.sourceImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SourceImageUpdateArgs>(args: SelectSubset<T, SourceImageUpdateArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SourceImages.
     * @param {SourceImageDeleteManyArgs} args - Arguments to filter SourceImages to delete.
     * @example
     * // Delete a few SourceImages
     * const { count } = await prisma.sourceImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SourceImageDeleteManyArgs>(args?: SelectSubset<T, SourceImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SourceImages
     * const sourceImage = await prisma.sourceImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SourceImageUpdateManyArgs>(args: SelectSubset<T, SourceImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SourceImage.
     * @param {SourceImageUpsertArgs} args - Arguments to update or create a SourceImage.
     * @example
     * // Update or create a SourceImage
     * const sourceImage = await prisma.sourceImage.upsert({
     *   create: {
     *     // ... data to create a SourceImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SourceImage we want to update
     *   }
     * })
     */
    upsert<T extends SourceImageUpsertArgs>(args: SelectSubset<T, SourceImageUpsertArgs<ExtArgs>>): Prisma__SourceImageClient<$Result.GetResult<Prisma.$SourceImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SourceImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageCountArgs} args - Arguments to filter SourceImages to count.
     * @example
     * // Count the number of SourceImages
     * const count = await prisma.sourceImage.count({
     *   where: {
     *     // ... the filter for the SourceImages we want to count
     *   }
     * })
    **/
    count<T extends SourceImageCountArgs>(
      args?: Subset<T, SourceImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SourceImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SourceImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SourceImageAggregateArgs>(args: Subset<T, SourceImageAggregateArgs>): Prisma.PrismaPromise<GetSourceImageAggregateType<T>>

    /**
     * Group by SourceImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SourceImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SourceImageGroupByArgs['orderBy'] }
        : { orderBy?: SourceImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SourceImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSourceImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SourceImage model
   */
  readonly fields: SourceImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SourceImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SourceImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends SourceImage$sourceArgs<ExtArgs> = {}>(args?: Subset<T, SourceImage$sourceArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SourceImage model
   */
  interface SourceImageFieldRefs {
    readonly id: FieldRef<"SourceImage", 'Int'>
    readonly sourceId: FieldRef<"SourceImage", 'Int'>
    readonly stableId: FieldRef<"SourceImage", 'String'>
    readonly url: FieldRef<"SourceImage", 'String'>
    readonly alt: FieldRef<"SourceImage", 'String'>
    readonly isLead: FieldRef<"SourceImage", 'Boolean'>
    readonly order: FieldRef<"SourceImage", 'Int'>
    readonly downloaded: FieldRef<"SourceImage", 'Boolean'>
    readonly createdAt: FieldRef<"SourceImage", 'DateTime'>
    readonly updatedAt: FieldRef<"SourceImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SourceImage findUnique
   */
  export type SourceImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * Filter, which SourceImage to fetch.
     */
    where: SourceImageWhereUniqueInput
  }

  /**
   * SourceImage findUniqueOrThrow
   */
  export type SourceImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * Filter, which SourceImage to fetch.
     */
    where: SourceImageWhereUniqueInput
  }

  /**
   * SourceImage findFirst
   */
  export type SourceImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * Filter, which SourceImage to fetch.
     */
    where?: SourceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceImages to fetch.
     */
    orderBy?: SourceImageOrderByWithRelationInput | SourceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceImages.
     */
    cursor?: SourceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceImages.
     */
    distinct?: SourceImageScalarFieldEnum | SourceImageScalarFieldEnum[]
  }

  /**
   * SourceImage findFirstOrThrow
   */
  export type SourceImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * Filter, which SourceImage to fetch.
     */
    where?: SourceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceImages to fetch.
     */
    orderBy?: SourceImageOrderByWithRelationInput | SourceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceImages.
     */
    cursor?: SourceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceImages.
     */
    distinct?: SourceImageScalarFieldEnum | SourceImageScalarFieldEnum[]
  }

  /**
   * SourceImage findMany
   */
  export type SourceImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * Filter, which SourceImages to fetch.
     */
    where?: SourceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceImages to fetch.
     */
    orderBy?: SourceImageOrderByWithRelationInput | SourceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SourceImages.
     */
    cursor?: SourceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceImages.
     */
    skip?: number
    distinct?: SourceImageScalarFieldEnum | SourceImageScalarFieldEnum[]
  }

  /**
   * SourceImage create
   */
  export type SourceImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * The data needed to create a SourceImage.
     */
    data?: XOR<SourceImageCreateInput, SourceImageUncheckedCreateInput>
  }

  /**
   * SourceImage createMany
   */
  export type SourceImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SourceImages.
     */
    data: SourceImageCreateManyInput | SourceImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SourceImage update
   */
  export type SourceImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * The data needed to update a SourceImage.
     */
    data: XOR<SourceImageUpdateInput, SourceImageUncheckedUpdateInput>
    /**
     * Choose, which SourceImage to update.
     */
    where: SourceImageWhereUniqueInput
  }

  /**
   * SourceImage updateMany
   */
  export type SourceImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SourceImages.
     */
    data: XOR<SourceImageUpdateManyMutationInput, SourceImageUncheckedUpdateManyInput>
    /**
     * Filter which SourceImages to update
     */
    where?: SourceImageWhereInput
    /**
     * Limit how many SourceImages to update.
     */
    limit?: number
  }

  /**
   * SourceImage upsert
   */
  export type SourceImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * The filter to search for the SourceImage to update in case it exists.
     */
    where: SourceImageWhereUniqueInput
    /**
     * In case the SourceImage found by the `where` argument doesn't exist, create a new SourceImage with this data.
     */
    create: XOR<SourceImageCreateInput, SourceImageUncheckedCreateInput>
    /**
     * In case the SourceImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SourceImageUpdateInput, SourceImageUncheckedUpdateInput>
  }

  /**
   * SourceImage delete
   */
  export type SourceImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
    /**
     * Filter which SourceImage to delete.
     */
    where: SourceImageWhereUniqueInput
  }

  /**
   * SourceImage deleteMany
   */
  export type SourceImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceImages to delete
     */
    where?: SourceImageWhereInput
    /**
     * Limit how many SourceImages to delete.
     */
    limit?: number
  }

  /**
   * SourceImage.source
   */
  export type SourceImage$sourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    where?: SourceWhereInput
  }

  /**
   * SourceImage without action
   */
  export type SourceImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceImage
     */
    select?: SourceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceImage
     */
    omit?: SourceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceImageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    parentId: 'parentId',
    title: 'title',
    slug: 'slug',
    keywords: 'keywords',
    createdAt: 'createdAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const IngredientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt'
  };

  export type IngredientScalarFieldEnum = (typeof IngredientScalarFieldEnum)[keyof typeof IngredientScalarFieldEnum]


  export const PhraseScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    type: 'type',
    version: 'version',
    index: 'index',
    hash: 'hash',
    text: 'text',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PhraseScalarFieldEnum = (typeof PhraseScalarFieldEnum)[keyof typeof PhraseScalarFieldEnum]


  export const SourceScalarFieldEnum: {
    id: 'id',
    recipeUrl: 'recipeUrl',
    recipeDate: 'recipeDate',
    htmlContent: 'htmlContent',
    jsonParsed: 'jsonParsed',
    jsonAltered: 'jsonAltered',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    checked: 'checked',
    flagged: 'flagged',
    needsReview: 'needsReview'
  };

  export type SourceScalarFieldEnum = (typeof SourceScalarFieldEnum)[keyof typeof SourceScalarFieldEnum]


  export const SourceImageScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    stableId: 'stableId',
    url: 'url',
    alt: 'alt',
    isLead: 'isLead',
    order: 'order',
    downloaded: 'downloaded',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SourceImageScalarFieldEnum = (typeof SourceImageScalarFieldEnum)[keyof typeof SourceImageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const CategoryOrderByRelevanceFieldEnum: {
    title: 'title',
    slug: 'slug'
  };

  export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum]


  export const TagOrderByRelevanceFieldEnum: {
    name: 'name',
    slug: 'slug'
  };

  export type TagOrderByRelevanceFieldEnum = (typeof TagOrderByRelevanceFieldEnum)[keyof typeof TagOrderByRelevanceFieldEnum]


  export const IngredientOrderByRelevanceFieldEnum: {
    name: 'name',
    slug: 'slug'
  };

  export type IngredientOrderByRelevanceFieldEnum = (typeof IngredientOrderByRelevanceFieldEnum)[keyof typeof IngredientOrderByRelevanceFieldEnum]


  export const PhraseOrderByRelevanceFieldEnum: {
    type: 'type',
    version: 'version',
    hash: 'hash',
    text: 'text'
  };

  export type PhraseOrderByRelevanceFieldEnum = (typeof PhraseOrderByRelevanceFieldEnum)[keyof typeof PhraseOrderByRelevanceFieldEnum]


  export const SourceOrderByRelevanceFieldEnum: {
    recipeUrl: 'recipeUrl',
    htmlContent: 'htmlContent',
    version: 'version',
    needsReview: 'needsReview'
  };

  export type SourceOrderByRelevanceFieldEnum = (typeof SourceOrderByRelevanceFieldEnum)[keyof typeof SourceOrderByRelevanceFieldEnum]


  export const SourceImageOrderByRelevanceFieldEnum: {
    stableId: 'stableId',
    url: 'url',
    alt: 'alt'
  };

  export type SourceImageOrderByRelevanceFieldEnum = (typeof SourceImageOrderByRelevanceFieldEnum)[keyof typeof SourceImageOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    parentId?: IntNullableFilter<"Category"> | number | null
    title?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    keywords?: JsonNullableFilter<"Category">
    createdAt?: DateTimeFilter<"Category"> | Date | string
    parent?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    children?: CategoryListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    parentId?: SortOrderInput | SortOrder
    title?: SortOrder
    slug?: SortOrder
    keywords?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    parent?: CategoryOrderByWithRelationInput
    children?: CategoryOrderByRelationAggregateInput
    _relevance?: CategoryOrderByRelevanceInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    parentId_slug?: CategoryParentIdSlugCompoundUniqueInput
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    parentId?: IntNullableFilter<"Category"> | number | null
    title?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    keywords?: JsonNullableFilter<"Category">
    createdAt?: DateTimeFilter<"Category"> | Date | string
    parent?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    children?: CategoryListRelationFilter
  }, "id" | "parentId_slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    parentId?: SortOrderInput | SortOrder
    title?: SortOrder
    slug?: SortOrder
    keywords?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    parentId?: IntNullableWithAggregatesFilter<"Category"> | number | null
    title?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    keywords?: JsonNullableWithAggregatesFilter<"Category">
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: IntFilter<"Tag"> | number
    name?: StringFilter<"Tag"> | string
    slug?: StringFilter<"Tag"> | string
    createdAt?: DateTimeFilter<"Tag"> | Date | string
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    _relevance?: TagOrderByRelevanceInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    name?: StringFilter<"Tag"> | string
    createdAt?: DateTimeFilter<"Tag"> | Date | string
  }, "id" | "slug">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _avg?: TagAvgOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
    _sum?: TagSumOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Tag"> | number
    name?: StringWithAggregatesFilter<"Tag"> | string
    slug?: StringWithAggregatesFilter<"Tag"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
  }

  export type IngredientWhereInput = {
    AND?: IngredientWhereInput | IngredientWhereInput[]
    OR?: IngredientWhereInput[]
    NOT?: IngredientWhereInput | IngredientWhereInput[]
    id?: BigIntFilter<"Ingredient"> | bigint | number
    name?: StringFilter<"Ingredient"> | string
    slug?: StringFilter<"Ingredient"> | string
    createdAt?: DateTimeFilter<"Ingredient"> | Date | string
  }

  export type IngredientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    _relevance?: IngredientOrderByRelevanceInput
  }

  export type IngredientWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    slug?: string
    AND?: IngredientWhereInput | IngredientWhereInput[]
    OR?: IngredientWhereInput[]
    NOT?: IngredientWhereInput | IngredientWhereInput[]
    name?: StringFilter<"Ingredient"> | string
    createdAt?: DateTimeFilter<"Ingredient"> | Date | string
  }, "id" | "slug">

  export type IngredientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    _count?: IngredientCountOrderByAggregateInput
    _avg?: IngredientAvgOrderByAggregateInput
    _max?: IngredientMaxOrderByAggregateInput
    _min?: IngredientMinOrderByAggregateInput
    _sum?: IngredientSumOrderByAggregateInput
  }

  export type IngredientScalarWhereWithAggregatesInput = {
    AND?: IngredientScalarWhereWithAggregatesInput | IngredientScalarWhereWithAggregatesInput[]
    OR?: IngredientScalarWhereWithAggregatesInput[]
    NOT?: IngredientScalarWhereWithAggregatesInput | IngredientScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Ingredient"> | bigint | number
    name?: StringWithAggregatesFilter<"Ingredient"> | string
    slug?: StringWithAggregatesFilter<"Ingredient"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Ingredient"> | Date | string
  }

  export type PhraseWhereInput = {
    AND?: PhraseWhereInput | PhraseWhereInput[]
    OR?: PhraseWhereInput[]
    NOT?: PhraseWhereInput | PhraseWhereInput[]
    id?: BigIntFilter<"Phrase"> | bigint | number
    sourceId?: IntFilter<"Phrase"> | number
    type?: StringFilter<"Phrase"> | string
    version?: StringFilter<"Phrase"> | string
    index?: IntFilter<"Phrase"> | number
    hash?: StringFilter<"Phrase"> | string
    text?: StringFilter<"Phrase"> | string
    createdAt?: DateTimeFilter<"Phrase"> | Date | string
    updatedAt?: DateTimeFilter<"Phrase"> | Date | string
  }

  export type PhraseOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    type?: SortOrder
    version?: SortOrder
    index?: SortOrder
    hash?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: PhraseOrderByRelevanceInput
  }

  export type PhraseWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    sourceId_hash_version_index?: PhraseSourceIdHashVersionIndexCompoundUniqueInput
    AND?: PhraseWhereInput | PhraseWhereInput[]
    OR?: PhraseWhereInput[]
    NOT?: PhraseWhereInput | PhraseWhereInput[]
    sourceId?: IntFilter<"Phrase"> | number
    type?: StringFilter<"Phrase"> | string
    version?: StringFilter<"Phrase"> | string
    index?: IntFilter<"Phrase"> | number
    hash?: StringFilter<"Phrase"> | string
    text?: StringFilter<"Phrase"> | string
    createdAt?: DateTimeFilter<"Phrase"> | Date | string
    updatedAt?: DateTimeFilter<"Phrase"> | Date | string
  }, "id" | "sourceId_hash_version_index">

  export type PhraseOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    type?: SortOrder
    version?: SortOrder
    index?: SortOrder
    hash?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PhraseCountOrderByAggregateInput
    _avg?: PhraseAvgOrderByAggregateInput
    _max?: PhraseMaxOrderByAggregateInput
    _min?: PhraseMinOrderByAggregateInput
    _sum?: PhraseSumOrderByAggregateInput
  }

  export type PhraseScalarWhereWithAggregatesInput = {
    AND?: PhraseScalarWhereWithAggregatesInput | PhraseScalarWhereWithAggregatesInput[]
    OR?: PhraseScalarWhereWithAggregatesInput[]
    NOT?: PhraseScalarWhereWithAggregatesInput | PhraseScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Phrase"> | bigint | number
    sourceId?: IntWithAggregatesFilter<"Phrase"> | number
    type?: StringWithAggregatesFilter<"Phrase"> | string
    version?: StringWithAggregatesFilter<"Phrase"> | string
    index?: IntWithAggregatesFilter<"Phrase"> | number
    hash?: StringWithAggregatesFilter<"Phrase"> | string
    text?: StringWithAggregatesFilter<"Phrase"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Phrase"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Phrase"> | Date | string
  }

  export type SourceWhereInput = {
    AND?: SourceWhereInput | SourceWhereInput[]
    OR?: SourceWhereInput[]
    NOT?: SourceWhereInput | SourceWhereInput[]
    id?: IntFilter<"Source"> | number
    recipeUrl?: StringFilter<"Source"> | string
    recipeDate?: DateTimeNullableFilter<"Source"> | Date | string | null
    htmlContent?: StringNullableFilter<"Source"> | string | null
    jsonParsed?: JsonNullableFilter<"Source">
    jsonAltered?: JsonNullableFilter<"Source">
    version?: StringFilter<"Source"> | string
    createdAt?: DateTimeFilter<"Source"> | Date | string
    updatedAt?: DateTimeFilter<"Source"> | Date | string
    checked?: BoolFilter<"Source"> | boolean
    flagged?: BoolFilter<"Source"> | boolean
    needsReview?: StringNullableFilter<"Source"> | string | null
    sourceImages?: SourceImageListRelationFilter
  }

  export type SourceOrderByWithRelationInput = {
    id?: SortOrder
    recipeUrl?: SortOrder
    recipeDate?: SortOrderInput | SortOrder
    htmlContent?: SortOrderInput | SortOrder
    jsonParsed?: SortOrderInput | SortOrder
    jsonAltered?: SortOrderInput | SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    checked?: SortOrder
    flagged?: SortOrder
    needsReview?: SortOrderInput | SortOrder
    sourceImages?: SourceImageOrderByRelationAggregateInput
    _relevance?: SourceOrderByRelevanceInput
  }

  export type SourceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    recipeUrl?: string
    AND?: SourceWhereInput | SourceWhereInput[]
    OR?: SourceWhereInput[]
    NOT?: SourceWhereInput | SourceWhereInput[]
    recipeDate?: DateTimeNullableFilter<"Source"> | Date | string | null
    htmlContent?: StringNullableFilter<"Source"> | string | null
    jsonParsed?: JsonNullableFilter<"Source">
    jsonAltered?: JsonNullableFilter<"Source">
    version?: StringFilter<"Source"> | string
    createdAt?: DateTimeFilter<"Source"> | Date | string
    updatedAt?: DateTimeFilter<"Source"> | Date | string
    checked?: BoolFilter<"Source"> | boolean
    flagged?: BoolFilter<"Source"> | boolean
    needsReview?: StringNullableFilter<"Source"> | string | null
    sourceImages?: SourceImageListRelationFilter
  }, "id" | "recipeUrl">

  export type SourceOrderByWithAggregationInput = {
    id?: SortOrder
    recipeUrl?: SortOrder
    recipeDate?: SortOrderInput | SortOrder
    htmlContent?: SortOrderInput | SortOrder
    jsonParsed?: SortOrderInput | SortOrder
    jsonAltered?: SortOrderInput | SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    checked?: SortOrder
    flagged?: SortOrder
    needsReview?: SortOrderInput | SortOrder
    _count?: SourceCountOrderByAggregateInput
    _avg?: SourceAvgOrderByAggregateInput
    _max?: SourceMaxOrderByAggregateInput
    _min?: SourceMinOrderByAggregateInput
    _sum?: SourceSumOrderByAggregateInput
  }

  export type SourceScalarWhereWithAggregatesInput = {
    AND?: SourceScalarWhereWithAggregatesInput | SourceScalarWhereWithAggregatesInput[]
    OR?: SourceScalarWhereWithAggregatesInput[]
    NOT?: SourceScalarWhereWithAggregatesInput | SourceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Source"> | number
    recipeUrl?: StringWithAggregatesFilter<"Source"> | string
    recipeDate?: DateTimeNullableWithAggregatesFilter<"Source"> | Date | string | null
    htmlContent?: StringNullableWithAggregatesFilter<"Source"> | string | null
    jsonParsed?: JsonNullableWithAggregatesFilter<"Source">
    jsonAltered?: JsonNullableWithAggregatesFilter<"Source">
    version?: StringWithAggregatesFilter<"Source"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Source"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Source"> | Date | string
    checked?: BoolWithAggregatesFilter<"Source"> | boolean
    flagged?: BoolWithAggregatesFilter<"Source"> | boolean
    needsReview?: StringNullableWithAggregatesFilter<"Source"> | string | null
  }

  export type SourceImageWhereInput = {
    AND?: SourceImageWhereInput | SourceImageWhereInput[]
    OR?: SourceImageWhereInput[]
    NOT?: SourceImageWhereInput | SourceImageWhereInput[]
    id?: IntFilter<"SourceImage"> | number
    sourceId?: IntNullableFilter<"SourceImage"> | number | null
    stableId?: StringNullableFilter<"SourceImage"> | string | null
    url?: StringNullableFilter<"SourceImage"> | string | null
    alt?: StringNullableFilter<"SourceImage"> | string | null
    isLead?: BoolFilter<"SourceImage"> | boolean
    order?: IntFilter<"SourceImage"> | number
    downloaded?: BoolFilter<"SourceImage"> | boolean
    createdAt?: DateTimeFilter<"SourceImage"> | Date | string
    updatedAt?: DateTimeFilter<"SourceImage"> | Date | string
    source?: XOR<SourceNullableScalarRelationFilter, SourceWhereInput> | null
  }

  export type SourceImageOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    stableId?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    alt?: SortOrderInput | SortOrder
    isLead?: SortOrder
    order?: SortOrder
    downloaded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    source?: SourceOrderByWithRelationInput
    _relevance?: SourceImageOrderByRelevanceInput
  }

  export type SourceImageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    sourceId_stableId?: SourceImageSourceIdStableIdCompoundUniqueInput
    AND?: SourceImageWhereInput | SourceImageWhereInput[]
    OR?: SourceImageWhereInput[]
    NOT?: SourceImageWhereInput | SourceImageWhereInput[]
    sourceId?: IntNullableFilter<"SourceImage"> | number | null
    stableId?: StringNullableFilter<"SourceImage"> | string | null
    url?: StringNullableFilter<"SourceImage"> | string | null
    alt?: StringNullableFilter<"SourceImage"> | string | null
    isLead?: BoolFilter<"SourceImage"> | boolean
    order?: IntFilter<"SourceImage"> | number
    downloaded?: BoolFilter<"SourceImage"> | boolean
    createdAt?: DateTimeFilter<"SourceImage"> | Date | string
    updatedAt?: DateTimeFilter<"SourceImage"> | Date | string
    source?: XOR<SourceNullableScalarRelationFilter, SourceWhereInput> | null
  }, "id" | "sourceId_stableId">

  export type SourceImageOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    stableId?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    alt?: SortOrderInput | SortOrder
    isLead?: SortOrder
    order?: SortOrder
    downloaded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SourceImageCountOrderByAggregateInput
    _avg?: SourceImageAvgOrderByAggregateInput
    _max?: SourceImageMaxOrderByAggregateInput
    _min?: SourceImageMinOrderByAggregateInput
    _sum?: SourceImageSumOrderByAggregateInput
  }

  export type SourceImageScalarWhereWithAggregatesInput = {
    AND?: SourceImageScalarWhereWithAggregatesInput | SourceImageScalarWhereWithAggregatesInput[]
    OR?: SourceImageScalarWhereWithAggregatesInput[]
    NOT?: SourceImageScalarWhereWithAggregatesInput | SourceImageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SourceImage"> | number
    sourceId?: IntNullableWithAggregatesFilter<"SourceImage"> | number | null
    stableId?: StringNullableWithAggregatesFilter<"SourceImage"> | string | null
    url?: StringNullableWithAggregatesFilter<"SourceImage"> | string | null
    alt?: StringNullableWithAggregatesFilter<"SourceImage"> | string | null
    isLead?: BoolWithAggregatesFilter<"SourceImage"> | boolean
    order?: IntWithAggregatesFilter<"SourceImage"> | number
    downloaded?: BoolWithAggregatesFilter<"SourceImage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SourceImage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SourceImage"> | Date | string
  }

  export type CategoryCreateInput = {
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    parent?: CategoryCreateNestedOneWithoutChildrenInput
    children?: CategoryCreateNestedManyWithoutParentInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    parentId?: number | null
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput
  }

  export type CategoryUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: CategoryUpdateOneWithoutChildrenNestedInput
    children?: CategoryUpdateManyWithoutParentNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    parentId?: number | null
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateInput = {
    name: string
    slug: string
    createdAt?: Date | string
  }

  export type TagUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
  }

  export type TagUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateManyInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
  }

  export type TagUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientCreateInput = {
    id?: bigint | number
    name: string
    slug: string
    createdAt?: Date | string
  }

  export type IngredientUncheckedCreateInput = {
    id?: bigint | number
    name: string
    slug: string
    createdAt?: Date | string
  }

  export type IngredientUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientCreateManyInput = {
    id?: bigint | number
    name: string
    slug: string
    createdAt?: Date | string
  }

  export type IngredientUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhraseCreateInput = {
    id?: bigint | number
    sourceId: number
    type?: string
    version?: string
    index?: number
    hash?: string
    text: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhraseUncheckedCreateInput = {
    id?: bigint | number
    sourceId: number
    type?: string
    version?: string
    index?: number
    hash?: string
    text: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhraseUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sourceId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhraseUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sourceId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhraseCreateManyInput = {
    id?: bigint | number
    sourceId: number
    type?: string
    version?: string
    index?: number
    hash?: string
    text: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhraseUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sourceId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhraseUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sourceId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceCreateInput = {
    recipeUrl: string
    recipeDate?: Date | string | null
    htmlContent?: string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    checked?: boolean
    flagged?: boolean
    needsReview?: string | null
    sourceImages?: SourceImageCreateNestedManyWithoutSourceInput
  }

  export type SourceUncheckedCreateInput = {
    id?: number
    recipeUrl: string
    recipeDate?: Date | string | null
    htmlContent?: string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    checked?: boolean
    flagged?: boolean
    needsReview?: string | null
    sourceImages?: SourceImageUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceUpdateInput = {
    recipeUrl?: StringFieldUpdateOperationsInput | string
    recipeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checked?: BoolFieldUpdateOperationsInput | boolean
    flagged?: BoolFieldUpdateOperationsInput | boolean
    needsReview?: NullableStringFieldUpdateOperationsInput | string | null
    sourceImages?: SourceImageUpdateManyWithoutSourceNestedInput
  }

  export type SourceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipeUrl?: StringFieldUpdateOperationsInput | string
    recipeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checked?: BoolFieldUpdateOperationsInput | boolean
    flagged?: BoolFieldUpdateOperationsInput | boolean
    needsReview?: NullableStringFieldUpdateOperationsInput | string | null
    sourceImages?: SourceImageUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type SourceCreateManyInput = {
    id?: number
    recipeUrl: string
    recipeDate?: Date | string | null
    htmlContent?: string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    checked?: boolean
    flagged?: boolean
    needsReview?: string | null
  }

  export type SourceUpdateManyMutationInput = {
    recipeUrl?: StringFieldUpdateOperationsInput | string
    recipeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checked?: BoolFieldUpdateOperationsInput | boolean
    flagged?: BoolFieldUpdateOperationsInput | boolean
    needsReview?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SourceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipeUrl?: StringFieldUpdateOperationsInput | string
    recipeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checked?: BoolFieldUpdateOperationsInput | boolean
    flagged?: BoolFieldUpdateOperationsInput | boolean
    needsReview?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SourceImageCreateInput = {
    stableId?: string | null
    url?: string | null
    alt?: string | null
    isLead?: boolean
    order?: number
    downloaded?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    source?: SourceCreateNestedOneWithoutSourceImagesInput
  }

  export type SourceImageUncheckedCreateInput = {
    id?: number
    sourceId?: number | null
    stableId?: string | null
    url?: string | null
    alt?: string | null
    isLead?: boolean
    order?: number
    downloaded?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceImageUpdateInput = {
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: SourceUpdateOneWithoutSourceImagesNestedInput
  }

  export type SourceImageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sourceId?: NullableIntFieldUpdateOperationsInput | number | null
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceImageCreateManyInput = {
    id?: number
    sourceId?: number | null
    stableId?: string | null
    url?: string | null
    alt?: string | null
    isLead?: boolean
    order?: number
    downloaded?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceImageUpdateManyMutationInput = {
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceImageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    sourceId?: NullableIntFieldUpdateOperationsInput | number | null
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CategoryNullableScalarRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput
    some?: CategoryWhereInput
    none?: CategoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryOrderByRelevanceInput = {
    fields: CategoryOrderByRelevanceFieldEnum | CategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoryParentIdSlugCompoundUniqueInput = {
    parentId: number
    slug: string
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    keywords?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type TagOrderByRelevanceInput = {
    fields: TagOrderByRelevanceFieldEnum | TagOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type TagAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type TagSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type IngredientOrderByRelevanceInput = {
    fields: IngredientOrderByRelevanceFieldEnum | IngredientOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type IngredientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type IngredientAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IngredientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type IngredientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
  }

  export type IngredientSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type PhraseOrderByRelevanceInput = {
    fields: PhraseOrderByRelevanceFieldEnum | PhraseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PhraseSourceIdHashVersionIndexCompoundUniqueInput = {
    sourceId: number
    hash: string
    version: string
    index: number
  }

  export type PhraseCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    type?: SortOrder
    version?: SortOrder
    index?: SortOrder
    hash?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PhraseAvgOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    index?: SortOrder
  }

  export type PhraseMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    type?: SortOrder
    version?: SortOrder
    index?: SortOrder
    hash?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PhraseMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    type?: SortOrder
    version?: SortOrder
    index?: SortOrder
    hash?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PhraseSumOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    index?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SourceImageListRelationFilter = {
    every?: SourceImageWhereInput
    some?: SourceImageWhereInput
    none?: SourceImageWhereInput
  }

  export type SourceImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SourceOrderByRelevanceInput = {
    fields: SourceOrderByRelevanceFieldEnum | SourceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SourceCountOrderByAggregateInput = {
    id?: SortOrder
    recipeUrl?: SortOrder
    recipeDate?: SortOrder
    htmlContent?: SortOrder
    jsonParsed?: SortOrder
    jsonAltered?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    checked?: SortOrder
    flagged?: SortOrder
    needsReview?: SortOrder
  }

  export type SourceAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SourceMaxOrderByAggregateInput = {
    id?: SortOrder
    recipeUrl?: SortOrder
    recipeDate?: SortOrder
    htmlContent?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    checked?: SortOrder
    flagged?: SortOrder
    needsReview?: SortOrder
  }

  export type SourceMinOrderByAggregateInput = {
    id?: SortOrder
    recipeUrl?: SortOrder
    recipeDate?: SortOrder
    htmlContent?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    checked?: SortOrder
    flagged?: SortOrder
    needsReview?: SortOrder
  }

  export type SourceSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SourceNullableScalarRelationFilter = {
    is?: SourceWhereInput | null
    isNot?: SourceWhereInput | null
  }

  export type SourceImageOrderByRelevanceInput = {
    fields: SourceImageOrderByRelevanceFieldEnum | SourceImageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SourceImageSourceIdStableIdCompoundUniqueInput = {
    sourceId: number
    stableId: string
  }

  export type SourceImageCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    stableId?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    isLead?: SortOrder
    order?: SortOrder
    downloaded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceImageAvgOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    order?: SortOrder
  }

  export type SourceImageMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    stableId?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    isLead?: SortOrder
    order?: SortOrder
    downloaded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceImageMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    stableId?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    isLead?: SortOrder
    order?: SortOrder
    downloaded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceImageSumOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    order?: SortOrder
  }

  export type CategoryCreateNestedOneWithoutChildrenInput = {
    create?: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutChildrenInput
    connect?: CategoryWhereUniqueInput
  }

  export type CategoryCreateNestedManyWithoutParentInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type CategoryUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CategoryUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutChildrenInput
    upsert?: CategoryUpsertWithoutChildrenInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutChildrenInput, CategoryUpdateWithoutChildrenInput>, CategoryUncheckedUpdateWithoutChildrenInput>
  }

  export type CategoryUpdateManyWithoutParentNestedInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutParentInput | CategoryUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutParentInput | CategoryUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutParentInput | CategoryUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput> | CategoryCreateWithoutParentInput[] | CategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutParentInput | CategoryCreateOrConnectWithoutParentInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutParentInput | CategoryUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CategoryCreateManyParentInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutParentInput | CategoryUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutParentInput | CategoryUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type SourceImageCreateNestedManyWithoutSourceInput = {
    create?: XOR<SourceImageCreateWithoutSourceInput, SourceImageUncheckedCreateWithoutSourceInput> | SourceImageCreateWithoutSourceInput[] | SourceImageUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceImageCreateOrConnectWithoutSourceInput | SourceImageCreateOrConnectWithoutSourceInput[]
    createMany?: SourceImageCreateManySourceInputEnvelope
    connect?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
  }

  export type SourceImageUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<SourceImageCreateWithoutSourceInput, SourceImageUncheckedCreateWithoutSourceInput> | SourceImageCreateWithoutSourceInput[] | SourceImageUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceImageCreateOrConnectWithoutSourceInput | SourceImageCreateOrConnectWithoutSourceInput[]
    createMany?: SourceImageCreateManySourceInputEnvelope
    connect?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SourceImageUpdateManyWithoutSourceNestedInput = {
    create?: XOR<SourceImageCreateWithoutSourceInput, SourceImageUncheckedCreateWithoutSourceInput> | SourceImageCreateWithoutSourceInput[] | SourceImageUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceImageCreateOrConnectWithoutSourceInput | SourceImageCreateOrConnectWithoutSourceInput[]
    upsert?: SourceImageUpsertWithWhereUniqueWithoutSourceInput | SourceImageUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: SourceImageCreateManySourceInputEnvelope
    set?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    disconnect?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    delete?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    connect?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    update?: SourceImageUpdateWithWhereUniqueWithoutSourceInput | SourceImageUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: SourceImageUpdateManyWithWhereWithoutSourceInput | SourceImageUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: SourceImageScalarWhereInput | SourceImageScalarWhereInput[]
  }

  export type SourceImageUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<SourceImageCreateWithoutSourceInput, SourceImageUncheckedCreateWithoutSourceInput> | SourceImageCreateWithoutSourceInput[] | SourceImageUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceImageCreateOrConnectWithoutSourceInput | SourceImageCreateOrConnectWithoutSourceInput[]
    upsert?: SourceImageUpsertWithWhereUniqueWithoutSourceInput | SourceImageUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: SourceImageCreateManySourceInputEnvelope
    set?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    disconnect?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    delete?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    connect?: SourceImageWhereUniqueInput | SourceImageWhereUniqueInput[]
    update?: SourceImageUpdateWithWhereUniqueWithoutSourceInput | SourceImageUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: SourceImageUpdateManyWithWhereWithoutSourceInput | SourceImageUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: SourceImageScalarWhereInput | SourceImageScalarWhereInput[]
  }

  export type SourceCreateNestedOneWithoutSourceImagesInput = {
    create?: XOR<SourceCreateWithoutSourceImagesInput, SourceUncheckedCreateWithoutSourceImagesInput>
    connectOrCreate?: SourceCreateOrConnectWithoutSourceImagesInput
    connect?: SourceWhereUniqueInput
  }

  export type SourceUpdateOneWithoutSourceImagesNestedInput = {
    create?: XOR<SourceCreateWithoutSourceImagesInput, SourceUncheckedCreateWithoutSourceImagesInput>
    connectOrCreate?: SourceCreateOrConnectWithoutSourceImagesInput
    upsert?: SourceUpsertWithoutSourceImagesInput
    disconnect?: SourceWhereInput | boolean
    delete?: SourceWhereInput | boolean
    connect?: SourceWhereUniqueInput
    update?: XOR<XOR<SourceUpdateToOneWithWhereWithoutSourceImagesInput, SourceUpdateWithoutSourceImagesInput>, SourceUncheckedUpdateWithoutSourceImagesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CategoryCreateWithoutChildrenInput = {
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    parent?: CategoryCreateNestedOneWithoutChildrenInput
  }

  export type CategoryUncheckedCreateWithoutChildrenInput = {
    id?: number
    parentId?: number | null
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutChildrenInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
  }

  export type CategoryCreateWithoutParentInput = {
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    children?: CategoryCreateNestedManyWithoutParentInput
  }

  export type CategoryUncheckedCreateWithoutParentInput = {
    id?: number
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput
  }

  export type CategoryCreateOrConnectWithoutParentInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput>
  }

  export type CategoryCreateManyParentInputEnvelope = {
    data: CategoryCreateManyParentInput | CategoryCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutChildrenInput = {
    update: XOR<CategoryUpdateWithoutChildrenInput, CategoryUncheckedUpdateWithoutChildrenInput>
    create: XOR<CategoryCreateWithoutChildrenInput, CategoryUncheckedCreateWithoutChildrenInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutChildrenInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutChildrenInput, CategoryUncheckedUpdateWithoutChildrenInput>
  }

  export type CategoryUpdateWithoutChildrenInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: CategoryUpdateOneWithoutChildrenNestedInput
  }

  export type CategoryUncheckedUpdateWithoutChildrenInput = {
    id?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUpsertWithWhereUniqueWithoutParentInput = {
    where: CategoryWhereUniqueInput
    update: XOR<CategoryUpdateWithoutParentInput, CategoryUncheckedUpdateWithoutParentInput>
    create: XOR<CategoryCreateWithoutParentInput, CategoryUncheckedCreateWithoutParentInput>
  }

  export type CategoryUpdateWithWhereUniqueWithoutParentInput = {
    where: CategoryWhereUniqueInput
    data: XOR<CategoryUpdateWithoutParentInput, CategoryUncheckedUpdateWithoutParentInput>
  }

  export type CategoryUpdateManyWithWhereWithoutParentInput = {
    where: CategoryScalarWhereInput
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutParentInput>
  }

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    OR?: CategoryScalarWhereInput[]
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    id?: IntFilter<"Category"> | number
    parentId?: IntNullableFilter<"Category"> | number | null
    title?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    keywords?: JsonNullableFilter<"Category">
    createdAt?: DateTimeFilter<"Category"> | Date | string
  }

  export type SourceImageCreateWithoutSourceInput = {
    stableId?: string | null
    url?: string | null
    alt?: string | null
    isLead?: boolean
    order?: number
    downloaded?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceImageUncheckedCreateWithoutSourceInput = {
    id?: number
    stableId?: string | null
    url?: string | null
    alt?: string | null
    isLead?: boolean
    order?: number
    downloaded?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceImageCreateOrConnectWithoutSourceInput = {
    where: SourceImageWhereUniqueInput
    create: XOR<SourceImageCreateWithoutSourceInput, SourceImageUncheckedCreateWithoutSourceInput>
  }

  export type SourceImageCreateManySourceInputEnvelope = {
    data: SourceImageCreateManySourceInput | SourceImageCreateManySourceInput[]
    skipDuplicates?: boolean
  }

  export type SourceImageUpsertWithWhereUniqueWithoutSourceInput = {
    where: SourceImageWhereUniqueInput
    update: XOR<SourceImageUpdateWithoutSourceInput, SourceImageUncheckedUpdateWithoutSourceInput>
    create: XOR<SourceImageCreateWithoutSourceInput, SourceImageUncheckedCreateWithoutSourceInput>
  }

  export type SourceImageUpdateWithWhereUniqueWithoutSourceInput = {
    where: SourceImageWhereUniqueInput
    data: XOR<SourceImageUpdateWithoutSourceInput, SourceImageUncheckedUpdateWithoutSourceInput>
  }

  export type SourceImageUpdateManyWithWhereWithoutSourceInput = {
    where: SourceImageScalarWhereInput
    data: XOR<SourceImageUpdateManyMutationInput, SourceImageUncheckedUpdateManyWithoutSourceInput>
  }

  export type SourceImageScalarWhereInput = {
    AND?: SourceImageScalarWhereInput | SourceImageScalarWhereInput[]
    OR?: SourceImageScalarWhereInput[]
    NOT?: SourceImageScalarWhereInput | SourceImageScalarWhereInput[]
    id?: IntFilter<"SourceImage"> | number
    sourceId?: IntNullableFilter<"SourceImage"> | number | null
    stableId?: StringNullableFilter<"SourceImage"> | string | null
    url?: StringNullableFilter<"SourceImage"> | string | null
    alt?: StringNullableFilter<"SourceImage"> | string | null
    isLead?: BoolFilter<"SourceImage"> | boolean
    order?: IntFilter<"SourceImage"> | number
    downloaded?: BoolFilter<"SourceImage"> | boolean
    createdAt?: DateTimeFilter<"SourceImage"> | Date | string
    updatedAt?: DateTimeFilter<"SourceImage"> | Date | string
  }

  export type SourceCreateWithoutSourceImagesInput = {
    recipeUrl: string
    recipeDate?: Date | string | null
    htmlContent?: string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    checked?: boolean
    flagged?: boolean
    needsReview?: string | null
  }

  export type SourceUncheckedCreateWithoutSourceImagesInput = {
    id?: number
    recipeUrl: string
    recipeDate?: Date | string | null
    htmlContent?: string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    checked?: boolean
    flagged?: boolean
    needsReview?: string | null
  }

  export type SourceCreateOrConnectWithoutSourceImagesInput = {
    where: SourceWhereUniqueInput
    create: XOR<SourceCreateWithoutSourceImagesInput, SourceUncheckedCreateWithoutSourceImagesInput>
  }

  export type SourceUpsertWithoutSourceImagesInput = {
    update: XOR<SourceUpdateWithoutSourceImagesInput, SourceUncheckedUpdateWithoutSourceImagesInput>
    create: XOR<SourceCreateWithoutSourceImagesInput, SourceUncheckedCreateWithoutSourceImagesInput>
    where?: SourceWhereInput
  }

  export type SourceUpdateToOneWithWhereWithoutSourceImagesInput = {
    where?: SourceWhereInput
    data: XOR<SourceUpdateWithoutSourceImagesInput, SourceUncheckedUpdateWithoutSourceImagesInput>
  }

  export type SourceUpdateWithoutSourceImagesInput = {
    recipeUrl?: StringFieldUpdateOperationsInput | string
    recipeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checked?: BoolFieldUpdateOperationsInput | boolean
    flagged?: BoolFieldUpdateOperationsInput | boolean
    needsReview?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SourceUncheckedUpdateWithoutSourceImagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipeUrl?: StringFieldUpdateOperationsInput | string
    recipeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    jsonParsed?: NullableJsonNullValueInput | InputJsonValue
    jsonAltered?: NullableJsonNullValueInput | InputJsonValue
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checked?: BoolFieldUpdateOperationsInput | boolean
    flagged?: BoolFieldUpdateOperationsInput | boolean
    needsReview?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CategoryCreateManyParentInput = {
    id?: number
    title: string
    slug: string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CategoryUpdateWithoutParentInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUpdateManyWithoutParentNestedInput
  }

  export type CategoryUncheckedUpdateWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CategoryUncheckedUpdateManyWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    keywords?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceImageCreateManySourceInput = {
    id?: number
    stableId?: string | null
    url?: string | null
    alt?: string | null
    isLead?: boolean
    order?: number
    downloaded?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceImageUpdateWithoutSourceInput = {
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceImageUncheckedUpdateWithoutSourceInput = {
    id?: IntFieldUpdateOperationsInput | number
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceImageUncheckedUpdateManyWithoutSourceInput = {
    id?: IntFieldUpdateOperationsInput | number
    stableId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    downloaded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}