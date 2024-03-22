import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'

import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
console.log("logger", logger)

// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-ls8xao57gpsnxuq4.us.auth0.com/.well-known/jwks.json' 


export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const jwt = jsonwebtoken.decode(token, { complete: true });

  console.log('verifyToken', token)
  console.log("jwt", jwt);

  // Implement token verification
   
  console.log("chorizo", jsonwebtoken.verify(token, jwksUrl, { algorithms: ["RS256"] }));

  return jsonwebtoken.verify(token, jwksUrl, { algorithms: ["RS256"] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
