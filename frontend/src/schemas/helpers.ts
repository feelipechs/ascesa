import { z } from 'zod'

export const zodBoolean = z.preprocess((v) => v === true || v === 'true', z.boolean())
