const apiId = '4sri7bmonc' 

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-ls8xao57gpsnxuq4.us.auth0.com',    // Domain from Auth0
  clientId: 'uqboa4WG8FZ8jSZ66lHoDXrL7wmiGuy0',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}