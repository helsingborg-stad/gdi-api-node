import { createDemoApp } from './demo-app'


createDemoApp({
	validateResponse: false,
})
	.start(process.env.PORT || 3000)
  