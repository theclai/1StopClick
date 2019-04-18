// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED: boolean = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const SERVER_OAUT2 = 'http://localhost:8080';
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
export const ACCESS_TOKEN = 'accessToken';

export const OAUTH2_REDIRECT_URI = 'http://localhost:9000/oauth2/redirect';

export const GOOGLE_AUTH_URL = SERVER_OAUT2 + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = SERVER_OAUT2 + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = SERVER_OAUT2 + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;
// http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:9000/oauth2/redirect
