var TokenSchema   = function (user, ipAddress){
      this.userId = user._id;
      this.username = user.username;
      this.fullname = user.fullname;
      this.userPermissions = user.permissions;
      this.ipAddress = ipAddress;

      var expiryOneHour = new Date();
      expiryOneHour.setTime(expiryOneHour.getTime() + (1*60*60*1000));
      this.expiry = expiryOneHour;
}


module.exports = TokenSchema;