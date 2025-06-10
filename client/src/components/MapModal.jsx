
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { Dialog, DialogTitle, DialogContent, Box, Button, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify'; // Assuming you use react-toastify

// Libraries required for Autocomplete and Geocoding
const libraries = ['places'];

// Map container and fixed pin styles
const mapContainerStyle = {
  height: '450px',
  width: '100%',
  maxWidth: '800px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  position: 'relative', // Crucial for pin positioning
};

const centerPinStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -100%)', // Centers the pin horizontally and aligns its bottom tip to the center
  width: '32px',
  height: '32px',
  backgroundImage: 'url("https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png")', // Default Google Maps pin
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  zIndex: 100, // Ensure pin is above the map
  pointerEvents: 'none', // Allows map interaction through the pin
};

// Default map center (Kollam, Kerala, India - as per your project location)
const defaultCenter = {
  lat: 8.8932,
  lng: 76.6141,
};

// Style for the dialog box itself (MUI Modal)
const dialogStyle = {
  '& .MuiDialog-paper': { // Target the Dialog paper (the actual modal content)
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  padding: '20px', // Add some padding inside the dialog
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

function MapModal({ open, handleClose, onLocationConfirm, googleMapsApiKey }) { // Added googleMapsApiKey prop
  const [map, setMap] = useState(null); // GoogleMap instance
  const [geocoder, setGeocoder] = useState(null); // Geocoder instance
  const [currentAddress, setCurrentAddress] = useState('Dragging map to find address...');
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [autocompleteInstance, setAutocompleteInstance] = useState(null); // Renamed to avoid conflict

  const addressInputRef = useRef(null); // Ref for the address input field inside the modal

  // Callback for when the GoogleMap instance is loaded
  const onLoadMap = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
    setGeocoder(new window.google.maps.Geocoder()); // Initialize Geocoder once Google Maps API is loaded

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userPos); // Center map on user's location
          mapInstance.setZoom(15); // Adjust zoom for user's location
          // No need to reverse geocode immediately, onIdle will handle it
        },
        () => {
          console.warn("Geolocation failed or denied. Defaulting to Kollam.");
          // No action needed, map remains at defaultCenter, onIdle will get its address
        }
      );
    } else {
      console.warn("Browser doesn't support Geolocation. Defaulting to Kollam.");
    }
  }, []);

  // Callback for when the map's camera stops moving (user drags, zooms, or autocomplete moves it)
  const onIdleMap = useCallback(() => {
    if (map && geocoder) {
      const centerOfMap = map.getCenter(); 
      setSelectedLatLng(centerOfMap);
      reverseGeocodeLatLng(centerOfMap);
    }
  }, [map, geocoder]); // Dependencies for useCallback

  // Reverse Geocoding function
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
  }, [geocoder]); // Dependencies for useCallback

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
        map.setZoom(17); // Set a good zoom level for the specific address
      }
      // The 'onIdleMap' callback will automatically update the displayed address
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }, [autocompleteInstance, map]); // Dependencies for useCallback

  // Handle confirmation of the location
  const handleConfirmLocation = () => {
    if (selectedLatLng && currentAddress && currentAddress !== 'Dragging map to find address...') {
      // Call the prop function with the confirmed location data
      onLocationConfirm({
        address: currentAddress,
        lat: selectedLatLng.lat(),
        lng: selectedLatLng.lng(),
      });
      handleClose(); // Close the modal after successful confirmation
    } else {
      toast.warning('Please select a valid location on the map before confirming.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={dialogStyle}>
      <DialogTitle id="map-selection-modal-title" sx={{ textAlign: 'center', pb: 0 }}>
        Select Delivery Location
      </DialogTitle>
      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
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

          <Box sx={mapContainerStyle}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={15}
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

        <Box sx={{
          marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #eee',
          borderRadius: '8px', width: 'calc(100% - 40px)', maxWidth: '760px', textAlign: 'center'
        }}>
          <Typography variant="body1" sx={{ color: '#555', marginBottom: '5px' }}>Current Pinned Location:</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222' }}>
            {currentAddress}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmLocation}
          sx={{ mt: 3, p: '12px 25px', fontSize: '18px' }}
        >
          Confirm This Location
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default MapModal;