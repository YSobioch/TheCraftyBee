const stripe = require('stripe')(process.env.STRIPE_SK)
const Cart = require('../models/cart')
const Listing = require('../models/listings')
const updateAndDelete = require('../models/updateAndDelete')


exports.getAllCarts = async (req, res, next) => {
    res.send(`
    <form action="/cart/" method="POST" encType='multipart/form-data'>
    <label>Owner Id</label>
    <Input type="number" name="ownerId">
    <label>Listing Number</label>
    <Input type="number" name="listingId">
    <Input type="submit" value="Submit">
    </form>
    `)
}

exports.createNewCart = async (req, res, next) => {
    let cart;
    try {
        cart = new Cart(req.body.ownerId, req.body.listingId)
        cart.save()

        res.status(200).send('added to cart')
    } catch (err) {
        console.log(err)
    }

}

exports.getCartsByCartOwnerId = async (req, res, next) => {
    try {
        let [carts, _] = await Cart.getAllCartsByCartOwnerId(req.params.id)

        res.status(200).json(carts)
    } catch (err) {
        console.log(err)
    }
    
}

//deletes cart with the id of param and the owner id of body
exports.deleteCart = async (req, res, next) => {
    try {
        let [cart, _] = await Cart.getCartById(req.params.id);
        cart = cart[0];
        console.log(req.body.id == cart.cart_owner_id)
        if(req.body.id == cart.cart_owner_id) {
            updateAndDelete.deleteById('cart', req.params.id)
            res.json({"deleted": cart})
        } else {
            res.json({"deleted": false})
        }

    } catch (err) {
        console.log(err)
        res.json({"deleted": false})
    }
}

exports.deleteCartForm = async (req, res, next) => {
    res.send(`
        <form action="/cart/deleteCart/${req.params.id}?_method=DELETE" method="POST" encType='multipart/form-data'>
        <input type="number" name="id">
        <input type="submit" value="Submit">
        </form>    
    `)
}

//Checkout
exports.checkout = async (req, res, next) => {
    try {
        let items = req.body.items;
        let [lineItems] = await Listing.findMultipleById(items)
    
        const session = await stripe.checkout.sessions.create({
            shipping_address_collection: {
                allowed_countries: ['US']
            },
            shipping_options: [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 300,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    },
                },
            }],
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.price
                    },
                    quantity: 1
                }
           }),
           success_url: `${process.env.CLIENT_DOMAIN}/purchased/${req.body.items}/${req.body.account}`,
           cancel_url: `${process.env.CLIENT_DOMAIN}/myCart`,
        })

        res.json({ url: session.url })
    } catch (err) {
        res.status(500).json({url: err.message})
    }
}