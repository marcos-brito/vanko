import { RouterContext } from "@koa/router";
import { DefaultContext } from "koa";

/**
 * Wrapper around koa's context. It allows explict type
 * for state e.g data passed through middlewares, and body i.e response
 */
export type ApiContext<State = {}, Body = {}> = RouterContext<
    State,
    DefaultContext,
    Body
>;
