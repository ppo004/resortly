const names = [
    "Taj Madikeri Resort & Spa Coorg",
    "Coorg Wilderness Resort ",
    "The Tamara Coorg",
    "Evolve Back Coorg",
    "Purple Palms Resort and spa",
    "The Burchwood retreat",
    "Coorg cliffs resort",
    "The IBNII- Eco Luxury resort",
    "Old Kent Estates and spa"
];
const location = [
    "1st Monnangeri Galibeedu Post, 571201 Madikeri, India",
    "Madikeri - Virajpet Road, 571201 Madikeri, India",
    "Kabbinakad Estate, Napoklu Nad, Yavakapadi Village, Madikeri Taluk, Kadagu District, 571212 Kakkabe, India ",
    "Karadigodu Post, Siddapur, 571253 Siddapur, India ",
    "Bollur Village, Guddehosur Post Kushalnagar coorg, 571234 Kushālnagar, India",
    "Mysore - Madikeri Road NH 245, Suntikoppa., 571237 Madikeri, India",
    "Hanchikad, Pollibetta, 571215 Ammatti, India",
    "123 Ibnivalavadi Village, Boikeri, 571201 Madikeri, India",
    " Thaikappa Estates, Post Box No. 4, Horoor Post, Suntikoppa, North Coorg, 571327 Suntikoppa, India"
];
const images = [
    "https://cf.bstatic.com/images/hotel/max1024x768/885/88538194.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/270/270441351.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/421/42190775.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/969/96963125.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/818/81880585.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/255/255911356.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/248/248267353.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/238/238711827.jpg",
    "https://cf.bstatic.com/images/hotel/max1024x768/213/213617156.jpg",
]
const description = [
    "Get the celebrity treatment with world-class service at Taj Madikeri Resort & Spa Coorg",
    "Coorg Wilderness Resort in Madikeri has 5-star accommodation with a fitness centre and a bar.",
    "The Tamara Coorg is a 5-star property about 8 km from Nalkanad Palace and Thadiandamol. Featuring contemporary resort-style decor, all guestrooms come with a private terrace where guests can enjoy fresh mountain air and watch birds. Free WiFi is available throughout the property.",
    "Located on the cool green hills of Coorg, this plantation resort boasts 4 dining options, an outdoor infinity pool and an ayurvedic spa. It also houses a gym and a children’s activity centre. Free Wi-Fi access is provided.",
    "Located 21 Km at the foothills of Madikeri, Kushalnagar. Purple Palms Resort & Spa boasts of an on-site restaurant, an outdoor pool and Spa. The resort has a gym, children’s playroom.",
    "All guest rooms at the resort come with a seating area, a flat-screen TV with satellite channels and a private bathroom with free toiletries and a shower. Guest rooms will provide guests with a wardrobe and a kettle. ",
    "Set in Ammatti, Coorg Cliffs Resorts has a garden and a terrace. Among the facilities of this property are a restaurant, room service and a shared lounge, along with free WiFi. The resort offers an outdoor swimming pool, fitness centre, evening entertainment and a 24-hour front desk",
    "Offering free WiFi, a sun terrace with a swimming pool, restaurant and free bikes, The IBNII - Eco Luxury Resort is set in Madikeri. Featuring a bar, the property is located within 5 km of Madikeri Fort. The accommodation offers a 24-hour front desk and a concierge service for guests.",
    "The Lodge features a games room, library, home theater, dining, and an English rose garden with exciting plantations and trekking activities. Individual cottages include a private garden. Signature Old Kent Spa therapies are also available. Free private parking spaces are provided. Superb Food & very warm Staff."
]
// module.exports = location;
// module.exports = names;
// module.exports = description;
const Resort        = require("./modules/resort");
const mongoose      = require("mongoose");
mongoose.connect('mongodb://localhost:27017/resortly',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true}).then(()=>{
    console.log("CONNECTION TO RESORTLY OPEN!!!");
}).catch((err)=>{
    console.log(err);
});
const seed = async (nam,loc,desc)=>{
    await Resort.deleteMany({});
    let resort;
    for(let i=0;i<nam.length;i++){
        resort = new Resort({title:nam[i],description:desc[i],location:loc[i],price:Math.floor(Math.random() * 10000),image:images[i]});
        await resort.save();
        console.log(resort);
    }
}
seed(names,location,description);
