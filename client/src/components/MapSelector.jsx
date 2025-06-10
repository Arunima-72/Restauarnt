

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { Box, Button, TextField, Typography } from '@mui/material'; 
import { toast } from 'react-toastify'; 

// --- Google Maps Specific Configurations ---
const libraries = ['places']; // Required for Autocomplete and Geocoding APIs
// const googleMapsApiKey =import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const mapContainerStyle = {
  height: '450px',
  width: '100%',
  maxWidth: '800px', 
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  position: 'relative', 
};

const centerPinStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -100%)', // Centers the pin horizontally and aligns its bottom tip to the center
  width: '32px', // Size of the pin image
  height: '32px', // Size of the pin image
  backgroundImage: 'url("https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png")', // Default Google Maps pin
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  zIndex: 100, // Ensure pin is above the map
  pointerEvents: 'none', // Allows map interaction through the pin
};

// Default center for the map (Kollam, Kerala, India)
const defaultCenter = {
  lat: 8.8932,
  lng: 76.6141,
};

// --- MapSelector Component ---
// This component now encapsulates the Google Maps logic
function MapSelector({ googleMapsApiKey, onLocationConfirm, initialLat, initialLng, initialAddress }) {
  const [map, setMap] = useState(null); // GoogleMap instance
  const [geocoder, setGeocoder] = useState(null); // Google Geocoder instance
  const [currentAddress, setCurrentAddress] = useState('Dragging map to find address...');
  const [selectedLatLng, setSelectedLatLng] = useState(null); // LatLng of the current pin location
  const [autocompleteInstance, setAutocompleteInstance] = useState(null); // Autocomplete instance

  const addressInputRef = useRef(null); 

  // Set initial map center based on props or default
  const mapCenter = initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter;

  // Callback for when the GoogleMap instance is loaded
  const onLoadMap = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
    setGeocoder(new window.google.maps.Geocoder()); // Initialize Geocoder once Google Maps API is loaded

    // Attempt to set map to user's current location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userPos);
          mapInstance.setZoom(15);
        },
        () => {
          console.warn("Geolocation failed or denied. Defaulting to provided or default center.");
          mapInstance.setCenter(mapCenter); 
        }
      );
    } else {
      console.warn("Browser doesn't support Geolocation. Defaulting to provided or default center.");
      mapInstance.setCenter(mapCenter); 
    }
  }, [mapCenter]); // Re-run if mapCenter changes

  const onIdleMap = useCallback(() => {
    if (map && geocoder) {
      const centerOfMap = map.getCenter(); 
      setSelectedLatLng(centerOfMap);
      reverseGeocodeLatLng(centerOfMap);
    }
  }, [map, geocoder]);

  
  const reverseGeocodeLatLng = useCallback((latlng) => {
    setCurrentAddress('Finding address...');
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setCurrentAddress(results[0].formatted_address);
        } else {
          setCurrentAddress('No address found for this location.');
        }
      } else {
        setCurrentAddress(`Geocoder failed: ${status}`);
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }, [geocoder]);

  // Autocomplete load handler
  const onLoadAutocomplete = useCallback((autocomplete) => {
    setAutocompleteInstance(autocomplete);
  }, []);

  // Autocomplete place selection handler
  const onPlaceChanged = useCallback(() => {
    if (autocompleteInstance !== null && map) {
      const place = autocompleteInstance.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error('Autocomplete returned place with no geometry');
        if (addressInputRef.current) {
          addressInputRef.current.placeholder = 'Search again or drag map';
        }
        return;
      }

      // If the place has a geometry, pan the map to that location
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // A good zoom level for specific addresses
      }
      // The 'onIdleMap' callback will automatically update the displayed address
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }, [autocompleteInstance, map]);

  // Handle confirmation of the location
  const handleConfirmLocation = () => {
    if (selectedLatLng && currentAddress && currentAddress !== 'Dragging map to find address...') {
      // Call the prop function with the confirmed location data
      onLocationConfirm({
        address: currentAddress,
        lat: selectedLatLng.lat(),
        lng: selectedLatLng.lng(),
      });
      toast.success('Location confirmed!');
    } else {
      toast.warning('Please select a valid location on the map before confirming.');
    }
  };

  return (
    <div className="my-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label className="block mb-2 font-semibold">🗺️ Select Delivery Location on Map</label>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
        {/* Address Search Input */}
        <Box sx={{ width: 'calc(100% - 40px)', maxWidth: '500px', marginBottom: '15px' }}>
          <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
            <TextField
              inputRef={addressInputRef}
              fullWidth
              type="text"
              placeholder="Search for an address or drag the map"
              variant="outlined"
              size="small"
            />
          </Autocomplete>
        </Box>

        {/* Map Container */}
        <Box sx={mapContainerStyle}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter} // Use dynamic center
            zoom={15} // Default zoom
            onLoad={onLoadMap}
            onIdle={onIdleMap}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: true,
            }}
          >
            {/* The fixed pin overlay */}
            <div style={centerPinStyle}></div>
          </GoogleMap>
        </Box>
      </LoadScript>

      {/* Display Current Pinned Address */}
      <Box sx={{
        marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #eee',
        borderRadius: '8px', width: 'calc(100% - 40px)', maxWidth: '760px', textAlign: 'center'
      }}>
        <Typography variant="body1" sx={{ color: '#555', marginBottom: '5px' }}>Current Pinned Location:</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222' }}>
          {currentAddress}
        </Typography>
      </Box>

      {/* Confirm Button */}
      <Button
        variant="contained"
        color="primary" // Use primary or orange theme color
        onClick={handleConfirmLocation}
        sx={{ mt: 3, p: '12px 25px', fontSize: '18px' }}
      >
        Confirm This Location
      </Button>
    </div>
  );
}

export default MapSelector;