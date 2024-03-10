var { expressjwt: jwt, expressjwt } = require("express-jwt");

function jwts() {
  return jwt({ secret: "shhhh", algorithms: ["RS256", "HS256"] }).unless({
   
    path: [
      // public routes that don't require authentication
      "/company/chK_company_login",
      
    ]
  });
  
}

module.exports = jwts;