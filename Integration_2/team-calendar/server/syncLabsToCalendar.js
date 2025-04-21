// server/syncLabsToCalendar.js
const axios = require('axios');

async function syncLabsToCalendar() {
  try {
    // Step 1: Get all existing events from the calendar
    const { data: existingEvents } = await axios.get('http://localhost:5000/api/events');
    console.log(`Found ${existingEvents.length} existing events in calendar`);
    
    // Step 2: Get all labs
    const { data: labs } = await axios.get('http://localhost:8004/labs/');
    console.log(`Found ${labs.length} labs to process`);
    
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    for (const lab of labs) {
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
    
    console.log(`✅ Sync completed: ${successCount} created, ${skipCount} skipped (already exist), ${failCount} failed`);
  } catch (err) {
    console.error("🚫 Sync error:", err.message);
  }
}

// Execute the function
syncLabsToCalendar();

module.exports = syncLabsToCalendar;