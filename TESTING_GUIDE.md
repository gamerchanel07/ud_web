# Hotel Management System - Testing Guide

## ✅ Completed Features

All 5 requested hotel form enhancements have been implemented:

### 1. **Image Upload & Gallery with Preview** ✅
- **Location:** AdminPage.jsx - Image Upload section
- **Features:**
  - Upload multiple images
  - Preview gallery with thumbnail grid
  - Delete individual images with X button
  - Images stored as base64 in `galleryImages` array
  - First gallery image displays in hotel cards (fallback to imageUrl)

### 2. **Amenities Selection** ✅
- **Location:** AdminPage.jsx - Amenities Selection section
- **Features:**
  - 12 checkbox options: WiFi, AC, Parking, Restaurant, Pool, Gym, etc.
  - Multi-select support
  - Amenities stored in database as JSON array
  - Display amenities in hotel detail page

### 3. **Auto-Distance Calculation** ✅
- **Location:** AdminPage.jsx - calculateDistance function
- **Features:**
  - Haversine formula for accurate distance calculation
  - Tech College coordinates hardcoded: `17.416112428032477, 102.78878300645938`
  - Distance auto-calculates when location selected on map
  - Displays in km with 2 decimal places

### 4. **Interactive Map Location Picker** ✅
- **Location:** HotelMapPicker.jsx component
- **Features:**
  - Leaflet-based interactive map
  - OpenStreetMap tiles (free, no API key needed)
  - Click on map to select location
  - Tech College marker always visible
  - Selected location marker shows coordinates
  - Distance auto-calculates on selection

### 5. **Gallery Images Display in All Pages** ✅
- **HotelCard.jsx (HomePage/Favorites):**
  - Updated to show first gallery image
  - Fallback to main imageUrl if no gallery
- **HotelDetailPage.jsx:**
  - Already has gallery grid display
  - Shows all galleryImages in 2x4 grid

---

## 🧪 Testing Checklist

### Backend Setup
```bash
cd d:\Project\Ud\server
npm install  # if needed
npm start
# Server should start on http://localhost:5000
```

### Frontend Setup
```bash
cd d:\Project\Ud\client
npm install  # if needed
npm run dev
# Frontend should start on http://localhost:5173
```

### Test 1: Login to Admin
- [ ] Go to http://localhost:5173
- [ ] Click "Login"
- [ ] Use credentials:
  - Email/Username: `admin`
  - Password: `admin123`
- [ ] Should redirect to admin panel

### Test 2: Add Hotel with Images
1. **Click "Add Hotel" Button**
   - [ ] Form appears with all sections

2. **Fill Basic Info**
   - [ ] Enter hotel name: "Test Hotel"
   - [ ] Enter location: "123 Main Street"
   - [ ] Enter price: "2500"
   - [ ] Select hotel type: "Standard Hotel"

3. **Upload Images**
   - [ ] Click file input
   - [ ] Select image from computer
   - [ ] Image preview appears in gallery
   - [ ] Repeat to add multiple images (3-4 recommended)
   - [ ] Click X to delete an image
   - [ ] Verify deletion works

4. **Select Location on Map**
   - [ ] Click "📍 Select Location on Map" button
   - [ ] Map modal opens
   - [ ] Tech College marker visible
   - [ ] Click anywhere on map to select hotel location
   - [ ] Confirmation shows coordinates
   - [ ] Click OK to confirm
   - [ ] Distance auto-calculated and displayed
   - [ ] **Verify:** Distance should be ~5-15km (adjust based on location)

5. **Select Amenities**
   - [ ] Check "WiFi"
   - [ ] Check "Restaurant"
   - [ ] Check "Pool"
   - [ ] Check "Gym"
   - [ ] Verify selections persist

6. **Add Description**
   - [ ] Enter description: "Beautiful hotel near tech college"

7. **Submit Form**
   - [ ] Click "✓ Add Hotel" button
   - [ ] Form clears and closes
   - [ ] Hotel appears in the list below

### Test 3: Verify Hotel in List
- [ ] New hotel appears in hotel cards grid
- [ ] Hotel image shows first gallery image (not imageUrl)
- [ ] Price displays correctly
- [ ] Distance to Tech College shows

### Test 4: View Hotel Details
- [ ] Click "View Details" on hotel card
- [ ] Hotel detail page loads
- [ ] **Gallery Section:**
  - [ ] All uploaded images display in grid
  - [ ] Images are properly sized
  - [ ] Grid layout looks good (2x4 responsive)
  
- [ ] **Amenities Section:**
  - [ ] Selected amenities display
  - [ ] Format is clean and readable
  
- [ ] **Location Section:**
  - [ ] Map shows hotel location
  - [ ] Distance to Tech College displays: "X.XX km"
  - [ ] "Open in Google Maps" button works

