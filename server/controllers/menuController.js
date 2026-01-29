const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Admin (Public for demo)
const createMenuItem = async (req, res) => {
    try {
        const { name, price, category, desc, image } = req.body;
        const item = new MenuItem({ name, price, category, desc, image });
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Seed menu items
// @route   POST /api/menu/seed
// @access  Public
const seedMenu = async (req, res) => {
    const seedData = [
        {
            name: 'BBQ Chicken Pizza',
            price: 18,
            category: 'Main',
            description: 'Smoky BBQ sauce, grilled chicken, red onions, and fresh cilantro.',
            image: '/images/bbqpizza.jpg'
        },
        {
            name: 'Classic Veg Pizza',
            price: 15,
            category: 'Main',
            description: 'Fresh vegetables, mozzarella cheese, and signature tomato sauce.',
            image: '/images/vegpizza.jpg'
        },
        {
            name: 'Double Cheese Pizza',
            price: 16,
            category: 'Main',
            description: 'Extra mozzarella and cheddar cheese blend on a crispy crust.',
            image: '/images/cheesepizza.jpg'
        },
        {
            name: 'Chicken Shawarma',
            price: 12,
            category: 'Main',
            description: 'Marinated chicken, garlic sauce, and pickles in a soft wrap.',
            image: '/images/shawarma.jpg'
        },
        {
            name: 'Grilled Chicken Wrap',
            price: 11,
            category: 'Main',
            description: 'Grilled chicken breast with fresh greens and herb dressing.',
            image: '/images/chickenwrap.jpg'
        },
        {
            name: 'Loaded Cheesy Fries',
            price: 10,
            category: 'Starter',
            description: 'Crispy fries topped with melted cheese, jalapenos, and bacon bits.',
            image: '/images/loadedfries.jpg'
        },
        {
            name: 'Caramel Pudding',
            price: 8,
            category: 'Dessert',
            description: 'Silky smooth custard with a rich caramel glaze.',
            image: '/images/caramelpudding.jpg'
        },
        {
            name: 'Tiramisu Cake',
            price: 10,
            category: 'Dessert',
            description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.',
            image: '/images/tiramisu%20cake.jpg'
        },
        {
            name: 'Death by Chocolate Cake',
            price: 9,
            category: 'Dessert',
            description: 'Rich, moisture-packed chocolate cake with dark chocolate ganache.',
            image: '/images/choccake.png'
        },
        {
            name: 'Fudge Brownie',
            price: 7,
            category: 'Dessert',
            description: 'Warm, gooey chocolate brownie served with chocolate drizzle.',
            image: '/images/browniefudge.jpg'
        },
        {
            name: 'Kashmiri Pink Tea',
            price: 5,
            category: 'Drinks',
            description: 'Traditional pink tea brewed with nuts and aromatic spices.',
            image: '/images/kashmiritea.jpg'
        },
        {
            name: 'Masala Chai',
            price: 3,
            category: 'Drinks',
            description: 'Authentic spiced milk tea with ginger and cardamom.',
            image: '/images/masalachai.jpg'
        },
        {
            name: 'Matcha Latte',
            price: 6,
            category: 'Drinks',
            description: 'Premium ceremonial grade matcha with steamed milk.',
            image: '/images/matcha.jpg'
        },
        {
            name: 'Cappuccino',
            price: 5,
            category: 'Drinks',
            description: 'Double shot of espresso with equal parts steamed milk and foam.',
            image: '/images/cappuccino.png'
        },
        {
            name: 'Strawberry Milkshake',
            price: 7,
            category: 'Drinks',
            description: 'Fresh strawberries blended with creamy vanilla ice cream.',
            image: '/images/strawberrymilkshake.jpg'
        },
        {
            name: 'Lemon Iced Tea',
            price: 5,
            category: 'Drinks',
            description: 'Refreshing black tea with lemon and honey over ice.',
            image: '/images/lemonicedtea.jpg'
        }
    ];

    try {
        await MenuItem.deleteMany({});
        const createdItems = await MenuItem.insertMany(seedData);
        res.json(createdItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, image, isAvailable } = req.body;
        const item = await MenuItem.findById(req.params.id);

        if (item) {
            item.name = name || item.name;
            item.price = price || item.price;
            item.category = category || item.category;
            item.description = description || item.description;
            item.image = image || item.image;
            item.isAvailable = isAvailable !== undefined ? isAvailable : item.isAvailable;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getMenuItems, createMenuItem, seedMenu, deleteMenuItem, updateMenuItem };
