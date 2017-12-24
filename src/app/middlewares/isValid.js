/**
 *          .::VALIDATION::.
 * All validation operations belong here.
 * 
 */




/**
 * Returns a json object that has `foundKeys` and `notFoundKeys`
 * @param {*} object
 * @param {*[]} keys keys to find in `object`
 */
let findKeys = (object, keys) => {
    var foundKeys = [];
    var notFoundKeys=[];
    keys.forEach(key => {
        notFoundKeys.push(key);
        _.mapKeys(object, (objectValue, objectKey) => {
            if (key == objectKey) {
                if(object[key] && object[key]!=null && object[key]!="") {
                    
                    foundKeys.push(key);
                    notFoundKeys.pop();
                }
            }
        });
    });
    return {foundKeys,notFoundKeys};
}
/**
 * request validation
 * @param req express request object
 * @param res express response object
 * @param requiredKeys {string[]} Keys that are required in req.body
 * @param forbiddenKeys {string[]} Keys that are not allowed to be in req.body
 * 
 */
export function req(requiredKeys, forbiddenKeys) {
    var req=this;
    var {res} =req;
    var {
        body
    } = req;
    if (!requiredKeys) requiredKeys = [];
    if (!forbiddenKeys) forbiddenKeys = [];

    
    
    var missedKeys =  findKeys(body, requiredKeys).notFoundKeys;
    var notAllowedKeys =  findKeys(body, forbiddenKeys).foundKeys;


    
    var error = "";
    if (missedKeys.length > 0) error = "The following keys are required in request body:\n " + _.join(missedKeys, " , ") + "\n";
    if (forbiddenKeys.length > 0) error = "The following keys are forbidden in request body:\n" + _.join(forbiddenKeys, " , ") + "\n";

    if (error == "") return true;
    res.validSend(400, {
        error
    });
    return false;


}
/**
 * 
 * @param {*} res express response object
 * @param {number} status http status code
 * @param {*} body response body
 * @param {string[]} omitKeys Optional - keys to omit from response body
 */
export function res(status,body,omitKeys){
    if(!status) status=200;
    if(body)
    if(validator.isJSON(JSON.stringify(body))){

        var defaultOmitKeys=[];
        if(!omitKeys) omitKeys=defaultOmitKeys;
        body=_.omit(body,omitKeys);
    }

    return this.status(status).json(body);


    
}
export default {
    req,res
}