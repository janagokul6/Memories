import jwt from "jsonwebtoken"

const jwtSecret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW";

const auth = async (req, res, next) => {


  
    try {
        const token = req.headers.authorization.split(" ")[1];
      
        const isCustomAuth = token.length < 500;
    
        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, jwtSecret);
            req.userId = decodedData?.id;

        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next()
    }
    catch (error) {
        console.log(error,"25 no line");
    }
}

export default auth