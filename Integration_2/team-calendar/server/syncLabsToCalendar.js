const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Path for the cache file
const CACHE_FILE_PATH = path.join(__dirname, 'labs-cache.json');

async function syncLabsToCalendar() {
  try {
    // Step 1: Get all existing events from the calendar
    const { data: existingEvents } = await axios.get('http://localhost:5000/api/events');
    console.log(`Found ${existingEvents.length} existing events in calendar`);
    
    // Step 2: Get all labs from API
    const { data: currentLabs } = await axios.get('http://localhost:8004/labs/');
    console.log(`Found ${currentLabs.length} labs from API`);
    
    // Step 3: Load the previous labs cache if it exists
    let previousLabs = [];
    try {
      if (fs.existsSync(CACHE_FILE_PATH)) {
        const cacheData = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
        previousLabs = JSON.parse(cacheData);
        console.log(`Loaded ${previousLabs.length} labs from cache`);
      } else {
        console.log('No cache file found, will create a new one');
      }
    } catch (cacheErr) {
      console.error('Error reading cache file:', cacheErr.message);
      // Continue with an empty previous labs array
    }
    
    // Step 4: Find labs that have been deleted (exist in previous cache but not in current API response)
    const currentLabIds = new Set(currentLabs.map(lab => lab.id));
    const deletedLabs = previousLabs.filter(lab => !currentLabIds.has(lab.id));
    
    console.log(`Detected ${deletedLabs.length} deleted labs`);
    
    // Step 5: Delete calendar events for labs that no longer exist
    let deleteCount = 0;
    for (const deletedLab of deletedLabs) {
      // Find the corresponding event in the calendar
      const eventToDelete = existingEvents.find(event => 
        event.labId === deletedLab.id || 
        (event.title === deletedLab.name && event.desc?.includes(deletedLab.description.substring(0, 30)))
      );
      
      if (eventToDelete) {
        try {
          console.log(`🗑️ Deleting event for removed lab: "${deletedLab.name}"`);
          await axios.delete(`http://localhost:5000/api/events/${eventToDelete._id}`);
          console.log(`✅ Deleted event: "${deletedLab.name}" (ID: ${eventToDelete._id})`);
          deleteCount++;
        } catch (deleteErr) {
          console.error(`❌ Failed to delete event for lab: "${deletedLab.name}"`, deleteErr.response?.data || deleteErr.message);
        }
      } else {
        console.log(`⚠️ No matching event found for deleted lab: "${deletedLab.name}"`);
      }
    }
    
    // Step 6: Add new lab events
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    for (const lab of currentLabs) {
      // Check if event already exists (using lab.id to identify duplicates)
      const eventExists = existingEvents.some(event => 
        event.labId === lab.id || 
        (event.title === lab.name && event.desc?.includes(lab.description.substring(0, 30)))
      );
      
      if (eventExists) {
        console.log(`⏭️ Skipping: "${lab.name}" - Event already exists`);
        skipCount++;
        continue;
      }
      
      // Format dates properly - ensure they are valid date strings
      const startDate = new Date(lab.created_at);
      const endDate = new Date(lab.updated_at);
      
      // Create event object that matches your Event model
      const event = {
        title: lab.name,
        desc: `${lab.description}\n\nDifficulty: ${lab.difficulty}\nType: ${lab.lab_type}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: false,
        createdBy: lab.lab_type,
        labId: lab.id  // Store reference to original lab ID
      };

      try {
        console.log(`🔄 Creating event: "${lab.name}"`);
        const response = await axios.post('http://localhost:5000/api/events', event);
        console.log(`✅ Created event: "${lab.name}" (ID: ${response.data._id || 'unknown'})`);
        successCount++;
      } catch (postErr) {
        console.error(`❌ Failed to create event: "${lab.name}"`, postErr.response?.data || postErr.message);
        failCount++;
      }
    }
    
    // Step 7: Update the cache file with current labs
    try {
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(currentLabs, null, 2));
      console.log('✅ Updated labs cache file');
    } catch (writeErr) {
      console.error('❌ Failed to update cache file:', writeErr.message);
    }
    
    console.log(`✅ Sync completed: ${successCount} created, ${skipCount} skipped (already exist), ${failCount} failed, ${deleteCount} deleted`);
  } catch (err) {
    console.error("🚫 Sync error:", err.message);
  }
}

// Execute the function
syncLabsToCalendar();

module.exports = syncLabsToCalendar;
