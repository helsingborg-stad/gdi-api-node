import OpenAPIBackend from 'openapi-backend'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { Server } from 'node:http'

// TODO: Document this
export interface ApplicationContext {
    app: Koa,
    api: OpenAPIBackend,
    router: Router,
    application: Application,
    registerKoaApi: (handlers: Record<string, Koa.Middleware>) => void
}

export type ApplicationModule = (context: ApplicationContext) => void

export interface Application {
    getContext(): ApplicationContext
    use(module: ApplicationModule): Application
    start(port: number|string): Promise<Server>
    run(handler: ((server: Server) => Promise<any>), port?: number): Promise<void>
}
