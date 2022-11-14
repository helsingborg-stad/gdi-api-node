import OpenAPIBackend, { Handler } from 'openapi-backend'
import Koa from 'koa'
import Router from 'koa-router'
import { Server } from 'node:http'

// TODO: Document this
export interface ApplicationContext {
    app: Koa,
    api: OpenAPIBackend,
    router: Router,
    application: Application,
    extend(extension: ApplicationExtension)
    registerKoaApi: (handlers: Record<string, Koa.Middleware>) => void
}

export type ApplicationModule = (context: ApplicationContext) => any | Promise<any>

export type ApplicationRunHandler = (server: Server) => Promise<any>

export interface ApplicationExtension {
    compose?: (m: Koa.Middleware) => Koa.Middleware
    mapApi?: (api: Record<string, Handler>) => Promise<Record<string, Handler>>
}

export interface Application {
    getContext(): ApplicationContext
    use(module: ApplicationModule): Application
    start(port: number|string): Promise<Server>
    run(handler: ApplicationRunHandler, port?: number): Promise<void>
}
