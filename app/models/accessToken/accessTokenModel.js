var TokenSchema   = function (user, ipAddress){
      this.username = user.username;
      this.fullname = user.fullname;
      this.permissions = user.permissions;
      this.ipAddress = ipAddress;

      var expiryOneHour = new Date();
      expiryOneHour.setTime(expiryOneHour.getTime() + (1*60*60*1000));
      this.expiry = expiryOneHour;
}


module.exports = TokenSchema;