import OpenAPIBackend from 'openapi-backend'
import Koa from 'koa'
import Router from 'koa-router'
import { Server } from 'node:http'

// TODO: Document this
export interface ApplicationContext {
    app: Koa,
    api: OpenAPIBackend,
    router: Router,
    application: Application,
    registerKoaApi: (handlers: Record<string, Koa.Middleware>) => void
}

export type ApplicationModule = (context: ApplicationContext) => any | Promise<any>

export type ApplicationRunHandler = (server: Server) => Promise<any>

export interface Application {
    getContext(): ApplicationContext
    use(module: ApplicationModule): Application
    start(port: number|string): Promise<Server>
    run(handler: ApplicationRunHandler, port?: number): Promise<void>
}


