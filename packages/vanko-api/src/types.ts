import { RouterParamContext } from "@koa/router";
import { ParameterizedContext, DefaultContext, DefaultState } from "koa";
import { Pagination } from "./schemas/index.ts";

/**
 * Wrapper around koa's context. It allows explict type
 * for request data, response body and url parameters
 */
export type ApiContext<
    Req = DefaultState,
    Param = unknown,
    Body = unknown
> = ParameterizedContext<
    ApiState<Req, Param>,
    DefaultContext & RouterParamContext<Req>,
    Body
>;

export type ApiState<Req, Param> = {
    req: Req;
    param: Param;
    pagination: Pagination;
};
