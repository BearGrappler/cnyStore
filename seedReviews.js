/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

module.exports = [
        {
            reviews: 'This is the best lightweight laptop I\'ve used. It\'s perfect for light usage as a second computer. The 1.1 Ghz Intel Mobile M CPU is fast enough and lengthens the battery life over similar Windows laptops with Core i5 CPU\'s. Note that the laptop comes with battery fully discharged so you will have to charge the battery with the included AC adapter. It will not turn on without being plugged in when you first receive it.',

            rating: 4
        },
        {
            reviews: 'I am never buying another Lenovo product. This is the second one I\'ve bought, the more fool me. The first one I returned instantly because it was defective, and I was stupid enough to assume that was just a fluke. The low price tag lured me into buying this one and it was a huge mistake, I should have been less cheap and bought something from a more trustworthy, competent company.',

            rating: 1
        },
        {
           reviews: 'I highly recommend this product.',
            rating: 2
        }
]
