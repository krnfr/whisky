// import { UserModule } from '~/types'
// import log from 'loglevel'

// export const install: UserModule = ({ isClient, router }) => {
//     if (isClient) {
//         const r = router
//         router.beforeEach((router,) => {
//             console.log(router.query)
//             if (router.query.type) {
//                 const type = router.query.type
//                 log.debug(`query type is ${type}`)
//                 if (type == 'reset') r.push('/user/reset')
//             }
//             if (router.query.access_token) {
//                 const access_token = router.query.access_token
//                 log.debug(`access_token type is ${access_token}`)
//             }
//         })
//     }
// }
