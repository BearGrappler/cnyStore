module.exports = function(req, res, next, db) {

    const Cart = db.model('Cart');

    // Authorization callback function to be used for logins.
    return function(err, user) {
        if (err) return next(err);
        if (!user) {
            let error = new Error('Invalid login credentials.');
            error.status = 401;
            return next(error);
        }
        // req.logIn will establish our session.
        req.logIn(user, function(loginErr) {
            let sendRes = function(obj) {
                return res.status(200).send({
                    user: obj.sanitize()
                });
            }
            if (loginErr) {
                return next(loginErr);
                // We respond with a response object that has user with _id and email.
            } else {
                if (!req.session.hasOwnProperty('CartId')) return sendRes(user);
                Cart.findOne({
                        where: {
                            id: req.session.CartId
                        },
                        include: [{ association: Cart.Product }]
                    }).then(cart => {
                        delete req.session.CartId;
                        if (!cart) return;
                        if (!cart.Items.length) {
                            return cart.destroy();
                        } else {
                            return cart.update({ UserId: req.user.id });
                        }
                    })
                    .then(() => sendRes(user))
                    .catch(next)
            }
        });
    };
}
