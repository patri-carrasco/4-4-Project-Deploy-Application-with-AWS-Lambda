import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'

import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
console.log("logger", logger)

// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-ls8xao57gpsnxuq4.us.auth0.com/.well-known/jwks.json' 


export async function handler(event) {
  let jwtToken;
  try {
    jwtToken = await verifyToken(event.authorizationToken)
    logger.info("User was authorized", jwtToken);

    console.log(jwtToken)

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


  console.log("kid del token JWT:", jwt.header.kid);

  const { data: jwks } = await Axios.get(jwksUrl);
  const { keys } = jwks;

  console.log("Keys from JWKS:", keys);

  const key = keys.find((key) => key.kid === jwt.header.kid);

  console.log("Identificadores de clave en el JWKS:",keys.map((key) => key.kid));

  if (!key) {
    throw new Error("Unable to find matching key in JWKS");
  }

  const publicKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;

  return jsonwebtoken.verify(token, publicKey, { algorithms: ["RS256"] });
}

export function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
