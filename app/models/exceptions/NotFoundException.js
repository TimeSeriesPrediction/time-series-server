module.exports = function NotFoundException(message){
    this.message =  message || 'Not found';
}