### Test 5: Language Switching
- [ ] Click language switcher (EN/TH) in navbar
- [ ] Admin panel labels change to Thai:
  - [ ] "เพิ่มโรงแรม" (Add Hotel)
  - [ ] "สิ่งอำนวยความสะดวก" (Amenities)
  - [ ] Location button text changes
- [ ] Switch back to English
- [ ] All labels update correctly

### Test 6: Data Persistence
- [ ] Refresh page (F5)
- [ ] Hotel still appears in list
- [ ] Hotel details load correctly
- [ ] All images, amenities, distance persist

### Test 7: Edit/Delete
- [ ] Click "Delete" on a hotel card
- [ ] Confirm deletion
- [ ] Hotel removes from list
- [ ] **Note:** Edit feature not yet implemented (can be added later)

---

## 📊 Database Schema

### Hotel Model Fields
```javascript
{
  id: INTEGER (PK),
  name: STRING (required),
  description: TEXT,
  price: DECIMAL(10, 2) (required),
  location: STRING (required),
  latitude: DECIMAL(10, 8) (required),
  longitude: DECIMAL(11, 8) (required),
  imageUrl: STRING,
  galleryImages: JSON (array of base64 strings),
  amenities: JSON (array of strings),
  hotelType: STRING,
  nearbyPlaces: JSON,
  distanceToTechCollege: DECIMAL(10, 2),
  rating: FLOAT (default: 0),
  createdAt: DATE,
  updatedAt: DATE
}
```

---

## 🐛 Known Issues & Troubleshooting

### Issue: Map doesn't load
**Solution:** 
- Verify Leaflet CSS is imported in HotelMapPicker.jsx
- Check browser console for errors
- Clear browser cache and refresh

### Issue: Images don't show in preview
**Solution:**
- Check file size (base64 encoding has limits)
- Verify FileReader API is working in browser
- Try different image format (JPG recommended)

### Issue: Distance calculation wrong
**Solution:**
- Verify tech college coordinates are correct
- Check latitude/longitude are numbers, not strings
- Formula: Haversine distance using R = 6371 km

### Issue: Amenities don't save
**Solution:**
- Verify backend accepts amenities array
- Check form submission includes amenities in data
- Check database field is JSON type

### Issue: Gallery images don't appear in hotel list
**Solution:**
- Verify `galleryImages` field exists in database
- Check HotelCard component uses correct field
- Ensure images are valid base64 strings

---

## 🔧 API Endpoints Used

### Add Hotel
```
POST /api/admin/hotels
Headers: Authorization: Bearer {token}
Body:
{
  name: string,
  description: string,
  price: number,
  location: string,
  latitude: number,
  longitude: number,
  imageUrl: string,
  galleryImages: [array of base64 strings],
  amenities: [array of strings],
  hotelType: string,
  distanceToTechCollege: number
}
```

### Get All Hotels
```
GET /api/hotels
Response:
[
  {
    id: number,
    name: string,
    galleryImages: array,
    amenities: array,
    distanceToTechCollege: number,
    ...
  }
]
```

### Get Hotel by ID
```
GET /api/hotels/{id}
Response: Full hotel object with reviews
```

---

## 📱 Frontend Files Modified/Created

**Created:**
- `client/src/components/HotelMapPicker.jsx` - Interactive map component

**Modified:**
- `client/src/pages/AdminPage.jsx` - Enhanced form with all 5 features
- `client/src/components/HotelCard.jsx` - Show gallery images in cards
- `client/src/locales/en.json` - Added amenities translation
- `client/src/locales/th.json` - Added amenities translation

**Backend (No changes needed):**
- Hotel model already has galleryImages, amenities, distanceToTechCollege
- Admin controller already handles these fields
- Routes already configured

---

## ✨ Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Image Upload | ✅ Done | AdminPage - Image Upload section |
| Image Preview | ✅ Done | AdminPage - Gallery grid with delete |
| Amenities Selection | ✅ Done | AdminPage - 12 checkboxes |
| Auto-Distance Calculation | ✅ Done | AdminPage - Haversine formula |
| Map Location Picker | ✅ Done | HotelMapPicker.jsx component |
| Gallery Display (List) | ✅ Done | HotelCard.jsx - First image shown |
| Gallery Display (Details) | ✅ Done | HotelDetailPage.jsx - Grid view |
| Language Support | ✅ Done | en.json, th.json translations |
| Data Persistence | ✅ Done | Database fields ready |

---

## 🚀 Next Steps (Optional Enhancements)

1. **Edit Hotel Form** - Allow updating existing hotels
2. **Image Compression** - Reduce base64 file size
3. **Image Upload** - Replace base64 with file upload to server
4. **Gallery Carousel** - Swipeable image slider
5. **Admin Upload UI** - Drag-and-drop for images
6. **Batch Operations** - Delete multiple hotels at once
7. **Hotel Search** - Filter by amenities in search

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Check server logs for API errors
3. Verify database connection
4. Clear localStorage: `localStorage.clear()`
5. Restart both server and client

