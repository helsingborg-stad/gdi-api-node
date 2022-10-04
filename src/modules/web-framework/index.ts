import cors from '@koa/cors' 
import bodyparser from 'koa-bodyparser'
import { ApplicationContext, ApplicationModule } from '../../application/types'

/** Module thet handles basic CORS and body parsing for your convenience 🍻 */
const webFramworkModule = (): ApplicationModule => ({ app }: ApplicationContext) => app
	.use(cors())
	.use(bodyparser())

export default webFramworkModule