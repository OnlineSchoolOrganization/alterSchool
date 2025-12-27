import { createYoga, createSchema } from 'graphql-yoga'
import { createServer } from 'http'
import { typeDefs } from './schema/typeDefs.generated'
import { resolvers } from './schema/resolvers.generated'
import { decryptJWT, encryptJWT } from './jwt'
import { prisma } from './prisma'

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }), 
  context: async (req: any) => {
    const token = req.request.headers.get('authorization')?.split(' ')[1]
    let user = null
    if (token) {
      const userJWT = await decryptJWT(token)
      if(userJWT) user = await prisma.user.findUnique({ where: { id: userJWT.id} })
    }
    return { user, encryptJWT, decryptJWT, prisma }
  },
})
const server = createServer(yoga)
server.listen(process.env.PORT || 3000)
