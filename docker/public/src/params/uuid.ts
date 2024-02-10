import type { ParamMatcher } from "@sveltejs/kit";

import { validate, version } from "uuid";

export const match = ((param: string) => {
    return validate(param) && version(param) === 7;
}) satisfies ParamMatcher;