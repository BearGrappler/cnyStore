module.exports = function(db) {

    return function(email, password, done) {

        const User = db.model('User');

        // When passport.authenticate('local') is used, this function will receive
        // the email and password to run the actual authentication logic.
        User.findOne({
                where: {
                    email: email
                }
            })
            .then(function(user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            })
            .catch(done);
    };
}
