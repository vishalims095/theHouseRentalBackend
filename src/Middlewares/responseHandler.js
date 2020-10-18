module.exports = (req, res, next) => {
    res.Success = function(result, message = '') {
        if(message == '') {
            this.send({response : result});
        } else {
            this.send({ message, response : result});
        }
    }

    res.Error = function(error) {
        this.send({ message : error});
    }
    
    next();
}