const { sequelize, Hotel, User } = require('../models');

const seedDB = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Seed admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@udonhotels.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created');

    // Seed sample hotels in Udon Thani
    const hotels = [
      {
        name: 'The Cottage Hotel Udon Thani',
        description: 'Modern 3-star hotel near UD Town shopping center',
        price: 690,
        location: 'ใกล้ถนนมิตรภาพ',
        latitude: 17.422846425241005, 
        longitude: 102.78976792656303,
        imageUrl: 'https://www.chuwab.com/images/hotel/6/69/50069/91c18ce1d0cb02aa05939f5a5f63fcab.jpg',
        galleryImages: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['WiFi', 'Air Conditioning'],
        hotelType: 'Business Hotel',
        nearbyPlaces: ['UD Town', 'Central Plaza'],
        distanceToTechCollege: 3.5,
        rating: 0
      },
      {
        name: 'Central Udon Hotel',
        description: 'Premium hotel in the heart of Central Udon',
        price: 2500,
        location: 'Central Area',
        latitude: 17.4155,
        longitude: 102.7898,
        imageUrl: 'https://images.unsplash.com/photo-1611892726716-620d56d17dfa?w=400',
        galleryImages: [
          'https://images.unsplash.com/photo-1611892726716-620d56d17dfa?w=800'
        ],
        amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Gym'],
        hotelType: 'Luxury Hotel',
        nearbyPlaces: ['Central', 'Night Market'],
        distanceToTechCollege: 2.1,
        rating: 0
      },
      {
        name: 'Airport View Hotel',
        description: 'Convenient location near Udon Thani Airport',
        price: 900,
        location: 'Airport Area',
        latitude: 17.3879,
        longitude: 102.7839,
        imageUrl: 'https://images.unsplash.com/photo-1618693261537-efdc226daf57?w=400',
        galleryImages: [
          'https://images.unsplash.com/photo-1618693261537-efdc226daf57?w=800'
        ],
        amenities: ['WiFi', 'Air Conditioning', 'Free Airport Shuttle', 'Restaurant'],
        hotelType: 'Budget Hotel',
        nearbyPlaces: ['Airport', 'Highway'],
        distanceToTechCollege: 6.8,
        rating: 0
      },
      {
        name: 'Tech College Residence',
        description: 'Closest accommodation to Udon Technical College',
        price: 800,
        location: 'Tech College Area',
        latitude: 17.3845,
        longitude: 102.8156,
        imageUrl: 'https://images.unsplash.com/photo-1594059305742-f5deda007a26?w=400',
        galleryImages: [
          'https://images.unsplash.com/photo-1594059305742-f5deda007a26?w=800'
        ],
        amenities: ['WiFi', 'Parking', 'Study Area'],
        hotelType: 'Budget Hotel',
        nearbyPlaces: ['Udon Technical College', 'Campus'],
        distanceToTechCollege: 0.8,
        rating: 0
      },
      {
        name: 'Rimping Udon Hotel',
        description: 'Boutique hotel near Rimping supermarket',
        price: 1500,
        location: 'Rimping Area',
        latitude: 17.4000,
        longitude: 102.7950,
        imageUrl: 'https://images.unsplash.com/photo-1625244724120-1fd1d997038b?w=400',
        galleryImages: [
          'https://images.unsplash.com/photo-1625244724120-1fd1d997038b?w=800'
        ],
        amenities: ['WiFi', 'Parking', 'Restaurant', 'Café'],
        hotelType: 'Standard Hotel',
        nearbyPlaces: ['Rimping', 'Shopping Center'],
        distanceToTechCollege: 4.2,
        rating: 0
      }
    ];

    await Hotel.bulkCreate(hotels);
    console.log('Sample hotels seeded');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
